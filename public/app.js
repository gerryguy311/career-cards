import { ROLES, TARGETS, STYLES, plan } from './logic.js';

const $ = (sel) => document.querySelector(sel);
const form = $('#quiz');
const result = $('#result');
const cardsEl = $('#cards');
const pool = new Map(); // color id -> list of cards from /api/commanders
let state = null; // { name, phases: [{...phase, card}] }

function fill(select, items, relabel = {}) {
  select.innerHTML = items
    .map((x) => `<option value="${x.id}">${relabel[x.id] || x.label}</option>`)
    .join('');
}

fill($('#start'), ROLES, { none: 'Something outside cyber or IT' });
fill($('#current'), ROLES);
fill($('#target'), TARGETS);
fill($('#style'), STYLES);
$('#target').value = 'ciso';

function syncStage() {
  const mid = $('#stage').value === 'mid';
  document.querySelectorAll('.mid-only').forEach((el) => { el.hidden = !mid; });
  if (mid && $('#current').value === 'none') $('#current').value = 'soc';
}
$('#stage').addEventListener('change', syncStage);
syncStage();

async function cardsFor(id) {
  if (pool.has(id)) return pool.get(id);
  const res = await fetch(`/api/commanders?id=${id}`);
  if (!res.ok) throw new Error(`Card search failed (${res.status})`);
  const data = await res.json();
  pool.set(id, data.cards || []);
  return pool.get(id);
}

function pick(list, used) {
  const top = list.slice(0, 25).filter((c) => !used.has(c.name));
  const choices = top.length ? top : list.filter((c) => !used.has(c.name));
  if (!choices.length) return list[0] || null;
  return choices[Math.floor(Math.random() * choices.length)];
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function render() {
  const title = state.name ? `${state.name}’s career in three cards` : 'My career in three cards';
  $('#result-title').textContent = title;
  cardsEl.innerHTML = state.phases.map((p, i) => `
    <div class="phase">
      <p class="label">${escapeHtml(p.label)}</p>
      ${p.card
        ? `<a href="${p.card.uri}" target="_blank" rel="noopener"><img src="${p.card.image}" alt="${escapeHtml(p.card.name)}" width="488" height="680"></a>`
        : '<div class="nocard">No card found</div>'}
      <p class="role">${escapeHtml(p.role)}</p>
      <p class="caption">${escapeHtml(p.caption)}</p>
      <button type="button" class="redraw" data-i="${i}">Redraw</button>
    </div>
    ${i < 2 ? '<div class="arrow" aria-hidden="true"></div>' : ''}`).join('');
  $('#credits').textContent = creditsLine();
  cardsEl.querySelectorAll('.redraw').forEach((b) => b.addEventListener('click', () => redraw(Number(b.dataset.i))));
}

function creditsLine() {
  const parts = state.phases.filter((p) => p.card).map((p) => `${p.card.name} (art: ${p.card.artist})`);
  return `${parts.join(' · ')}. Images via Scryfall. © Wizards of the Coast.`;
}

async function redraw(i) {
  const p = state.phases[i];
  const used = new Set(state.phases.map((x) => x.card && x.card.name).filter(Boolean));
  p.card = pick(await cardsFor(p.colors), used) || p.card;
  render();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Shuffling…';
  try {
    const answers = {
      name: $('#name').value.trim().slice(0, 24),
      stage: $('#stage').value,
      start: $('#start').value,
      current: $('#current').value,
      target: $('#target').value,
      style: $('#style').value,
      notes: $('#notes').value,
    };
    const phases = plan(answers);
    const used = new Set();
    for (const p of phases) {
      const card = pick(await cardsFor(p.colors), used);
      if (card) used.add(card.name);
      p.card = card;
    }
    state = { name: answers.name, phases };
    render();
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    alertBox(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Draw my cards';
  }
});

function alertBox(msg) {
  let el = $('#error');
  if (!el) {
    el = document.createElement('p');
    el.id = 'error';
    el.className = 'error';
    form.appendChild(el);
  }
  el.textContent = `Something went wrong drawing your cards: ${msg}. Please try again.`;
}

$('#again').addEventListener('click', () => {
  result.hidden = true;
  form.scrollIntoView({ behavior: 'smooth' });
});

// ---------- Shareable image (1920 x 1080) ----------

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load a card image'));
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx, text, x, y, maxW, lineH, maxLines = 2) {
  const words = String(text).split(' ');
  let line = '';
  let lines = 0;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y);
      y += lineH;
      lines += 1;
      line = w;
      if (lines >= maxLines) return y;
    } else {
      line = test;
    }
  }
  if (line && lines < maxLines) ctx.fillText(line, x, y);
  return y + lineH;
}

