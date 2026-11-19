import assert from 'node:assert/strict';
const store = new Map();
globalThis.caches = { default: { match: async (r) => store.get(r.url), put: async (r, res) => { store.set(r.url, res); } } };
const calls = [];
globalThis.fetch = async (u, opts) => {
  calls.push({ u: String(u), opts });
  const s = String(u);
  if (s.includes('universesbeyond')) return new Response('{"object":"error"}', { status: 400 });
  return new Response(JSON.stringify({ data: [
    { name: 'Aurelia, the Warleader', artist: 'Slawomir Maniak', scryfall_uri: 'https://scryfall.com/x', image_uris: { normal: 'https://cards.scryfall.io/normal/a.jpg', large: 'https://cards.scryfall.io/large/a.jpg' } },
    { name: 'Two Face', card_faces: [{ artist: 'A', image_uris: { normal: 'https://cards.scryfall.io/normal/b.jpg' } }] },
    { name: 'No Image' },
  ] }), { status: 200 });
};
const worker = (await import('../src/worker.js')).default;
const ctx = { waitUntil: (p) => p };
const env = { ASSETS: { fetch: async () => new Response('asset') } };
let res = await worker.fetch(new Request('https://x.dev/api/commanders?id=rw'), env, ctx);
assert.equal(res.status, 200);
const body = await res.json();
assert.equal(body.id, 'wr');
assert.equal(body.cards.length, 2);
assert.equal(calls.length, 2, 'should retry without the UB filter');
assert.equal(calls[0].opts.headers['User-Agent'].startsWith('SimplyCyberCareerCards'), true);
assert.equal(calls[0].opts.headers.Accept, 'application/json');
await new Promise((r) => setTimeout(r, 0));
res = await worker.fetch(new Request('https://x.dev/api/commanders?id=wr'), env, ctx);
assert.equal(calls.length, 2, 'second call should come from cache');
res = await worker.fetch(new Request('https://x.dev/api/img?u=' + encodeURIComponent('https://evil.example/a.jpg')), env, ctx);
assert.equal(res.status, 400);
res = await worker.fetch(new Request('https://x.dev/api/commanders?id=zz'), env, ctx);
assert.equal(res.status, 400);
res = await worker.fetch(new Request('https://x.dev/'), env, ctx);
assert.equal(await res.text(), 'asset');
console.log('All worker tests passed.');
