# Untap, Upkeep, Level Up: Career Cards

Answer a few questions and get your cybersecurity career as three Magic: The Gathering cards: where you started (or are now), where you are next, and where you're headed. It's a companion to Gerald Auger, PhD's talk *Untap, Upkeep, Level Up: What Magic: The Gathering Teaches Us About Crushing a Cyber Career*.

## How it works

- `public/` is the static site (HTML, CSS, JS). `public/logic.js` holds all the career-to-color rules: roles, dream roles, work styles, keywords, and guild names. Edit that file to change how cards are picked.
- `src/worker.js` is a Cloudflare Worker. It serves `public/` and adds two routes:
  - `/api/commanders?id=wr` finds paper-legal legendary creatures with that exact color identity on Scryfall, most popular first, cached for 24 hours.
  - `/api/img?u=...` proxies card images from `cards.scryfall.io` only, so the browser can draw them into the downloadable PNG.
  - `/api/explain` asks Workers AI for a one-sentence "why this card" line per card. It is capped at 20 calls per minute per visitor IP. If AI is unavailable, the page falls back to a plain rule-written line. The model name is `AI_MODEL` at the top of `src/worker.js`.
- Scryfall rules followed: a descriptive User-Agent and an Accept header on every API call, caching to stay well under the search rate limit, and full card images so the artist credit stays visible.

## The color rules

| Color | Practitioner style | Example roles |
| --- | --- | --- |
| White | Structure | GRC, privacy, audit |
| Blue | Knowledge | Threat intel, security engineering, architecture |
| Black | Ambition | Pentesting, red team |
| Red | Speed | SOC, incident response |
| Green | Growth | Sysadmin, network, cloud |

Phase 1 is your starting color. Each phase adds at least one color, and your first color always carries forward as your "commander."

## Run locally

```
npm install
npm test
npx wrangler dev
```

## Deploy

Cloudflare Workers, connected to this GitHub repo so a push to `main` deploys. Config is in `wrangler.jsonc`.

## Legal

Untap, Upkeep, Level Up is unofficial Fan Content permitted under the Fan Content Policy. Not approved or endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC. Card data and images are provided by Scryfall. This project is not affiliated with Scryfall. Keep the tool free and ungated.
