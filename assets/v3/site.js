/* Shared behaviour: header state, mobile menu, live unique-visitor count. */
(() => {
  'use strict';

  /* GoatCounter site code, the "xxx" in https://xxx.goatcounter.com.
     While empty, nothing is loaded and the visitor line stays hidden. */
  const GOATCOUNTER = '';

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');

  if (header && header.hasAttribute('data-transparent')) {
    const solid = () => header.classList.toggle('is-solid', window.scrollY > 32);
    solid();
    window.addEventListener('scroll', solid, { passive: true });
  }

  if (header && toggle) {
    const label = toggle.querySelector('span');
    const set = open => {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', () => set(!header.classList.contains('is-open')));
    header.querySelectorAll('.site-nav a').forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    window.matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) set(false); });
  }

  /* Live unique-visitor count: GoatCounter is cookie-free and ad-free.
     count.js records the visit; the public counter returns the site-wide
     unique-visitor total, refreshed every minute. Never a made-up number. */
  const code = GOATCOUNTER.trim();
  if (!/^[a-z0-9-]+$/i.test(code)) return;
  const origin = `https://${code}.goatcounter.com`;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `${origin}/count`;
  document.head.appendChild(s);

  const box = document.querySelector('[data-visitor-count]');
  const num = document.querySelector('[data-visitor-number]');
  if (!box || !num) return;
  const refresh = () => fetch(`${origin}/counter/TOTAL.json`, { credentials: 'omit', cache: 'no-store' })
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(d => { const v = String(d.count ?? '').trim(); if (v) { num.textContent = v; box.hidden = false; } })
    .catch(() => {});
  refresh();
  setInterval(() => { if (!document.hidden) refresh(); }, 60000);
})();
