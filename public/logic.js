// Career Cards: maps career answers to three Magic color identities.
// Pure functions only, so this file can be tested in Node and used in the browser.

export const ORDER = 'wubrg';

export const COLORS = {
  w: { name: 'White', word: 'structure' },
  u: { name: 'Blue', word: 'knowledge' },
  b: { name: 'Black', word: 'ambition' },
  r: { name: 'Red', word: 'speed' },
  g: { name: 'Green', word: 'growth' },
};

// Current or past roles. The first letter of `colors` is the role's primary color.
export const ROLES = [
  { id: 'none', label: 'Not in cyber yet', colors: '', group: 'Getting started' },
  { id: 'helpdesk', label: 'IT help desk or support', colors: 'g', group: 'IT and infrastructure' },
  { id: 'sysadmin', label: 'Sysadmin or network engineer', colors: 'g', group: 'IT and infrastructure' },
  { id: 'dba', label: 'Database administrator (DBA)', colors: 'gu', group: 'IT and infrastructure' },
  { id: 'ics', label: 'ICS/OT security', colors: 'gw', group: 'Engineering and architecture' },
  { id: 'cloud', label: 'Cloud or DevOps engineer', colors: 'g', group: 'IT and infrastructure' },
  { id: 'developer', label: 'Software developer', colors: 'u', group: 'IT and infrastructure' },
  { id: 'soc', label: 'SOC analyst', colors: 'r', group: 'Defense and operations' },
  { id: 'ir', label: 'Incident responder or DFIR', colors: 'r', group: 'Defense and operations' },
  { id: 'grc', label: 'GRC analyst or auditor', colors: 'w', group: 'GRC, privacy and people' },
  { id: 'privacy', label: 'Privacy or compliance', colors: 'w', group: 'GRC, privacy and people' },
  { id: 'awareness', label: 'Security awareness or training', colors: 'wg', group: 'GRC, privacy and people' },
  { id: 'cti', label: 'Threat intel analyst', colors: 'u', group: 'Defense and operations' },
  { id: 'engineer', label: 'Security engineer', colors: 'u', group: 'Engineering and architecture' },
  { id: 'appsec', label: 'Application security', colors: 'ub', group: 'Engineering and architecture' },
  { id: 'pentest', label: 'Pentester or red teamer', colors: 'b', group: 'Offensive security' },
  { id: 'vuln', label: 'Vulnerability management', colors: 'bg', group: 'Defense and operations' },
  { id: 'detection', label: 'Detection engineer', colors: 'ru', group: 'Defense and operations' },
  { id: 'hunter', label: 'Threat hunter', colors: 'ub', group: 'Defense and operations' },
  { id: 'manager', label: 'Security manager or team lead', colors: 'rw', group: 'Leadership and advisory' },
  { id: 'architect', label: 'Security architect', colors: 'wu', group: 'Engineering and architecture' },
  { id: 'consultant', label: 'Consultant or advisor', colors: 'wu', group: 'Leadership and advisory' },
  { id: 'director', label: 'Director of security', colors: 'wur', group: 'Leadership and advisory' },
  { id: 'ciso', label: 'CISO or security executive', colors: 'wubrg', group: 'Leadership and advisory' },
];

