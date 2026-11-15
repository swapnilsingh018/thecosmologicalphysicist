// One-time mechanical migration: include the same final theme layer on every
// tracked HTML page, with the correct relative asset path. Safe to rerun.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(new URL("../", import.meta.url).pathname);
const files = execFileSync("git", ["ls-files", "--", "*.html"], {
  cwd: root,
  encoding: "utf8"
}).trim().split("\n").filter(Boolean);
let changed = 0;

for (const relative of files) {
  const filename = path.join(root, relative);
  let html = fs.readFileSync(filename, "utf8");
  if (!/<\/head>/i.test(html)) throw new Error("Missing head: " + relative);
  if (!html.includes("olive-theme.css")) {
    const href = relative.startsWith("projects/")
      ? "../assets/olive-theme.css"
      : relative === "404.html" ? "/assets/olive-theme.css" : "assets/olive-theme.css";
    html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="' + href + '">\n</head>');
  }
  html = html.replace(/<meta\b[^>]*name=["']theme-color["'][^>]*>/gi, (tag) =>
    tag.replace(/(content=["'])#[0-9a-f]+(["'])/i, "$1#0d160e$2"));
  if (html !== fs.readFileSync(filename, "utf8")) {
    fs.writeFileSync(filename, html);
    changed++;
  }
}

console.log("Theme linked in " + files.length + " HTML files; updated " + changed + ".");
