import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// One-time structural migration of the original research-record content.
// It preserves the source facts and removes the unrelated city animations.
const root = fileURLToPath(new URL('../', import.meta.url));
const index = await readFile(join(root, 'projects.html'), 'utf8');
const categories = Object.fromEntries(
  [...index.matchAll(/data-field="(theory|observation|engineering)" href="projects\/([^"]+)"/g)]
    .map(([, field, name]) => [name, field])
);

const fieldName = { theory: 'Cosmology & Theory', observation: 'Astrophysics & Observation', engineering: 'Engineering & Space Systems' };
const doi = {
  'inflation-act-desi.html': 'https://doi.org/10.1016/j.jheap.2026.100656',
  'pbh-sigw-bounce.html': 'https://doi.org/10.1140/epjc/s10052-025-14176-z'
};

const excerpt = (html, pattern, label, name) => {
  const match = html.match(pattern);
  if (!match) throw new Error(`Missing ${label} in ${name}`);
  return match[1].trim();
};

const filenames = (await readdir(join(root, 'projects'))).filter(name => name.endsWith('.html')).sort();
let converted = 0;
for (const name of filenames) {
  const source = await readFile(join(root, 'projects', name), 'utf8');
  if (source.includes('class="folio-page folio-record-page"')) continue;
  const field = categories[name];
  if (!field) throw new Error(`Unmapped research record: ${name}`);
  const title = excerpt(source, /<div class="project-cover-copy reveal">[\s\S]*?<h1>([\s\S]*?)<\/h1>/, 'title', name);
  const institution = excerpt(source, /<p class="project-institution">([\s\S]*?)<\/p>/, 'institution', name);
  const date = excerpt(source, /<div class="project-meta"><span>([\s\S]*?)<\/span>/, 'date', name);
  const location = excerpt(source, /<div class="project-meta"><span>[\s\S]*?<\/span><span>([\s\S]*?)<\/span>/, 'location', name);
  const question = excerpt(source, /<section class="project-question reveal">[\s\S]*?<h2>([\s\S]*?)<\/h2>/, 'question', name);
  const focus = excerpt(source, /<section class="project-horizon reveal">[\s\S]*?<p>([\s\S]*?)<\/p><\/section>/, 'focus', name);
  const previous = source.match(/<a href="([^"]+)"><span>Previous<\/span><strong>([\s\S]*?)<\/strong><\/a>/);
  const next = source.match(/<a href="([^"]+)"><span>Next<\/span><strong>([\s\S]*?)<\/strong><\/a>/);
  const paper = doi[name] ? `<a class="folio-pill folio-pill-solid" href="${doi[name]}" target="_blank" rel="noopener noreferrer">Read the published paper <span aria-hidden="true">↗</span></a>` : '';
  const more = field === 'theory' ? 'theory' : field === 'observation' ? 'observation' : 'engineering';
  const pagination = [previous && `<a href="${previous[1]}"><span>Previous research</span><strong>${previous[2]}</strong></a>`, next && `<a href="${next[1]}"><span>Next research</span><strong>${next[2]}</strong></a>`].filter(Boolean).join('\n');

  const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#111914">
  <meta name="author" content="Swapnil Kumar Singh">
  <meta name="description" content="${title} — research record by Swapnil Kumar Singh. ${focus}">
  <link rel="canonical" href="https://www.swapnilsingh.co.in/projects/${name}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title} — Swapnil Kumar Singh">
  <meta property="og:description" content="${focus}">
  <meta property="og:url" content="https://www.swapnilsingh.co.in/projects/${name}">
  <meta property="og:image" content="https://www.swapnilsingh.co.in/assets/profile.jpeg">
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <title>${title} — Swapnil Kumar Singh</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="../assets/theme.js"></script>
  <link rel="stylesheet" href="../assets/home.css">
  <link rel="stylesheet" href="../assets/olive-theme.css">
  <link rel="stylesheet" href="../assets/editorial-system.css">
  <link rel="stylesheet" href="../assets/folio-v11.css">
  <script defer src="../assets/home.js"></script>
  <script defer src="../assets/folio-v11.js"></script>
</head>
<body class="folio-page folio-record-page" data-field="${field}">
  <a class="skip-link" href="#main">Skip to research</a>
  <header class="masthead folio-masthead" data-header>
    <a href="../world.html" class="identity" aria-label="Return to research homepage"><span class="identity-copy"><strong>Swapnil Kumar Singh</strong></span></a>
    <button class="menu" type="button" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation"><span></span><span></span></button>
    <nav id="nav" aria-label="Primary navigation"><a href="../world.html">Home</a><a href="../projects.html" aria-current="page">Work</a><a href="../publications.html">Papers</a><a href="../lab.html">Laboratory</a><a href="../cv.html">About</a></nav>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch color mode" aria-pressed="false"><span class="theme-symbol" aria-hidden="true">☼</span><span class="theme-word">Light</span></button>
  </header>
  <main id="main">
    <section class="folio-record-hero">
      <div class="folio-wrap">
        <a href="../projects.html?field=${more}" class="folio-record-back">← All ${fieldName[field]} projects</a>
        <p class="folio-kicker">Research record <span class="folio-divider">/</span> ${fieldName[field]}</p>
        <h1>${title}</h1>
        <p class="folio-record-deck">${question}</p>
        <div class="folio-record-actions"><a class="folio-text-action" href="#approach">Read the research focus <span aria-hidden="true">↘</span></a>${paper}</div>
      </div>
    </section>
    <section class="folio-record-body" id="approach">
      <div class="folio-wrap folio-record-grid">
        <div class="folio-record-story" data-reveal><span class="folio-kicker">The work</span><h2>Research <em>focus.</em></h2><p>${focus}</p></div>
        <aside class="folio-record-ledger" aria-label="Research information" data-reveal>
          <div><span>Research period</span><strong>${date}</strong></div>
          <div><span>Institution</span><strong>${institution}</strong></div>
          <div><span>Location</span><strong>${location}</strong></div>
          <div><span>Field</span><strong>${fieldName[field]}</strong></div>
        </aside>
      </div>
    </section>
    <section class="folio-record-next folio-wrap">
      <div class="folio-record-next-head"><span class="folio-kicker">Continue exploring</span><a href="../projects.html?field=${more}">View this field ↗</a></div>
      <nav aria-label="Adjacent research" class="folio-record-pagination">${pagination}</nav>
    </section>
    <section class="folio-record-contact"><div class="folio-wrap"><p>Interested in the methodology or related work?</p><a href="mailto:swapnilsingh.ph@gmail.com?subject=Research%20Collaboration">Get in touch ↗</a></div></section>
  </main>
  <footer class="folio-footer"><div class="folio-wrap"><span>© <span id="year">2026</span> Swapnil Kumar Singh</span><nav aria-label="Footer links"><a href="../world.html">Home</a><a href="../projects.html">Project index</a><a href="../publications.html">Publications</a><a href="../cv.html">Profile</a></nav><a href="#main" class="folio-back-top">Back to top ↑</a></div></footer>
</body>
</html>
`;
  await writeFile(join(root, 'projects', name), page);
  converted++;
}
console.log(`Rebuilt ${converted} detailed research records; ${filenames.length} total pages.`);
