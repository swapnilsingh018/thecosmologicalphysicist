import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const index = read('index.html');
const publicPage = read('world.html');
const privatePage = read('private.html');
const themeCSS = read('assets/portal-v12.css');

for (const page of [index, publicPage, privatePage]) {
  assert.match(page, /family=STIX\+Two\+Text/, 'all three pages must use the same typeset face');
  assert.match(page, /assets\/portal-v12\.css/, 'all three pages must share one design system');
}
assert.match(index, /id="blackhole-gateway-canvas"/);
assert.match(index, /data-gateway-mode="portal"/);
assert.equal((index.match(/class="choice-card"/g) ?? []).length, 2, 'the entrance has exactly two options');
assert.match(publicPage, /noindex, follow/, 'blank public space should not be indexed');
assert.doesNotMatch(publicPage, /Selected research|Project index|Publication record/i);
for (const id of ['portalStatus', 'loginForm', 'researchID', 'researchPassword', 'loginButton', 'resetButton', 'passwordView', 'passwordForm', 'workspaceView', 'signOutButton', 'projectList']) {
  assert.ok(privatePage.includes(`id="${id}"`), `auth flow requires ${id}`);
}
assert.match(themeCSS, /:root\[data-theme="dark"\]/);
assert.match(themeCSS, /:root\[data-theme="light"\]/);

const listeners = new Map();
const makeNode = () => ({
  attributes: {}, disabled: false, tabIndex: -1,
  setAttribute(name, value) { this.attributes[name] = value; },
  addEventListener(name, callback) { listeners.set(`${this.id}:${name}`, callback); },
  focus() { this.focused = true; }
});
const stage = { ...makeNode(), id: 'stage', dataset: {} };
const enter = { ...makeNode(), id: 'enter' };
const panel = { ...makeNode(), id: 'panel', querySelectorAll: () => links };
const back = { ...makeNode(), id: 'back' };
const links = [makeNode(), makeNode()];
const nodes = { 'blackhole-entry': stage, 'blackhole-enter': enter, portalChoices: panel, portalReturn: back };
let timerCallback;
vm.runInNewContext(read('assets/gateway.js'), {
  document: { getElementById: id => nodes[id], addEventListener: (name, callback) => listeners.set(`document:${name}`, callback) },
  window: { matchMedia: () => ({ matches: false }), clearTimeout: () => {}, setTimeout: callback => { timerCallback = callback; return 1; } }
});
assert.equal(stage.dataset.phase, 'rest');
listeners.get('enter:click')();
assert.equal(stage.dataset.phase, 'transition');
timerCallback();
assert.equal(stage.dataset.phase, 'choices');
assert.equal(panel.attributes['aria-hidden'], 'false');
assert.ok(links.every(link => link.tabIndex === 0));
assert.ok(back.focused);
listeners.get('back:click')();
assert.equal(stage.dataset.phase, 'rest');
assert.equal(panel.attributes['aria-hidden'], 'true');
assert.ok(links.every(link => link.tabIndex === -1));

console.log('PASS: three-page design, typesetting, real-auth hooks and two-path navigation.');
