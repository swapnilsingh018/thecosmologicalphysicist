import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(new URL("../", import.meta.url).pathname);
const source = fs.readFileSync(path.join(root, "assets/theme.js"), "utf8");

function run({ stored = null, storageAvailable = true } = {}) {
  const callbacks = new Map();
  const updates = new Map();
  const word = { textContent: "" };
  const symbol = { textContent: "" };
  const button = {
    setAttribute(key, value) { updates.set(key, value); },
    querySelector(selector) { return selector === ".theme-word" ? word : symbol; },
    addEventListener(name, handler) { callbacks.set(`button:${name}`, handler); }
  };
  const rootNode = { dataset: {}, style: {} };
  const meta = { content: "" };
  const local = {
    value: stored,
    getItem() { if (!storageAvailable) throw Error("blocked"); return this.value; },
    setItem(_key, value) { if (!storageAvailable) throw Error("blocked"); this.value = value; }
  };
  const document = {
    documentElement: rootNode,
    readyState: "loading",
    querySelector(selector) { return selector === 'meta[name="theme-color"]' ? meta : null; },
    querySelectorAll(selector) { return selector === "[data-theme-toggle]" ? [button] : []; },
    addEventListener(name, handler) { callbacks.set(`document:${name}`, handler); }
  };
  const window = { addEventListener(name, handler) { callbacks.set(`window:${name}`, handler); } };
  vm.runInNewContext(source, { document, window, localStorage: local });
  callbacks.get("document:DOMContentLoaded")();
  return { rootNode, meta, word, symbol, updates, callbacks, local };
}

let scenario = run();
assert.equal(scenario.rootNode.dataset.theme, "dark", "dark is the intentional default");
assert.equal(scenario.updates.get("aria-label"), "Switch to light mode");
assert.equal(scenario.word.textContent, "Light");
scenario.callbacks.get("button:click")();
assert.equal(scenario.rootNode.dataset.theme, "light");
assert.equal(scenario.rootNode.style.colorScheme, "light");
assert.equal(scenario.local.value, "light", "preference persists");
assert.equal(scenario.updates.get("aria-label"), "Switch to dark mode");
assert.equal(scenario.meta.content, "#ebe6da");

scenario = run({ stored: "light" });
assert.equal(scenario.rootNode.dataset.theme, "light", "saved mode restores before paint");
scenario.callbacks.get("window:storage")({ key: "sks-appearance", newValue: "dark" });
assert.equal(scenario.rootNode.dataset.theme, "dark", "changes in another tab synchronize");

scenario = run({ storageAvailable: false });
scenario.callbacks.get("button:click")();
assert.equal(scenario.rootNode.dataset.theme, "light", "mode works even when storage is blocked");

const pages = [];
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "tools") continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(full);
    else if (entry.name.endsWith(".html")) pages.push(full);
  }
}
visit(root);
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  assert.match(html, /data-theme-toggle/, `${page} requires a visible button`);
  assert.match(html, /assets\/theme\.js/, `${page} requires the theme runtime`);
  assert.match(html, /assets\/(?:editorial-system|portal-v12)\.css/, `${page} requires both palettes`);
}

const newPalette = fs.readFileSync(path.join(root, "assets/portal-v12.css"), "utf8");
assert.match(newPalette, /:root\[data-theme="dark"\]/, "redesign must define a dark palette");
assert.match(newPalette, /:root\[data-theme="light"\]/, "redesign must define a light palette");

console.log(`PASS: theme switching, persistence, storage fallback, and controls on ${pages.length} pages.`);
