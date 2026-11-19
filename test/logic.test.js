import assert from 'node:assert/strict';
import { plan, normalize, textWeights, ROLES, TARGETS, STYLES } from '../public/logic.js';

// Gerald's own arc: GRC start, manager with SecOps now, founder/educator goal.
const gerald = plan({ stage: 'mid', start: 'grc', current: 'manager', target: 'founder', style: 'w', notes: '' });
assert.deepEqual(gerald.map((p) => p.colors), ['w', 'wr', 'wubrg']);
assert.equal(gerald[1].guild, 'Boros');

// Starter with no cyber job who likes breaking things and wants to be a pentester.
const starter = plan({ stage: 'starting', current: 'none', target: 'pentest', style: 'b', notes: 'I do CTFs and a homelab' });
assert.equal(starter[0].colors, 'b');
assert.equal(starter[0].role, 'Exploring cyber');

// Every combination must give three non-empty, growing identities.
for (const stage of ['starting', 'mid']) {
  for (const r of ROLES) {
    for (const t of TARGETS) {
      for (const s of STYLES) {
        const ps = plan({ stage, start: r.id, current: r.id, target: t.id, style: s.id, notes: '' });
        assert.equal(ps.length, 3);
        ps.forEach((p) => {
          assert.ok(p.colors.length >= 1 && p.colors.length <= 5, `bad identity ${p.colors}`);
          assert.equal(p.colors, normalize(p.colors));
          assert.ok(p.guild && p.guild !== 'Colorless');
        });
        assert.ok(ps[1].colors !== ps[0].colors || ps[0].colors === 'wubrg', `phase 2 did not grow: ${stage} ${r.id} ${t.id} ${s.id}`);
        assert.ok(ps[2].colors !== ps[1].colors || ps[1].colors === 'wubrg', `phase 3 did not grow: ${stage} ${r.id} ${t.id} ${s.id}`);
      }
    }
  }
}

assert.equal(textWeights('I love AWS and cloud audits').g, 2);
console.log('All logic tests passed.');

import { sortByLabel, fallbackReason } from '../public/logic.js';
const sorted = sortByLabel(ROLES, ['none']);
assert.equal(sorted[0].id, 'none');
const labels = sorted.slice(1).map((r) => r.label);
assert.deepEqual(labels, [...labels].sort((a, b) => a.localeCompare(b)));
assert.ok(ROLES.some((r) => r.id === 'director') && ROLES.some((r) => r.id === 'ciso'));
assert.ok(TARGETS.some((r) => r.id === 'director'));
assert.ok(fallbackReason({ ...gerald[0], card: { name: 'Thalia' } }).includes('Thalia'));
console.log('Sorting and fallback tests passed.');