// Dream roles.
export const TARGETS = [
  { id: 'grc', label: 'GRC analyst', colors: 'w', group: 'GRC, privacy and people' },
  { id: 'soc', label: 'SOC analyst', colors: 'r', group: 'Defense and operations' },
  { id: 'pentest', label: 'Pentester', colors: 'b', group: 'Offensive security' },
  { id: 'engineer', label: 'Security engineer', colors: 'u', group: 'Engineering and architecture' },
  { id: 'cloudsec', label: 'Cloud security engineer', colors: 'g', group: 'Engineering and architecture' },
  { id: 'manager', label: 'Security manager or team lead', colors: 'rw', group: 'Leadership and advisory' },
  { id: 'architect', label: 'Security architect', colors: 'wu', group: 'Engineering and architecture' },
  { id: 'grclead', label: 'GRC or risk leader', colors: 'wb', group: 'GRC, privacy and people' },
  { id: 'hunter', label: 'Threat hunter', colors: 'ub', group: 'Defense and operations' },
  { id: 'detection', label: 'Detection engineer', colors: 'ur', group: 'Defense and operations' },
  { id: 'redlead', label: 'Red team lead', colors: 'br', group: 'Offensive security' },
  { id: 'cloudarch', label: 'Cloud security architect', colors: 'gu', group: 'Engineering and architecture' },
  { id: 'dfir', label: 'DFIR lead', colors: 'rg', group: 'Defense and operations' },
  { id: 'culture', label: 'Security awareness or culture leader', colors: 'gw', group: 'GRC, privacy and people' },
  { id: 'vuln', label: 'Vulnerability or exposure management lead', colors: 'bg', group: 'Defense and operations' },
  { id: 'principal', label: 'Principal security engineer', colors: 'ugr', group: 'Engineering and architecture' },
  { id: 'icslead', label: 'ICS/OT security lead', colors: 'gwu', group: 'Engineering and architecture' },
  { id: 'director', label: 'Director of security', colors: 'wur', group: 'Leadership and advisory' },
  { id: 'ciso', label: 'CISO or security executive', colors: 'wubrg', group: 'Leadership and advisory' },
  { id: 'founder', label: 'Founder, consultant or educator', colors: 'wubrg', group: 'Leadership and advisory' },
];

export const STYLES = [
  { id: 'w', label: 'Writes the plan and makes sure it gets followed' },
  { id: 'u', label: 'Researches until I truly understand it' },
  { id: 'b', label: 'Figures out how to break it' },
  { id: 'r', label: 'Jumps in and fixes it right now' },
  { id: 'g', label: 'Builds something so it never happens again' },
];

const KEYWORDS = {
  w: ['policy', 'policies', 'audit', 'compliance', 'risk', 'grc', 'framework', 'nist', 'iso', 'governance', 'privacy', 'documentation', 'process', 'standard', 'soc 2', 'hipaa', 'pci', 'vendor'],
  u: ['research', 'intel', 'architecture', 'design', 'python', 'code', 'coding', 'script', 'automation', 'automate', 'engineer', 'learn', 'analysis', 'data', 'ai', 'detection'],
  b: ['pentest', 'pen test', 'hack', 'hacking', 'red team', 'exploit', 'offensive', 'ctf', 'bug bounty', 'osint', 'malware', 'reverse', 'social engineering'],
  r: ['incident', 'soc', 'response', 'triage', 'alert', 'forensic', 'dfir', 'on-call', 'on call', 'crisis', 'fire', 'siem', 'blue team'],
  g: ['cloud', 'aws', 'azure', 'gcp', 'network', 'infrastructure', 'sysadmin', 'linux', 'windows', 'build', 'devops', 'kubernetes', 'homelab', 'home lab', 'help desk', 'ics', 'ot', 'scada', 'plc', 'industrial'],
};

const GUILDS = {
  w: 'Mono-White', u: 'Mono-Blue', b: 'Mono-Black', r: 'Mono-Red', g: 'Mono-Green',
  wu: 'Azorius', ub: 'Dimir', br: 'Rakdos', rg: 'Gruul', wg: 'Selesnya',
  wb: 'Orzhov', ur: 'Izzet', bg: 'Golgari', wr: 'Boros', ug: 'Simic',
  wub: 'Esper', ubr: 'Grixis', brg: 'Jund', wrg: 'Naya', wug: 'Bant',
  wbg: 'Abzan', wur: 'Jeskai', ubg: 'Sultai', wbr: 'Mardu', urg: 'Temur',
  wubr: 'Four-color (no Green)', ubrg: 'Four-color (no White)', wbrg: 'Four-color (no Blue)',
  wurg: 'Four-color (no Black)', wubg: 'Four-color (no Red)',
  wubrg: 'Five-color',
};

export function normalize(colors) {
  const set = new Set(String(colors || '').toLowerCase().split(''));
  return ORDER.split('').filter((c) => set.has(c)).join('');
}

export function union(a, b) { return normalize(String(a || '') + String(b || '')); }

export function guildName(id) { return GUILDS[normalize(id)] || 'Colorless'; }

export function colorWords(id) {
  return normalize(id).split('').map((c) => COLORS[c].word).join(' + ');
}

