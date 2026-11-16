/* An accessible private correspondence panel. Email is never sent or stored by
   the webpage itself; the user's mail application remains the sender. */
(() => {
  'use strict';
  const overlay = document.querySelector('[data-contact-overlay]');
  if (!overlay) return;
  const dialog = overlay.querySelector('[role="dialog"]');
  const triggers = document.querySelectorAll('[data-chat-trigger]');
  const closers = overlay.querySelectorAll('[data-chat-close]');
  const form = overlay.querySelector('[data-chat-email-form]');
  const presence = overlay.querySelector('[data-chat-presence]');
  const light = overlay.querySelector('[data-chat-presence-light]');
  const live = overlay.querySelector('[data-chat-live]');
  let returnFocus = null;

  const translate = (key, fallback) => window.SKSLanguage?.translate(key, fallback) ?? fallback;
  const reflect = () => {
    const state = window.SKSChat || { status: 'unknown', ready: false };
    const wording = {
      unknown: ['chat_status_unknown', 'Available by email'],
      online: ['chat_status_online', 'Online for live chat'],
      away: ['chat_status_away', 'Temporarily away'],
      offline: ['chat_status_offline', 'Not online right now']
    };
    const [key, fallback] = wording[state.status] || wording.unknown;
    if (presence) presence.textContent = translate(key, fallback);
    if (light) {
      light.classList.toggle('is-online', state.status === 'online');
      light.classList.toggle('is-away', state.status === 'away');
    }
    if (live) live.hidden = !state.ready;
  };

  const open = trigger => {
    if (!overlay.hidden) return;
    returnFocus = trigger;
    reflect();
    overlay.hidden = false;
    document.body.classList.add('contact-panel-open');
    dialog?.focus({ preventScroll: true });
  };
  const close = () => {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('contact-panel-open');
    returnFocus?.focus({ preventScroll: true });
  };
  triggers.forEach(trigger => trigger.addEventListener('click', () => open(trigger)));
  closers.forEach(item => item.addEventListener('click', close));
  document.addEventListener('sks:chatstatus', reflect);
  document.addEventListener('sks:languagechange', reflect);
  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const candidates = [...dialog.querySelectorAll('button:not([hidden]), input, textarea')].filter(item => !item.disabled);
    if (!candidates.length) { event.preventDefault(); dialog.focus(); return; }
    const first = candidates[0];
    const last = candidates[candidates.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  live?.addEventListener('click', () => {
    if (window.SKSChat?.openLive?.()) close();
  });
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const note = String(form.elements.message.value || '').trim();
    const reply = String(form.elements.reply.value || '').trim();
    if (!note) { form.elements.message.focus(); return; }
    const subject = 'Website enquiry — Swapnil Kumar Singh';
    const body = `${note}${reply ? `\n\nReply to: ${reply}` : ''}`;
    const mailto = `mailto:swapnilsingh.ph@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
  reflect();
})();
