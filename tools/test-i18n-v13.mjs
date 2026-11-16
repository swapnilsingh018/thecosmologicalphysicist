import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const translationSource = read('assets/i18n-v13.js');
const body = translationSource.split('const italian = {')[1]?.split('\n  };')[0];
assert.ok(body, 'Italian dictionary should be present');
const keys = new Set([...body.matchAll(/^\s*([a-z][a-z0-9_]+):/gm)].map(([, key]) => key));

let elements = 0;
for (const filename of ['index.html', 'world.html', 'private.html']) {
  const html = read(filename);
  assert.match(html, /data-set-lang="en"/);
  assert.match(html, /data-set-lang="it"/);
  assert.match(html, /assets\/i18n-v13\.js/);
  for (const match of html.matchAll(/data-i18n(?:-aria|-placeholder)?="([a-z0-9_]+)"/g)) {
    elements++;
    assert.ok(keys.has(match[1]), `${filename} has no Italian copy for ${match[1]}`);
  }
}

const home = read('world.html');
const records = [...home.matchAll(/class="research-row" data-field="(theory|astro|engineering)"/g)].map(m => m[1]);
assert.equal(records.length, 10, 'there must be exactly ten selected studies');
assert.equal(records.filter(value => value === 'theory').length, 4);
assert.equal(records.filter(value => value === 'astro').length, 3);
assert.equal(records.filter(value => value === 'engineering').length, 3);

for (const source of ['assets/i18n-v13.js', 'assets/public-v13.js', 'assets/private.js']) {
  assert.doesNotMatch(read(source), /chatgpt|openai|luckyarbor/i, `${source} contains unwanted platform branding`);
}
console.log(`PASS: ${elements} bilingual interface labels, three rooms, and ten curated study links.`);
