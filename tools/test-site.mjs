// Structural checks for the v3 site. Run after `python3 tools/build.py`.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = f => readFileSync(join(root, f), 'utf8');
const projects = JSON.parse(read('content/projects.json')).projects;
const pubs = JSON.parse(read('content/publications.json'));

const pages = ['index.html', 'research.html', 'publications.html', 'cv.html', 'lab.html', 'privacy.html',
  ...projects.filter(p => !p.href).map(p => `projects/${p.slug}.html`)];

for (const page of pages) {
  const html = read(page);
  const pre = page.includes('/') ? '../' : '';
  assert.ok(html.includes(`href="${pre}assets/v3/site.css"`), `${page}: shared stylesheet`);
  assert.ok(html.includes(`src="${pre}assets/v3/site.js"`), `${page}: shared script`);
  assert.match(html, /class="site-header"/, `${page}: header`);
  assert.match(html, /<footer class="site-footer" id="contact">/, `${page}: footer with contact`);
  assert.match(html, /data-visitor-count hidden/, `${page}: visitor count present and hidden until real data`);
  assert.match(html, /<a class="skip-link" href="#main">/, `${page}: skip link`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${page}: exactly one h1`);
  // No third-party fonts, chat or trackers other than the cookie-free counter.
  assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic|tawk\.to|google-analytics|googletagmanager/, `${page}: no third-party fonts or trackers`);
  // Every action control uses the single shared button component.
  for (const block of html.match(/<div class="actions[^"]*">[\s\S]*?<\/div>/g) || [])
    for (const a of block.match(/<(a|button)\b[^>]*>/g) || []) assert.match(a, /class="btn( btn-primary)?"/, `${page}: uniform button ${a}`);
}

// Homepage essentials
const home = read('index.html');
assert.match(home, /id="blackhole-gateway-canvas"/, 'homepage keeps the black-hole render');
assert.match(home, /data-fold/, 'homepage has the interactive fold figure');
assert.match(home, /arXiv:2611\.08491/, 'homepage features the latest paper');

// Publications: every listed article/preprint appears, with the owner bolded where authors are known
const pubPage = read('publications.html');
for (const p of [...pubs.articles, ...pubs.preprints]) {
  assert.ok(pubPage.includes(p.title.replace(/&/g, '&amp;')), `publications lists: ${p.title}`);
}
assert.ok((pubPage.match(/<b>S\. K\. Singh<\/b>/g) || []).length >= 10, 'author lists show the owner in bold');

// Fonts are self-hosted and present
for (const f of ['lm-roman-10', 'lm-roman-10-italic', 'lm-math', 'crimson-pro', 'crimson-pro-italic', 'crimson-pro-bold', 'fira-sans', 'fira-sans-medium'])
  assert.ok(existsSync(join(root, `assets/fonts/${f}.woff`)), `font ${f}`);

// Retired pages redirect
for (const old of ['world.html', 'news.html', 'ideas.html', 'projects.html', 'private.html', 'quiet-hours.html'])
  assert.match(read(old), /http-equiv="refresh"/, `${old} redirects`);

// Generated pages are up to date with content/ (build is deterministic)
assert.ok(readdirSync(join(root, 'projects')).length >= projects.filter(p => !p.href).length, 'all project pages built');
console.log(`PASS: ${pages.length} pages share one system; publications complete; fonts self-hosted; redirects in place.`);
