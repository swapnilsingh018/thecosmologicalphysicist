// Checks for the v2 site foundation (homepage + pages built on assets/v2).
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = f => readFileSync(join(root, f), 'utf8');

const home = read('index.html');
const v2Pages = ['index.html', 'privacy.html'];

// Shared foundation
for (const page of v2Pages) {
  const html = read(page);
  assert.match(html, /assets\/v2\/base\.css/, `${page} uses the shared v2 stylesheet`);
  assert.match(html, /assets\/v2\/site\.js/, `${page} uses the shared v2 script`);
  assert.match(html, /class="site-header"/, `${page} has the shared header`);
  assert.match(html, /class="site-footer"/, `${page} has the shared footer`);
  assert.match(html, /<a class="skip-link" href="#main">/, `${page} has a skip link`);
  assert.match(html, /<main id="main"/, `${page} has a main landmark`);
  for (const nav of ['publications.html', 'lab.html', 'cv.html']) assert.ok(html.includes(`href="${nav}"`), `${page} links to ${nav}`);
}

// No trackers or chat anywhere in the v2 pages or the shared script
const siteJs = read('assets/v2/site.js');
for (const [name, text] of [['index.html', home], ['privacy.html', read('privacy.html')], ['site.js', siteJs]]) {
  assert.doesNotMatch(text, /embed\.tawk\.to|Tawk_API|availability-dock|Connecting…/, `${name} contains no chat or availability tracker`);
}
assert.doesNotMatch(read('assets/engagement.js'), /tawk\.to|createElement\(['"]script/, 'legacy engagement.js never loads the chat');

// Homepage content
assert.match(home, /id="blackhole-gateway-canvas"/, 'homepage keeps the black-hole render');
assert.match(home, /blackhole-gateway-v3\.js/, 'homepage loads the black-hole renderer');
assert.match(home, /arXiv:2611\.08491/, 'homepage features the latest paper');
assert.match(home, /<strong>S\. K\. Singh<\/strong>/, 'publications show full author lists with the author in bold');
assert.match(home, /mailto:swapnilsingh\.ph@gmail\.com/, 'homepage offers email contact');

// Uniform buttons: every action link is a .btn
const actionBlocks = home.match(/<div class="actions[^"]*"[^>]*>[\s\S]*?<\/div>/g) || [];
assert.ok(actionBlocks.length >= 4, 'homepage has action groups');
for (const block of actionBlocks) {
  for (const a of block.match(/<(a|button)\b[^>]*>/g) || []) assert.match(a, /class="btn( |")/, `action uses the shared button: ${a}`);
}

// Live unique-visitor count is present, hidden until real data arrives
assert.match(home, /data-visitor-count hidden/, 'visitor count starts hidden');
assert.match(siteJs, /counter\/TOTAL\.json/, 'visitor count reads the real GoatCounter total');
assert.doesNotMatch(siteJs, /Math\.random/, 'visitor count is never invented');

assert.ok(existsSync(join(root, 'assets/v2/home.css')), 'homepage stylesheet exists');
console.log('PASS: v2 foundation, homepage, uniform buttons, no trackers, live visitor count.');
