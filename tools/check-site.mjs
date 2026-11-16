import fs from "node:fs";
import path from "node:path";

const root = new URL("../", import.meta.url).pathname;
const htmlFiles = [];
const publicTextFiles = [];
function visit(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name.startsWith(".") || item.name === "tools") continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) visit(full);
    else {
      if (item.name.endsWith(".html")) htmlFiles.push(full);
      if (/\.(?:html|css|js|svg|xml)$/i.test(item.name)) publicTextFiles.push(full);
    }
  }
}
visit(root);
const issues = [];
const platformMarkers = [/chatgpt/i, /openai/i, /codex/i, /luckyarbor/i, /\b(?:made|built|powered|generated)\s+(?:by|with)\s+(?:an?\s+)?AI\b/i];
for (const file of publicTextFiles) {
  const source = fs.readFileSync(file, "utf8");
  if (platformMarkers.some(pattern => pattern.test(source))) {
    issues.push(path.relative(root, file) + ": platform branding or attribution found");
  }
}
const paths = new Set(htmlFiles.map(f => path.relative(root, f)));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  if (rel === "404.html" || rel === "private.html") {
    if (!html.includes('name="robots" content="noindex')) issues.push(rel + ": must be noindex");
    continue;
  }
  const publicPath = rel === "index.html" ? "/" : rel.endsWith("/index.html") ? "/" + rel.slice(0, -"index.html".length) : "/" + rel;
  const target = new URL(publicPath, "https://www.swapnilsingh.co.in/").href;
  const c = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!c || c[1] !== target) issues.push(rel + ": bad canonical");
  if (!/<meta[^>]*name="description"/.test(html)) issues.push(rel + ": missing description");
  if (!/<meta[^>]*property="og:title"/.test(html)) issues.push(rel + ": missing OG title");
  if (/will appear here|complete record will open here|This page will later/i.test(html)) issues.push(rel + ": unfinished placeholder");
  for (const embed of html.matchAll(/<iframe\b[^>]*\bsrc=["'](https?:[^"']+)/gi)) {
    if (new URL(embed[1]).hostname !== "open.spotify.com") issues.push(rel + ": unapproved external iframe");
  }
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const link = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(link)) continue;
    const [withoutHash, fragment] = link.split("#");
    const pathname = withoutHash.split("?")[0];
    const resolved = path.resolve(path.dirname(file), pathname || ".");
    if (!resolved.startsWith(root)) { issues.push(rel + ": out-of-root " + link); continue; }
    if (!fs.existsSync(resolved)) { issues.push(rel + ": missing " + link); continue; }
    if (fragment && pathname.endsWith(".html")) {
      const destination = fs.readFileSync(resolved, "utf8");
      if (!destination.includes('id="' + fragment + '"')) issues.push(rel + ": missing fragment " + link);
    }
  }
}
const map = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const rel of paths) {
  if (rel === "404.html" || rel === "private.html") continue;
  if (/name="robots" content="noindex/.test(fs.readFileSync(path.join(root, rel), "utf8"))) continue;
  const publicPath = rel === "index.html" ? "" : rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel;
  if (!map.includes("https://www.swapnilsingh.co.in/" + publicPath)) {
    issues.push("Sitemap missing " + rel);
  }
}
if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: " + htmlFiles.length + " HTML pages, canonical metadata, internal assets and links, sitemap coverage.");
}
