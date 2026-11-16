# Swapnil Kumar Singh — Computational Physics & Cosmology

A clean, buildless research portfolio for GitHub Pages at
[www.swapnilsingh.co.in](https://www.swapnilsingh.co.in/).

## Current redesign phase — bilingual public research (V15)

The visitor-facing flow has three primary rooms. Public Research now provides
the planned structure for ten future interactive study pages:

1. `index.html` — fixed-camera black-hole scene, name and role set in STIX Two
   Text, one Enter button, then exactly two choices. EN/IT is available.
2. `world.html` — the public research homepage: floating island navigation,
   author's portrait, a live Kähler atlas feature, ten selected linked studies
   in a discipline-filterable index, a concise work-practice section, and a
   collaboration contact. It has English and Italian interface copy.
3. `private.html` — a minimal login surface, retaining the Supabase-based
   invitation, password-recovery and per-project authorization implementation.
   Sign-in remains disabled until the owner completes the backend setup; its
   visible labels and statuses support EN/IT.

`assets/portal-v12.css` is the self-contained visual system for these three
pages. It carries the consistent mathematical-book typeface, dark olive and
warm-paper appearances, subtle gold detail, and responsive layouts.
`assets/public-v13.css` and `assets/public-v13.js` implement the public landing
and island/filter behavior; `assets/i18n-v13.js` maintains both languages with
saved language preference and shareable `?lang=it` state. `assets/sks-seal.svg`
is a first-party original laurel monogram, not a copy of an institutional logo.
`assets/finish-v14.css` adds engraved-gold interaction details and
`assets/fold-study-v14.js` draws the animated local saddle-node normal form,
not the full Kähler potential. `assets/glass-v15.css` applies the darker
smoked-olive palette and translucent, accessible controls to the three rooms.

The ten existing project destinations are **research records**, not ten fully
interactive models yet. Each will be designed and verified separately before
being described as a simulation. The Kähler atlas is already interactive.
For multilingual search indexing, create dedicated language-specific URLs and
`hreflang` references when the final Italian research content is approved;
the present visitor-facing switch does not by itself create separate indexed
Italian pages.

## Site structure

- index.html — full-screen interactive black-hole observatory entrance, an artistic Enter control, and two dynamically revealed destinations.
- world.html — editorial public homepage: a personal introduction, authentic portrait, featured Kähler research cover, a live reduced-potential instrument, three research directions, selected publications and a collaboration contact.
- private.html — invitation-only Inner Observatory portal, ready for connection to Supabase Auth and private, per-project file sharing. Until configured, login is explicitly disabled.
- lab.html — companion page embedding the first-party interactive physics atlas for [arXiv:2611.08491](https://arxiv.org/abs/2611.08491).
- research/kahler-stability-wall/ — complete self-hosted 3D scientific simulator, served under the portfolio domain with independent canonical, social metadata, and local assets.
- publications.html — separately labelled preprints, accepted/published articles, manuscripts, and talks.
- projects.html — filterable research index of seventeen studies across theory, observation, and engineering; the `?field=` query parameter deep-links to a discipline.
- projects/ — seventeen concise research records with real research questions, dates, affiliations and methodology. The former decorative city animations and filler copy have been removed.
- cosmology.html, computation.html, engineering.html — retained subject-specific legacy navigation routes.
- cv.html, news.html, quiet-hours.html — research profile, updates, and Quiet Hours.
- assets/gateway.css, assets/gateway.js — the observatory entrance, visual transition, and destination choice.
- assets/blackhole-gateway-v3.js — fixed-view, WebGL2 black-hole rendering with a wider field of view, a faint lensed galactic sky and continuously evolving accretion flow; no mouse-driven camera motion.
- assets/olive-theme.css — original dark-olive and antique-gold palette, retained for compatibility.
- assets/editorial-system.css, assets/paper-grain.svg — previous editorial foundation, warm ivory and deep olive modes.
- assets/folio-v11.css, assets/folio-v11.js — new site architecture and interactions: a restrained floating navigation, confident type, substantial research imagery, structural layouts, section entrance motion, and field-filtered project archive. These are loaded after the compatibility styles.
- assets/theme.js — accessible site-wide appearance switch, persisted in browser storage (`sks-appearance`); dark is the first-visit default. The black-hole scene and scientific plots remain dark for legibility.
- tools/apply-editorial-theme.mjs, tools/apply-folio-v11.mjs, tools/test-theme.mjs — repeatable HTML integration and dependency-free regression checks for both design layers. The prior `tools/apply-olive-theme.mjs` remains available.
- tools/rebuild-project-records-v11.mjs — one-time, content-preserving migration from unrelated animated-city project pages into editorial research records. It leaves already migrated pages unchanged.
- assets/private.css, assets/private.js, assets/portal-config.js — private workspace interface and public backend configuration.
- supabase/schema.sql, supabase/SETUP.md — server-side access policies and owner onboarding steps.
- assets/home.css, assets/home.js, assets/world.css, assets/world.js — public atlas layout, research disclosure, and reduced-potential preview.
- styles.css, assets/refinement.css, assets/css/, assets/site-runtime.js — shared styling and behavior for secondary pages.
- sitemap.xml, robots.txt — crawler discovery.

No Node packages or build step are required. The site uses local HTML/CSS/JavaScript assets and Google Fonts. The full 3D simulator is bundled inside the GitHub Pages repository, linked from the public Research Atlas and embedded in the Laboratory. It does not load from a separate website platform.

## Preview and deploy

1. Open index.html in a browser, or serve the directory through a small local static server for a closer deployment preview.
2. Make changes on a **separate branch**, review desktop and mobile layouts, and verify the paper links and email contact destination.
3. Merge approved changes into main, then push to the GitHub origin. The existing GitHub Pages workflow deploys the repository root.
4. Keep the existing CNAME file so GitHub Pages continues serving the custom domain. No DNS changes are necessary for this HTML redesign.
5. After deployment, submit https://www.swapnilsingh.co.in/sitemap.xml to Google Search Console. Search indexing and ranking are not automatic.

Before committing a design update, run `node tools/check-site.mjs` and `node tools/test-theme.mjs`. The first checks internal links, canonical metadata and sitemap coverage; the second verifies theme switching, storage fallbacks and presence on every HTML page. No production account or authentication credentials are needed to test the public design.

The private review deployment and the actual GitHub Pages publishing destination are independent.

## Updating the journal-version link

Once a journal DOI or publisher page exists, replace the forthcoming-link element in lab.html and the pub-link-pending element in publications.html with a genuine anchor pointing to the published record. Keep the arXiv link intact.

## Scientific and publication notes

The interactive plot in assets/home.js uses the reduced potential defined in the Kähler Stability Wall manuscript. It illustrates a parameter sweep, not cosmological time evolution. The black-hole rendering is cinematic scientific artwork, not validated ray tracing or an observational dataset. The self-hosted 3D atlas explains the paper's analytical and numerical structure.

The entrance uses a fixed camera and a 30 fps target, with softened disk filaments and edge-aware antialiasing. The artificial photon-ring outline and narrow diffraction spikes have been removed; gravitational lensing comes from the integrated light rays. The entrance name and profile link lead to cv.html for background, education and project inquiries.

The Inner Observatory uses external managed identity and row-level data authorization. It remains inactive until the owner provisions a Supabase project, runs supabase/schema.sql, disables public signups, and supplies the public publishable configuration in assets/portal-config.js. Follow supabase/SETUP.md before inviting anyone. Never place protected files, passwords, or secret/service-role keys inside this static repository.

The public contact section uses a mailto link. Never put private keys or API credentials in this static repository.

© 2026 Swapnil Kumar Singh.
