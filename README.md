# Swapnil Kumar Singh — Computational Physics & Cosmology

A clean, buildless research portfolio for GitHub Pages at
[www.swapnilsingh.co.in](https://www.swapnilsingh.co.in/).

## Site structure

- index.html — full-screen interactive black-hole observatory entrance, an artistic Enter control, and two dynamically revealed destinations.
- world.html — the public Research Atlas: a concise introduction and seventeen projects organized across three fields, plus a research feature and publications.
- private.html — invitation-only Inner Observatory portal, ready for connection to Supabase Auth and private, per-project file sharing. Until configured, login is explicitly disabled.
- lab.html — companion page embedding the complete interactive physics atlas for [arXiv:2611.08491](https://arxiv.org/abs/2611.08491).
- publications.html — separately labelled preprints, accepted/published articles, manuscripts, and talks.
- projects.html, cosmology.html, computation.html, engineering.html, and projects/ — research and engineering archive.
- cv.html, news.html, quiet-hours.html — research profile, updates, and Quiet Hours.
- assets/gateway.css, assets/gateway.js — the observatory entrance, visual transition, and destination choice.
- assets/blackhole-gateway-v3.js — fixed-view, WebGL2 black-hole rendering with a wider field of view, a faint lensed galactic sky and continuously evolving accretion flow; no mouse-driven camera motion.
- assets/olive-theme.css — shared dark-olive and antique-gold styling loaded last on all thirty pages. tools/apply-olive-theme.mjs is an idempotent migration helper.
- assets/private.css, assets/private.js, assets/portal-config.js — private workspace interface and public backend configuration.
- supabase/schema.sql, supabase/SETUP.md — server-side access policies and owner onboarding steps.
- assets/home.css, assets/home.js, assets/world.css, assets/world.js — public atlas layout, research disclosure, and reduced-potential preview.
- styles.css, assets/refinement.css, assets/css/, assets/site-runtime.js — shared styling and behavior for secondary pages.
- sitemap.xml, robots.txt — crawler discovery.

No Node packages or build step are required. The site uses local HTML/CSS/JavaScript assets and Google Fonts. The full 3D simulator is hosted separately, linked from the public Research Atlas and embedded in the Laboratory.

## Preview and deploy

1. Open index.html in a browser, or serve the directory through a small local static server for a closer deployment preview.
2. Make changes on a **separate branch**, review desktop and mobile layouts, and verify the paper links and email contact destination.
3. Merge approved changes into main, then push to the GitHub origin. The existing GitHub Pages workflow deploys the repository root.
4. Keep the existing CNAME file so GitHub Pages continues serving the custom domain. No DNS changes are necessary for this HTML redesign.
5. After deployment, submit https://www.swapnilsingh.co.in/sitemap.xml to Google Search Console. Search indexing and ranking are not automatic.

The private review deployment and the actual GitHub Pages publishing destination are independent.

## Updating the journal-version link

Once a journal DOI or publisher page exists, replace the forthcoming-link element in lab.html and the pub-link-pending element in publications.html with a genuine anchor pointing to the published record. Keep the arXiv link intact.

## Scientific and publication notes

The interactive plot in assets/home.js uses the reduced potential defined in the Kähler Stability Wall manuscript. It illustrates a parameter sweep, not cosmological time evolution. The black-hole rendering is cinematic scientific artwork, not validated ray tracing or an observational dataset. The separate 3D atlas explains the paper's analytical and numerical structure.

The entrance uses a fixed camera and a 30 fps target, with softer disk filaments and edge-aware antialiasing. The entrance name and profile link now lead to cv.html for background, education and project inquiries.

The Inner Observatory uses external managed identity and row-level data authorization. It remains inactive until the owner provisions a Supabase project, runs supabase/schema.sql, disables public signups, and supplies the public publishable configuration in assets/portal-config.js. Follow supabase/SETUP.md before inviting anyone. Never place protected files, passwords, or secret/service-role keys inside this static repository.

The public contact section uses a mailto link. Never put private keys or API credentials in this static repository.

© 2026 Swapnil Kumar Singh.