export function colorNames(id) {
  return normalize(id).split('').map((c) => COLORS[c].name).join(' + ');
}

export function textWeights(text) {
  const t = ` ${String(text || '').toLowerCase()} `;
  const w = { w: 0, u: 0, b: 0, r: 0, g: 0 };
  for (const c of ORDER) {
    for (const k of KEYWORDS[c]) {
      if (k.length <= 3) {
        if (new RegExp(`[^a-z]${k}[^a-z]`).test(t)) w[c] += 1;
      } else if (t.includes(k)) {
        w[c] += 1;
      }
    }
  }
  return w;
}

function weightsFor(answers) {
  const w = textWeights(answers.notes);
  if (answers.style && w[answers.style] !== undefined) w[answers.style] += 2;
  return w;
}

// Pick the best color from `candidates` that is not already in `base`.
function pickAdd(base, candidates, weights) {
  const have = new Set(normalize(base).split(''));
  const pool = normalize(candidates).split('').filter((c) => !have.has(c));
  if (!pool.length) return '';
  pool.sort((a, b) => (weights[b] - weights[a]) || (ORDER.indexOf(a) - ORDER.indexOf(b)));
  return pool[0];
}

// Make sure `next` grows beyond `prev` by at least one color, if room remains.
function grow(prev, next, preferred, weights) {
  let out = normalize(next);
  if (out === normalize(prev) || out.length < normalize(prev).length) {
    const add = pickAdd(union(prev, out), preferred, weights) || pickAdd(union(prev, out), ORDER, weights);
    out = union(union(prev, out), add);
  }
  return out;
}

const find = (list, id) => list.find((x) => x.id === id);

const listColors = (id) => {
  const names = normalize(id).split('').map((c) => `${COLORS[c].name} (${COLORS[c].word})`);
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
};
const added = (from, to) => normalize(to).split('').filter((c) => !normalize(from).includes(c)).join('');

export const GROUP_ORDER = [
  'Getting started',
  'IT and infrastructure',
  'Defense and operations',
  'Offensive security',
  'Engineering and architecture',
  'GRC, privacy and people',
  'Leadership and advisory',
];

// Groups in GROUP_ORDER, items alphabetical inside each group.
export function groupByCategory(list) {
  return GROUP_ORDER
    .map((group) => ({ group, items: sortByLabel(list.filter((x) => x.group === group)) }))
    .filter((g) => g.items.length);
}

// Alphabetical by label, with any pinned ids (like "Not in cyber yet") kept first.
export function sortByLabel(list, pinned = []) {
  const first = pinned.map((id) => list.find((x) => x.id === id)).filter(Boolean);
  const rest = list.filter((x) => !pinned.includes(x.id)).sort((a, b) => a.label.localeCompare(b.label));
  return [...first, ...rest];
}

// Plain-language reason a card fits a phase, used when AI is unavailable.
export function fallbackReason(phase) {
  if (!phase.card) return '';
  const words = colorWords(phase.colors);
  const mix = phase.colors.length === 1 ? `pure ${words}` : `the same blend of ${words}`;
  return `${phase.card.name} is a ${phase.guild} legend: ${mix}, just what this stage of your career calls for.`;
}

