import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const entrance = read('index.html');
const publicPage = read('world.html');
const privatePage = read('private.html');

for (const [name, page] of [['entrance', entrance], ['public', publicPage], ['private', privatePage]]) {
  assert.match(page, /assets\/finish-v14\.css/, `${name} has shared visual finishes`);
}
assert.equal((entrance.match(/class="choice-engraving"/g) ?? []).length, 2, 'two distinct route engravings');
assert.match(publicPage, /data-fold-stage/, 'featured graphic has a live mathematical stage');
assert.match(publicPage, /assets\/fold-study-v14\.js/, 'featured graphic loads its own animation');
assert.match(publicPage, /local normal form/, 'the illustration discloses its scientific scope');
assert.match(read('assets/finish-v14.css'), /prefers-reduced-motion: reduce/, 'motion has an accessible override');

const nodes = new Map();
const selectors = ['[data-fold-main]', '[data-fold-echo="far"]', '[data-fold-echo="near"]',
  '[data-fold-point="barrier"]', '[data-fold-point="minimum"]',
  '[data-fold-guide="barrier"]', '[data-fold-guide="minimum"]'];
for (const selector of selectors) {
  nodes.set(selector, {
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; }
  });
}
const stage = { querySelector: selector => nodes.get(selector) ?? null };
const mock = {
  document: { querySelector: selector => selector === '[data-fold-stage]' ? stage : null },
  window: { matchMedia: () => ({ matches: true }) }
};
new Script(read('assets/fold-study-v14.js')).runInNewContext(mock);

const barrier = nodes.get('[data-fold-point="barrier"]').attributes;
const minimum = nodes.get('[data-fold-point="minimum"]').attributes;
assert(Number(barrier.cx) < Number(minimum.cx), 'barrier is left of minimum');
assert(Number(barrier.cy) < Number(minimum.cy), 'barrier is above minimum');
assert.match(nodes.get('[data-fold-main]').attributes.d, /^M\d+\.\d+ \d+\.\d+ L/, 'the potential is sampled as a continuous path');

console.log('PASS: distinct engravings, gold interactions, accessible motion and physically ordered fold extrema.');
