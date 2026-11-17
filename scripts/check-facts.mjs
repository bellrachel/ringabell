// Fact guard. Fails the build when copy cites a number that is not backed by
// a fact, so numbers can never drift between the two modes.
//
// - Card copy may only use numbers found in the facts its chips point to.
// - All other copy may only use numbers found in a fact (achievements, or the
//   career-level facts in site.yaml), plus the few utility numbers below.
// Numbers written as words ("six months") are not checked; review those by eye.

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parse } from 'yaml';

const CONTENT = new URL('../src/content/', import.meta.url).pathname;
/** Numbers that are not achievements: call length, pop-up scroll point, 404. */
const ALLOWED_ELSEWHERE = new Set(['30', '75', '404']);

const load = (dir) =>
  Object.fromEntries(
    readdirSync(join(CONTENT, dir))
      .filter((file) => file.endsWith('.yaml'))
      .map((file) => [basename(file, '.yaml'), parse(readFileSync(join(CONTENT, dir, file), 'utf8'))]),
  );
/** Numbers in a string, skipping digits inside words such as "B2B". */
const numbers = (text) => String(text).match(/(?<![A-Za-z])(?:\d[\d,.]*\d|\d)/g) ?? [];
/** Every string inside a value, with the path that leads to it. */
function* strings(value, path = '') {
  if (typeof value === 'string') yield [path, value];
  else if (value && typeof value === 'object')
    for (const [key, child] of Object.entries(value)) yield* strings(child, path ? `${path}.${key}` : key);
}

const errors = [];
const achievements = load('achievements');
const cards = load('cards');

for (const [id, card] of Object.entries(cards)) {
  const backed = new Set();
  for (const ref of card.chips ?? []) {
    const [achievementId, factId] = ref.split('/');
    const fact = achievements[achievementId]?.facts?.find((f) => f.id === factId);
    if (!fact) {
      errors.push(`cards/${id}: chip "${ref}" does not match any fact`);
      continue;
    }
    numbers(fact.value).forEach((n) => backed.add(n));
  }
  for (const [path, text] of strings({ title: card.title, text: card.text }))
    for (const n of numbers(text))
      if (!backed.has(n)) errors.push(`cards/${id} ${path}: "${n}" is not in the facts this card's chips reference`);
}

const { facts: siteFacts = [], linkedin, calendlyUrl, ...siteCopy } = parse(
  readFileSync(join(CONTENT, 'site.yaml'), 'utf8'),
);
const backedAnywhere = new Set(ALLOWED_ELSEWHERE);
for (const fact of [...Object.values(achievements).flatMap((a) => a.facts ?? []), ...siteFacts])
  numbers(fact.value).forEach((n) => backedAnywhere.add(n));

const elsewhere = {
  ...Object.fromEntries(Object.entries(load('offers')).map(([id, v]) => [`offers/${id}`, v])),
  ...Object.fromEntries(Object.entries(load('sections')).map(([id, v]) => [`sections/${id}`, v])),
  ...Object.fromEntries(Object.entries(load('lab')).map(([id, v]) => [`lab/${id}`, v])),
  microcopy: parse(readFileSync(join(CONTENT, 'microcopy.yaml'), 'utf8')),
  site: siteCopy,
};
for (const [file, data] of Object.entries(elsewhere))
  for (const [path, text] of strings(data))
    for (const n of numbers(text))
      if (!backedAnywhere.has(n))
        errors.push(`${file} ${path}: "${n}" is not in any fact. Add it to achievements/*.yaml or site.yaml facts first.`);

if (errors.length) {
  console.error(`Fact check failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`Fact check passed: ${Object.keys(cards).length} cards, ${Object.keys(achievements).length} achievements.`);
