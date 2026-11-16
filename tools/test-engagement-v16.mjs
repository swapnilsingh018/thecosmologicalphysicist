import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../assets/engagement.js', import.meta.url), 'utf8');
function run(config) {
  const classes = new Set();
  const listeners = {};
  const label = { textContent: '' };
  const buttonLabel = { textContent: '' };
  const action = { querySelector: () => buttonLabel };
  const dock = {
    dataset: {},
    classList: { toggle: (name, on) => on ? classes.add(name) : classes.delete(name) },
    querySelector: selector => ({ '[data-availability-label]': label })[selector]
  };
  const number = { textContent: '' };
  const stat = { hidden: true, querySelector: () => number };
  const appended = [];
  const window = { SKS_ENGAGEMENT_CONFIG: config, SKSLanguage: { translate: (_, fallback) => fallback } };
  const document = {
    querySelector: selector => ({ '[data-availability]': dock, '[data-visitor-stat]': stat })[selector],
    querySelectorAll: selector => ({ '[data-availability]': [dock], '[data-chat-trigger]': [action] })[selector] || [],
    addEventListener: () => {},
    dispatchEvent: () => {},
    createElement: () => ({}),
    head: { appendChild: node => appended.push(node) },
    documentElement: { lang: 'en' }
  };
  runInNewContext(source, { window, document, CustomEvent: class { constructor(name, options) { this.type = name; this.detail = options?.detail; } } });
  return { window, dock, classes, label, buttonLabel, listeners, appended, stat };
}

const unconfigured = run({ tawkPropertyId: '', tawkWidgetId: '', visitorStatsEndpoint: '' });
assert.equal(unconfigured.appended.length, 0, 'no third-party script until the owner configures one');
assert.equal(unconfigured.label.textContent, 'By email');
assert.equal(unconfigured.stat.hidden, true, 'no invented visitor total');

const configured = run({ tawkPropertyId: '0123456789abcdef', tawkWidgetId: 'default', visitorStatsEndpoint: '' });
assert.equal(configured.appended.length, 1, 'a configured property loads one chat widget');
assert.equal(configured.appended[0].src, 'https://embed.tawk.to/0123456789abcdef/default');
configured.window.Tawk_API.getStatus = () => 'online';
configured.window.Tawk_API.onLoad();
assert(configured.classes.has('is-online'), 'green status is based on the provider');
assert.equal(configured.buttonLabel.textContent, 'Live chat');
configured.window.Tawk_API.onStatusChange('away');
assert(configured.classes.has('is-away'), 'away status is distinct from online');
assert(!configured.classes.has('is-online'));
configured.window.Tawk_API.onStatusChange('offline');
assert.equal(configured.label.textContent, 'Offline');

const entrance = run({ tawkPropertyId: '0123456789abcdef', tawkWidgetId: 'default' });
entrance.window.Tawk_API.getStatus = () => 'online';
entrance.window.Tawk_API.onLoad();
assert(entrance.classes.has('is-online'), 'the entrance pill uses the same real availability');
let toggled = false;
entrance.window.Tawk_API.maximize = () => { toggled = true; };
assert(entrance.window.SKSChat.openLive(), 'real chat can be opened only when ready');
assert(toggled, 'live provider actually opened from the contact panel');
assert.equal(unconfigured.window.SKSChat.openLive(), false, 'unconfigured chat cannot pretend to open');

console.log('PASS: no invented status/count, genuine widget opening and truthful live presence changes.');
