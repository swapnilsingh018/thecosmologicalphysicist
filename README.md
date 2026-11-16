# Swapnil Kumar Singh — Personal Research Website

Static GitHub Pages portfolio for `www.swapnilsingh.co.in`.

## Structure

- `index.html`: animated black-hole entrance and public/private choices
- `world.html`: research homepage and selected work
- `cv.html`: academic profile, education, appointments and skills
- `publications.html`: publication record
- `ideas.html`: current research directions
- `projects/`: individual research records
- `research/kahler-stability-wall/`: locally hosted interactive paper companion
- `assets/`: shared graphics, typography, scripts and images
- `private.html`: invite-only portal, requires a configured backend before it can authenticate
- `tools/`: source validation scripts (not deployed)
- `supabase/`: optional backend setup documents (not deployed)

## Deployment

The GitHub Actions workflow deploys only public pages and assets to GitHub Pages. The domain is configured in `CNAME`; leave it unchanged.

## Tests

```sh
node tools/check-site.mjs
node tools/test-theme.mjs
node tools/test-tawk-v19.mjs
```

## Editing

Keep new pages in the same dark olive, muted gold and STIX Two Text visual language. Check English/Italian navigation, mobile behavior and accessibility. Never place credentials or private research files inside this repository. The active Tawk widget uses public integration identifiers only.

The two supplied portrait images are intentionally distinct: `assets/portrait-public-v27.jpg` is used on the public research homepage and social previews, while `assets/portrait-about.webp` is used on the About page.


## About-page figures and Italian language (V28)

The figures on About are maintained in `assets/profile-facts-v28.json`:

- `papers.minimum` is an **owner-supplied** total across papers and manuscripts, not a live citation or journal database count.
- `projects` is the current number of project detail pages (17 in this release).
- `countries.total` counts distinct countries associated with the CV's education and research positions, including remote appointments.
- `firstAppointment` is used to compute elapsed calendar years, not accumulated full-time employment.

The numbers animate on first view, but **they are not live analytics**. Rebuild or update the JSON as the professional record changes.

English and Italian copy are maintained in `assets/i18n-v13.js` and `assets/i18n-v28-content.js`. All public pages now expose the EN/IT switch; the language choice is stored locally and is also propagated to internal page links as `?lang=it`.