export function plan(answers) {
  const weights = weightsFor(answers);
  const target = find(TARGETS, answers.target) || TARGETS[0];
  const styleColor = answers.style || 'w';
  const phases = [];

  if (answers.stage === 'mid' || answers.stage === 'senior') {
    const senior = answers.stage === 'senior';
    const start = find(ROLES, answers.start) || ROLES[0];
    const current = find(ROLES, answers.current) || ROLES[0];
    const p1 = normalize(start.colors || styleColor);
    const primary = (start.colors || styleColor)[0];
    const p2 = grow(p1, union(current.colors || styleColor, primary), target.colors, weights);
    const p3 = grow(p2, union(target.colors, primary), target.colors, weights);
    const styleLabel = (find(STYLES, styleColor) || STYLES[0]).label.toLowerCase();
    phases.push({
      label: 'Where I started',
      role: start.id === 'none' ? 'Before cyber' : start.label,
      colors: p1,
      why: start.colors
        ? `${start.label} is a ${listColors(p1)} role.`
        : `You’re the one who ${styleLabel}, which is ${listColors(p1)}.`,
    });
    const new2 = added(p1, p2);
    phases.push({
      label: senior ? 'What I’m known for' : 'Where I am',
      role: current.label,
      colors: p2,
      why: new2
        ? `${current.label} adds ${listColors(new2)}. Your first color, ${COLORS[primary].name}, stays with you as your commander.`
        : `${current.label} keeps every color in play, with ${COLORS[primary].name} as your commander.`,
    });
    const new3 = added(p2, p3);
    phases.push({
      label: senior ? 'The legacy I’m building' : 'Where I’m headed',
      role: target.label,
      colors: p3,
      why: new3
        ? `Getting to ${target.label} means adding ${listColors(new3)}, with ${COLORS[primary].name} still leading.`
        : `${target.label} builds on the colors you already have, with ${COLORS[primary].name} still leading.`,
    });
  } else {
    const current = find(ROLES, answers.current) || ROLES[0];
    const p1 = normalize((current.colors || styleColor)[0]);
    const primary = p1;
    const add = pickAdd(p1, target.colors, weights) || pickAdd(p1, ORDER, weights);
    const p2 = union(p1, add);
    const p3 = grow(p2, union(target.colors, primary), target.colors, weights);
    const styleLabel = (find(STYLES, styleColor) || STYLES[0]).label.toLowerCase();
    phases.push({
      label: 'Where I am now',
      role: current.id === 'none' ? 'Exploring cyber' : current.label,
      colors: p1,
      why: current.colors
        ? `${current.label} starts you in ${listColors(p1)}.`
        : `You’re the one who ${styleLabel}, which starts you in ${listColors(p1)}.`,
    });
    phases.push({
      label: 'My next step',
      role: `Adding ${COLORS[add].name.toLowerCase()}: ${COLORS[add].word}`,
      colors: p2,
      why: normalize(target.colors).includes(add)
        ? `${COLORS[add].name} (${COLORS[add].word}) is the first new color on the way to ${target.label}.`
        : `${COLORS[add].name} (${COLORS[add].word}) fits how you work and rounds out your starting color.`,
    });
    const new3 = added(p2, p3);
    phases.push({
      label: 'Where I’m headed',
      role: target.label,
      colors: p3,
      why: new3
        ? `Getting to ${target.label} means adding ${listColors(new3)}, with ${COLORS[primary].name} still leading.`
        : `${target.label} builds on the colors you already have, with ${COLORS[primary].name} still leading.`,
    });
  }

  return phases.map((p) => ({
    ...p,
    guild: guildName(p.colors),
    caption: `${guildName(p.colors)}: ${colorWords(p.colors)}`,
  }));
}

// Two-sentence story of the whole arc, used when AI is unavailable.
export function fallbackSynopsis(phases, name) {
  const [a, b, c] = phases;
  if (!a || !b || !c) return '';
  const who = name || 'You';
  const lead = c.card ? `, with ${c.card.name} leading the way` : '';
  return `${who} began as ${a.role} in ${a.guild}, then leveled up into ${b.guild} (${colorWords(b.colors)}). Next stop: ${c.role}${lead}.`;
}

// Easter eggs: a name that unlocks a hand-picked set of cards. Keys are lowercase names.
export const EASTER_EGGS = {
  'justin gold': {
    colors: 'g',
    cards: ['Fastbond', 'Farseek', 'Scute Swarm'],
    why: 'Justin is green. Justin has always been green.',
    reasons: [
      'Fastbond lets you play as many lands as you want, because Justin has never met a foundation he didn’t want to build twice.',
      'Farseek goes and finds exactly the land you need: always ramping, always looking for the next piece of the plan.',
      'Every land makes more Scute Swarm, and with enough lands it copies itself. Justin doesn’t grow, he multiplies.',
    ],
    synopsis: 'Justin Gold was mono-green before it was cool, ramping with Fastbond and Farseek to build bigger foundations than anyone at the table. The endgame is Scute Swarm, because Justin doesn’t just grow, he multiplies.',
  },
};

export function easterEgg(name) {
  const key = String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  return EASTER_EGGS[key] || null;
}
