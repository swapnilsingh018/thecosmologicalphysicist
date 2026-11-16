import fs from "node:fs";
import path from "node:path";

// A deterministic, repeatable asset-and-control installer for the buildless site.
const root = path.resolve(new URL("../", import.meta.url).pathname);
const toggle = '<button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch color mode" aria-pressed="false"><span class="theme-symbol" aria-hidden="true">☼</span><span class="theme-word">Light</span></button>';
const pages = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "tools") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) pages.push(full);
  }
}
walk(root);

for (const page of pages) {
  const rel = path.relative(root, page).replaceAll(path.sep, "/");
  const prefix = "../".repeat(rel.split("/").length - 1);
  let html = fs.readFileSync(page, "utf8");

  if (!html.includes(`${prefix}assets/theme.js`)) {
    html = html.replace(/<head\b[^>]*>/i, match => `${match}\n<script src="${prefix}assets/theme.js"></script>`);
  }
  if (!html.includes(`${prefix}assets/editorial-system.css`)) {
    html = html.replace(/<\/head>/i, `<link rel="stylesheet" href="${prefix}assets/editorial-system.css">\n</head>`);
  }

  if (!html.includes("data-theme-toggle")) {
    if (rel === "index.html") {
      html = html.replace(/(<div class="cosmic-vignette"[^>]*><\/div>)/i, `$1\n      ${toggle}`);
    } else if (rel === "research/kahler-stability-wall/index.html") {
      html = html.replace(/(<header\b[^>]*class="site-header"[^>]*>[\s\S]*?)(<\/header>)/i, `$1${toggle}\n$2`);
    } else if (/<header\b[^>]*class="[^"]*\bmasthead\b/i.test(html)) {
      html = html.replace(/(<header\b[^>]*class="[^"]*\bmasthead\b[^>]*>[\s\S]*?)(<\/header>)/i, `$1${toggle}\n$2`);
    } else {
      html = html.replace(/<body\b[^>]*>/i, match => `${match}\n${toggle}`);
    }
  }

  if (rel === "research/kahler-stability-wall/index.html" && !html.includes('class="simulation-page"')) {
    html = html.replace(/<body>/i, '<body class="simulation-page">');
  }
  if (rel === "index.html") {
    html = html.replace('From first principles to working solutions.</p>', 'Between equations and working systems.</p>');
  }
  if (rel === "world.html") {
    html = html.replace(
      '<p class="welcome-lede">Computational Physicist · Cosmology &amp; Gravitation</p>',
      '<p class="welcome-lede">Physicist &amp; engineer. Cosmology, numerical models, scientific software.</p>\n          <p class="welcome-note">I work on physical questions that need both mathematics and computation. Have a modelling or simulation problem? <a href="mailto:swapnilsingh.ph@gmail.com?subject=Computational%20Project%20Inquiry">Let’s discuss it.</a></p>'
    );
  }
  fs.writeFileSync(page, html);
}
console.log(`Editorial theme installed on ${pages.length} pages.`);
