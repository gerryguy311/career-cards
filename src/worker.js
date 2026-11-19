// Career Cards Worker: serves the static site and proxies Scryfall politely.
// Scryfall asks for a real User-Agent and an Accept header on every API call,
// and caps /cards/search at 2 requests per second, so results are cached for a day.

const UA = 'SimplyCyberCareerCards/1.0 (+https://simplycyber.io)';
const DAY = 60 * 60 * 24;
const MAX_CARDS = 40;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/commanders') return commanders(request, url, ctx);
    if (url.pathname === '/api/img') return image(request, url, ctx);
    if (url.pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404);
    return env.ASSETS.fetch(request);
  },
};

function json(body, status = 200, maxAge = 0) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
    },
  });
}

function normalizeId(raw) {
  const set = new Set(String(raw || '').toLowerCase().split(''));
  return 'wubrg'.split('').filter((c) => set.has(c)).join('');
}

async function scryfallSearch(q) {
  const api = new URL('https://api.scryfall.com/cards/search');
  api.searchParams.set('q', q);
  api.searchParams.set('order', 'edhrec');
  api.searchParams.set('unique', 'cards');
  return fetch(api, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
}

function trimCard(c) {
  const face = c.image_uris ? c : (c.card_faces && c.card_faces[0]) || {};
  const imgs = face.image_uris || {};
  if (!imgs.normal) return null;
  return {
    name: c.name,
    image: imgs.normal,
    large: imgs.large || imgs.normal,
    artist: c.artist || face.artist || 'Unknown artist',
    uri: c.scryfall_uri,
  };
}

export async function commanders(request, url, ctx) {
  const id = normalizeId(url.searchParams.get('id'));
  if (!id) return json({ error: 'Pass ?id= with one to five of w, u, b, r, g' }, 400);

  const cache = caches.default;
  const key = new Request(`${url.origin}/api/commanders?id=${id}`, { method: 'GET' });
  const hit = await cache.match(key);
  if (hit) return hit;

  // Paper-legal legendary creatures with exactly this color identity, most popular first.
  const base = `t:legendary t:creature id=${id} legal:commander game:paper -is:funny`;
  let res = await scryfallSearch(`${base} -is:universesbeyond`);
  if (!res.ok) res = await scryfallSearch(base);
  if (!res.ok) return json({ error: 'Card search failed', status: res.status }, 502);

  const data = await res.json();
  const cards = (data.data || []).map(trimCard).filter(Boolean).slice(0, MAX_CARDS);
  const out = json({ id, cards }, 200, DAY);
  ctx.waitUntil(cache.put(key, out.clone()));
  return out;
}

export async function image(request, url, ctx) {
  let target;
  try {
    target = new URL(url.searchParams.get('u') || '');
  } catch {
    return json({ error: 'Bad image URL' }, 400);
  }
  if (target.protocol !== 'https:' || target.hostname !== 'cards.scryfall.io') {
    return json({ error: 'Only Scryfall card images are allowed' }, 400);
  }

  const cache = caches.default;
  const key = new Request(`${url.origin}/api/img?u=${encodeURIComponent(target.href)}`, { method: 'GET' });
  const hit = await cache.match(key);
  if (hit) return hit;

  const res = await fetch(target, { headers: { 'User-Agent': UA } });
  if (!res.ok) return json({ error: 'Image fetch failed', status: res.status }, 502);
  const out = new Response(res.body, {
    headers: {
      'content-type': res.headers.get('content-type') || 'image/jpeg',
      'cache-control': `public, max-age=${DAY * 7}`,
    },
  });
  ctx.waitUntil(cache.put(key, out.clone()));
  return out;
}
