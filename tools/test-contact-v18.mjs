import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const code = readFileSync(new URL('../assets/contact-panel-v18.js', import.meta.url), 'utf8');
const handlers = new Map();
const create = () => ({
  hidden: false,
  listeners: {},
  addEventListener(type, fn) { this.listeners[type] = fn; },
  focus() { this.focused = true; },
  classList: { values: new Set(), toggle(name, active) { if (active) this.values.add(name); else this.values.delete(name); } }
});
const trigger = create();
const closer = create();
const scrim = create();
const live = create(); live.hidden = true;
const presence = create();
const light = create();
const form = create(); form.elements = { message: { value: 'A numerical project', focus() {} }, reply: { value: 'visitor@example.com' } };
const dialog = create();
dialog.querySelectorAll = () => [closer, live, form.elements.message, form.elements.reply];
const overlay = create(); overlay.hidden = true;
overlay.querySelector = selector => ({ '[role="dialog"]': dialog, '[data-chat-email-form]': form, '[data-chat-presence]': presence, '[data-chat-presence-light]': light, '[data-chat-live]': live })[selector];
overlay.querySelectorAll = selector => selector === '[data-chat-close]' ? [closer, scrim] : [];
const bodySet = new Set();
const document = {
  querySelector: selector => selector === '[data-contact-overlay]' ? overlay : null,
  querySelectorAll: selector => selector === '[data-chat-trigger]' ? [trigger] : [],
  addEventListener: (name, fn) => handlers.set(name, fn),
  body: { classList: { add: name => bodySet.add(name), remove: name => bodySet.delete(name) } },
  activeElement: null
};
let maximizeCount = 0;
const chat = { status: 'unknown', ready: false, openLive: () => { maximizeCount++; return true; } };
const window = { SKSChat: chat, SKSLanguage: { translate: (_, fallback) => fallback }, location: { href: 'https://example.org' } };
runInNewContext(code, { document, window });

assert.equal(overlay.hidden, true);
trigger.listeners.click();
assert.equal(overlay.hidden, false, 'contact button opens the proper panel');
assert.equal(presence.textContent, 'Available by email', 'unconfigured contact is never called online');
assert.equal(live.hidden, true, 'live chat CTA is absent until the operator account is connected');
assert.equal(dialog.focused, true, 'the panel receives focus');
assert(bodySet.has('contact-panel-open'));

chat.ready = true; chat.status = 'online'; handlers.get('sks:chatstatus')();
assert.equal(presence.textContent, 'Online for live chat');
assert.equal(live.hidden, false);
live.listeners.click();
assert.equal(maximizeCount, 1, 'live chat CTA delegates to real provider');
assert.equal(overlay.hidden, true, 'custom panel closes behind the operator widget');

trigger.listeners.click();
let prevented = false;
form.listeners.submit({ preventDefault() { prevented = true; } });
assert(prevented);
assert.match(window.location.href, /^mailto:swapnilsingh\.ph@gmail\.com\?subject=/);
assert.match(window.location.href, /A%20numerical%20project/);
assert.match(window.location.href, /visitor%40example\.com/);

handlers.get('keydown')({ key: 'Escape', preventDefault() {} });
assert.equal(overlay.hidden, true, 'Escape closes the overlay');
assert.equal(trigger.focused, true, 'keyboard focus returns to the opener');

console.log('PASS: contact open/close, keyboard focus, real-chat gating and mailto composition.');