async function buildImage() {
  await Promise.all([
    document.fonts.load('700 60px Cinzel'),
    document.fonts.load('400 28px "EB Garamond"'),
    document.fonts.load('italic 400 26px "EB Garamond"'),
  ]);
  const W = 1920;
  const H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 1100);
  bg.addColorStop(0, '#2E2118');
  bg.addColorStop(1, '#120C09');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#C9A86A';
  ctx.font = '700 24px Cinzel';
  ctx.fillText('UNTAP, UPKEEP, LEVEL UP', 128, 104);
  ctx.fillStyle = '#E8C77A';
  ctx.font = '700 60px Cinzel';
  ctx.fillText(state.name ? `${state.name}’s career in three cards` : 'My career in three cards', 128, 172);
  const rule = ctx.createLinearGradient(128, 0, 1792, 0);
  rule.addColorStop(0, '#E0B354');
  rule.addColorStop(0.6, '#8E2216');
  rule.addColorStop(1, '#2A1E15');
  ctx.fillStyle = rule;
  ctx.fillRect(128, 196, 1664, 3);

  const cw = 360;
  const ch = 502;
  const gap = 160;
  const x0 = (W - (cw * 3 + gap * 2)) / 2;
  const y0 = 236;

  const imgs = await Promise.all(state.phases.map((p) => (p.card
    ? loadImage(`/api/img?u=${encodeURIComponent(p.card.large || p.card.image)}`)
    : Promise.resolve(null))));

  state.phases.forEach((p, i) => {
    const x = x0 + i * (cw + gap);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 14;
    roundRect(ctx, x, y0, cw, ch, 18);
    ctx.fillStyle = '#2A1E15';
    ctx.fill();
    ctx.restore();
    if (imgs[i]) {
      ctx.save();
      roundRect(ctx, x, y0, cw, ch, 18);
      ctx.clip();
      ctx.drawImage(imgs[i], x, y0, cw, ch);
      ctx.restore();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#E0B354';
    ctx.font = '700 26px Cinzel';
    ctx.fillText(p.label.toUpperCase(), x + cw / 2, y0 + ch + 52);
    ctx.fillStyle = '#F3E6C8';
    ctx.font = '600 30px "EB Garamond"';
    const after = wrap(ctx, p.role, x + cw / 2, y0 + ch + 92, cw + 100, 34, 2);
    ctx.fillStyle = '#C9B48A';
    ctx.font = 'italic 400 26px "EB Garamond"';
    wrap(ctx, p.caption, x + cw / 2, after + 4, cw + 100, 30, 2);
    ctx.textAlign = 'left';

    if (i < 2) {
      const ax = x + cw + gap / 2;
      const ay = y0 + ch / 2;
      ctx.fillStyle = '#B8862A';
      ctx.beginPath();
      ctx.moveTo(ax - 34, ay - 18);
      ctx.lineTo(ax + 6, ay - 18);
      ctx.lineTo(ax + 6, ay - 34);
      ctx.lineTo(ax + 40, ay);
      ctx.lineTo(ax + 6, ay + 34);
      ctx.lineTo(ax + 6, ay + 18);
      ctx.lineTo(ax - 34, ay + 18);
      ctx.closePath();
      ctx.fill();
    }
  });

  ctx.fillStyle = '#B8A98A';
  ctx.font = '400 20px "EB Garamond"';
  ctx.textAlign = 'center';
  ctx.fillText(creditsLine(), W / 2, 1000);
  ctx.textAlign = 'left';
  ctx.font = '700 22px Cinzel';
  ctx.fillStyle = '#E0B354';
  ctx.fillText('SIMPLY CYBER', 128, 1044);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#B8A98A';
  ctx.fillText('Find your color at simplycyber.io', 1792, 1044);
  ctx.textAlign = 'left';
  return canvas;
}

$('#download').addEventListener('click', async () => {
  const btn = $('#download');
  btn.disabled = true;
  btn.textContent = 'Building image…';
  try {
    const canvas = await buildImage();
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'my-career-in-magic-cards.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  } catch (err) {
    alert(`Could not build the image: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Download image';
  }
});
