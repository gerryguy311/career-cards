import { ROLES, TARGETS, STYLES, plan, sortByLabel, fallbackReason, fallbackSynopsis, colorWords } from './logic.js';

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

fill($('#start'), sortByLabel(ROLES, ['none']), { none: 'Something outside cyber or IT' });
fill($('#current'), sortByLabel(ROLES, ['none']));
fill($('#target'), sortByLabel(TARGETS));
fill($('#style'), sortByLabel(STYLES));
$('#target').value = 'ciso';

function syncStage() {
  const mid = $('#stage').value !== 'starting';
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
  const syn = $('#synopsis');
  syn.textContent = state.synopsis || 'Writing your story…';
  syn.classList.toggle('loading', !state.synopsis);
  cardsEl.innerHTML = state.phases.map((p, i) => `
    <div class="phase">
      <p class="label">${escapeHtml(p.label)}</p>
      ${p.card
        ? `<a href="${p.card.uri}" target="_blank" rel="noopener"><img src="${p.card.image}" alt="${escapeHtml(p.card.name)}" width="488" height="680"></a>`
        : '<div class="nocard">No card found</div>'}
      <p class="role">${escapeHtml(p.role)}</p>
      <p class="caption">${escapeHtml(p.caption)}</p>
      <p class="why"><b>Why these colors:</b> ${escapeHtml(p.why || '')}</p>
      <p class="reason${p.reason ? '' : ' loading'}">${escapeHtml(p.reason || 'Reading the cards…')}</p>
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

async function explain(indexes) {
  const phases = indexes.map((i) => state.phases[i]);
  let reasons = null;
  let synopsis = null;
  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: state.name,
        stage: state.stage,
        notes: state.notes,
        reasonsFor: indexes,
        phases: state.phases.map((p) => ({
          label: p.label,
          role: p.role,
          guild: p.guild,
          words: colorWords(p.colors),
          card: p.card ? { name: p.card.name, type: p.card.type, text: p.card.text } : null,
        })),
      }),
    });
    if (res.ok) ({ reasons, synopsis } = await res.json());
  } catch {
    reasons = null;
  }
  phases.forEach((p, k) => {
    p.reason = (reasons && reasons[k]) || fallbackReason(p);
  });
  state.synopsis = synopsis || fallbackSynopsis(state.phases, state.name);
  render();
}

async function redraw(i) {
  const p = state.phases[i];
  const used = new Set(state.phases.map((x) => x.card && x.card.name).filter(Boolean));
  p.card = pick(await cardsFor(p.colors), used) || p.card;
  p.reason = '';
  state.synopsis = '';
  render();
  explain([i]);
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
    state = { name: answers.name, stage: answers.stage, notes: answers.notes, phases };
    render();
    explain([0, 1, 2]);
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
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) shown[maxLines - 1] = fitLine(ctx, `${shown[maxLines - 1]} ${lines[maxLines]}`, maxW);
  shown.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return y + shown.length * lineH;
}

function fitLine(ctx, text, maxW) {
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
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

  if (state.synopsis) {
    ctx.fillStyle = '#EADFC8';
    ctx.font = 'italic 400 26px "EB Garamond"';
    wrap(ctx, state.synopsis, 128, 240, 1664, 32, 2);
  }

  const cw = 300;
  const ch = 418;
  const gap = 190;
  const x0 = (W - (cw * 3 + gap * 2)) / 2;
  const y0 = 304;

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
    ctx.font = '700 24px Cinzel';
    ctx.fillText(p.label.toUpperCase(), x + cw / 2, y0 + ch + 46);
    ctx.fillStyle = '#F3E6C8';
    ctx.font = '600 28px "EB Garamond"';
    let after = wrap(ctx, p.role, x + cw / 2, y0 + ch + 82, cw + 150, 30, 2);
    ctx.fillStyle = '#C9B48A';
    ctx.font = 'italic 400 24px "EB Garamond"';
    after = wrap(ctx, p.caption, x + cw / 2, after, cw + 150, 28, 2);
    if (p.reason) {
      ctx.fillStyle = '#EADFC8';
      ctx.font = '400 21px "EB Garamond"';
      wrap(ctx, p.reason, x + cw / 2, after + 6, cw + 150, 25, 3);
    }
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
  ctx.fillText(creditsLine(), W / 2, 1014);
  ctx.textAlign = 'left';
  ctx.font = '700 22px Cinzel';
  ctx.fillStyle = '#E0B354';
  ctx.fillText('SIMPLY CYBER', 128, 1054);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#B8A98A';
  ctx.fillText('Find your color at simplycyber.io', 1792, 1054);
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
