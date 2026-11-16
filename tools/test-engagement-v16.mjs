import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../assets/engagement.js', import.meta.url), 'utf8');
function run(config, gateway = false) {
  const classes = new Set();
  const listeners = {};
  const label = { textContent: '' };
  const buttonLabel = { textContent: '' };
  const action = {
    querySelector: () => buttonLabel,
    addEventListener: (name, callback) => { listeners[name] = callback; }
  };
  const dock = {
    dataset: {},
    classList: { toggle: (name, on) => on ? classes.add(name) : classes.delete(name) },
    matches: selector => gateway && selector === '[data-chat-action]',
    addEventListener: (name, callback) => { listeners[name] = callback; },
    querySelector: selector => gateway
      ? ({ '[data-availability-label]': label })[selector]
      : ({ '[data-availability-label]': label, '[data-chat-action]': action })[selector]
  };
  const number = { textContent: '' };
  const stat = { hidden: true, querySelector: () => number };
  const appended = [];
  const window = { SKS_ENGAGEMENT_CONFIG: config, SKSLanguage: { translate: (_, fallback) => fallback } };
  const document = {
    querySelector: selector => ({ '[data-availability]': dock, '[data-visitor-stat]': stat })[selector],
    addEventListener: () => {},
    createElement: () => ({}),
    head: { appendChild: node => appended.push(node) },
    documentElement: { lang: 'en' }
  };
  runInNewContext(source, { window, document });
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

const entrance = run({ tawkPropertyId: '0123456789abcdef', tawkWidgetId: 'default' }, true);
entrance.window.Tawk_API.getStatus = () => 'online';
entrance.window.Tawk_API.onLoad();
assert(entrance.classes.has('is-online'), 'the entrance pill uses the same real availability');
let toggled = false;
entrance.window.Tawk_API.maximize = () => { toggled = true; };
entrance.listeners.click({ preventDefault() {} });
assert(toggled, 'the entrance pill opens actual chat when connected');

console.log('PASS: no invented status/count, on-demand configured widget and truthful live presence changes.');
