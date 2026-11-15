# Swapnil Kumar Singh — Computational Physics & Cosmology

A clean, buildless research portfolio for GitHub Pages at
[www.swapnilsingh.co.in](https://www.swapnilsingh.co.in/).

## Site structure

- index.html — research-led homepage, black-hole rendering, interactive Kähler potential preview, selected projects, publications, about, contact.
- lab.html — companion page embedding the complete interactive physics atlas for [arXiv:2611.08491](https://arxiv.org/abs/2611.08491).
- publications.html — separately labelled preprints, accepted/published articles, manuscripts, and talks.
- projects.html, cosmology.html, computation.html, engineering.html, and projects/ — research and engineering archive.
- cv.html, news.html, quiet-hours.html — research profile, updates, and Quiet Hours.
- assets/home.css, assets/home.js — homepage typography, layout, interactions and exact reduced-potential preview.
- styles.css, assets/refinement.css, assets/css/, assets/site-runtime.js — shared styling and behavior for secondary pages.
- sitemap.xml, robots.txt — crawler discovery.

No Node packages or build step are required. The site uses local HTML/CSS/JavaScript assets and Google Fonts. The full 3D simulator is hosted separately, linked from the homepage and embedded in the Laboratory.

## Preview and deploy

1. Open index.html in a browser, or serve the directory through a small local static server for a closer deployment preview.
2. Make changes on a **separate branch**, review desktop and mobile layouts, and verify the paper links and contact form.
3. Merge approved changes into main, then push to the GitHub origin. The existing GitHub Pages workflow deploys the repository root.
4. Keep the existing CNAME file so GitHub Pages continues serving the custom domain. No DNS changes are necessary for this HTML redesign.
5. After deployment, submit https://www.swapnilsingh.co.in/sitemap.xml to Google Search Console. Search indexing and ranking are not automatic.

The private review deployment and the actual GitHub Pages publishing destination are independent.

## Updating the journal-version link

Once a journal DOI or publisher page exists, replace the forthcoming-link element in lab.html and the pub-link-pending element in publications.html with a genuine anchor pointing to the published record. Keep the arXiv link intact.

## Scientific and publication notes

The interactive plot in assets/home.js uses the reduced potential defined in the Kähler Stability Wall manuscript. It illustrates a parameter sweep, not cosmological time evolution. The black-hole rendering is cinematic scientific artwork, not validated ray tracing or an observational dataset. The separate 3D atlas explains the paper's analytical and numerical structure.

The contact form uses the existing FormSubmit AJAX endpoint. Test it on the deployed domain; the email destination may require service-side activation or confirmation. Never put private keys or API credentials in this static repository.

© 2026 Swapnil Kumar Singh.
