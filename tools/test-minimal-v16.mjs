import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const entrance = read('index.html');
const world = read('world.html');
const ideas = read('ideas.html');
const seal = read('assets/sks-seal.svg');
const blackhole = read('assets/blackhole-gateway-v3.js');

assert.match(seal, /<circle\b/, 'clean circular mark');
assert.match(seal, />SKS<\/text>/, 'readable SKS letters');
assert.doesNotMatch(seal, /laurel|stroke-dasharray|©|>SINGH<|<path\b/i, 'no ornamental clutter');
assert.match(entrance, /gateway-location[^>]*data-i18n="location_florence"/, 'Florence follows entrance name');
assert.match(world, /data-i18n="location_florence"/, 'Florence appears in public identity');

for (const [name, page] of [['public', world], ['ideas', ideas]]) {
  const nav = page.match(/<nav class="nav-island"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.equal((nav.match(/<a\s/g) ?? []).length, 5, `${name} has five navigation destinations`);
  const labels = [...nav.matchAll(/data-i18n="(nav_[^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(labels, ['nav_home', 'nav_about', 'nav_work', 'nav_publications', 'nav_ideas']);
}
assert.match(ideas, /noindex, follow/, 'unfinished notes are not pushed into search');
assert.match(world, /data-availability-light/, 'a real-status indicator is present');
assert.match(world, /data-visitor-stat hidden/, 'public visitor number is hidden until verified');
assert.match(read('assets/engagement-config.js'), /visitorStatsEndpoint: ""/, 'no fabricated analytics endpoint');
assert.match(read('assets/engagement.js'), /onStatusChange/, 'online status is provider-driven');
assert.match(read('assets/engagement.js'), /Number\.isSafeInteger/, 'visitor totals must be genuine integers');
assert.match(blackhole, /adaptiveScale/, 'renderer adapts to display load');
assert.match(blackhole, /visualSeconds \+= Math\.min/, 'animation time is frame-paced');
assert.doesNotMatch(blackhole, /mousemove|pointermove|deviceorientation/i, 'black-hole camera does not follow pointer');

console.log('PASS: minimal seal, five-link navigation, Florence, truthful presence, hidden counter and adaptive black hole.');
