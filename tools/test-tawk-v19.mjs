import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');
const source = read('assets/engagement.js');
const config = { tawkPropertyId: '6afb1aa20808f53cc365feca', tawkWidgetId: '1k7ie034n', visitorStatsEndpoint: '' };

function run(settings) {
  const classes = new Set();
  const label = { textContent: '' };
  const actionLabel = { textContent: '' };
  const action = { listeners: {}, querySelector: () => actionLabel, addEventListener(name, callback) { this.listeners[name] = callback; } };
  const dock = { dataset: {}, classList: { toggle(name, active) { if (active) classes.add(name); else classes.delete(name); } }, querySelector: () => label };
  const number = { textContent: '' };
  const stat = { hidden: true, querySelector: () => number };
  const appended = [];
  const events = [];
  const window = { SKS_ENGAGEMENT_CONFIG: settings, SKSLanguage: { translate: (_, fallback) => fallback }, setTimeout: () => 1 };
  const document = {
    querySelector: selector => ({ '[data-visitor-stat]': stat })[selector],
    querySelectorAll: selector => ({ '[data-availability]': [dock], '[data-chat-trigger]': [action] })[selector] ?? [],
    addEventListener() {}, dispatchEvent: event => events.push(event),
    createElement: () => ({}), head: { appendChild: node => appended.push(node) },
    documentElement: { lang: 'en' }
  };
  runInNewContext(source, { document, window, CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options?.detail; } } });
  return { window, label, action, actionLabel, classes, appended, events, stat };
}

const missing = run({ tawkPropertyId: '', tawkWidgetId: '' });
assert.equal(missing.appended.length, 0, 'never add an unconfigured widget');
assert.equal(missing.label.textContent, 'Chat unavailable');
assert.equal(missing.window.SKSChat.requestLive(), false, 'do not simulate chat without a provider');
assert.equal(missing.stat.hidden, true, 'never invent a visitor count');

const active = run(config);
assert.equal(active.appended.length, 1, 'exactly one remote widget embed');
assert.equal(active.appended[0].src, 'https://embed.tawk.to/6afb1aa20808f53cc365feca/1k7ie034n');
assert.equal(active.label.textContent, 'Connecting…');
let prevented = false;
active.action.listeners.click({ preventDefault() { prevented = true; } });
assert(prevented, 'chat CTA is handled without navigating to email');
let hidden = 0; let shown = 0; let opened = 0;
active.window.Tawk_API.hideWidget = () => { hidden++; };
active.window.Tawk_API.showWidget = () => { shown++; };
active.window.Tawk_API.maximize = () => { opened++; };
active.window.Tawk_API.getStatus = () => 'online';
active.window.Tawk_API.onLoad();
assert.equal(opened, 1, 'clicking during load opens chat as soon as provider is ready');
assert.equal(shown, 1);
assert.equal(hidden, 1, 'hide the duplicate provider launcher');
assert(active.classes.has('is-online'), 'green is based on provider status');
assert.equal(active.actionLabel.textContent, 'Live chat');
active.window.Tawk_API.onStatusChange('away');
assert(active.classes.has('is-away'));
assert(!active.classes.has('is-online'));
active.window.Tawk_API.onStatusChange('offline');
assert.equal(active.label.textContent, 'Offline');
assert(active.window.SKSChat.openLive(), 'offline operator still permits provider message window');
active.window.Tawk_API.onChatMinimized();
assert.equal(hidden, 2);
const failed = run(config);
failed.appended[0].onerror();
assert.equal(failed.label.textContent, 'Chat unavailable');

for (const page of ['index.html', 'world.html']) {
  const html = read(page);
  assert.doesNotMatch(html, /data-chat-email-form|contact-overlay|contact-panel-v18\.js|mailto:/i, `${page} no longer routes conversations to email`);
  assert.match(html, /data-chat-trigger/, `${page} opens genuine chat`);
}
assert.match(read('assets/engagement-config.js'), /tawkPropertyId: "6afb1aa20808f53cc365feca"/);
assert.match(read('assets/engagement-config.js'), /tawkWidgetId: "1k7ie034n"/);
assert.doesNotMatch(source, /mailto:|@gmail|contact-panel/);

console.log('PASS: configured Tawk embed, one-click chat, queued opening, provider presence, and no email fallback.');
