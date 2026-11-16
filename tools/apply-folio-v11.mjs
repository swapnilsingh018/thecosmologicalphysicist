/* Apply the portfolio architecture consistently across the buildless pages.
   Safe to rerun, and deliberately leaves the dedicated 3D model's CSS alone. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../", import.meta.url).pathname);
const pages = [];
const visit = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "tools" || entry.name === "supabase") continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(full);
    else if (entry.name.endsWith(".html")) pages.push(full);
  }
};
visit(root);
let updated = 0;
for (const file of pages) {
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  if (rel === "research/kahler-stability-wall/index.html") continue;
  const prefix = "../".repeat(rel.split("/").length - 1);
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes(prefix + "assets/folio-v11.css")) {
    const css = '<link rel="stylesheet" href="' + prefix + 'assets/folio-v11.css">';
    html = html.replace(/<\/head>/i, css + "\n</head>");
  }
  if (!html.includes("family=Manrope")) {
    const font = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">';
    html = html.replace(/<\/head>/i, font + "\n</head>");
  }
  fs.writeFileSync(file, html);
  updated++;
}
console.log("Folio v11 installed on " + updated + " HTML pages.");
