/* Site behaviour shared by all v2 pages: header state, mobile menu, live visitor count. */
(() => {
  'use strict';

  /* GoatCounter site code: the "xxx" in https://xxx.goatcounter.com.
     Leave empty and the visitor line stays hidden; nothing is loaded. */
  const GOATCOUNTER = '';

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');

  // Header turns solid once the page scrolls, so content never runs under bare text.
  if (header) {
    const solid = () => header.classList.toggle('is-solid', window.scrollY > 24 || !header.hasAttribute('data-transparent'));
    solid();
    window.addEventListener('scroll', solid, { passive: true });
  }

  if (header && toggle) {
    const set = open => {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', () => set(!header.classList.contains('is-open')));
    header.querySelectorAll('.site-nav a').forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  /* Live unique-visitor count (GoatCounter: cookie-free, no ads).
     The tracking script records the visit; the public counter endpoint
     returns the site-wide unique-visitor total, refreshed every minute. */
  const box = document.querySelector('[data-visitor-count]');
  const num = document.querySelector('[data-visitor-number]');
  const code = GOATCOUNTER.trim();
  if (!code || !/^[a-z0-9-]+$/i.test(code)) return;

  const origin = `https://${code}.goatcounter.com`;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `${origin}/count`;
  document.head.appendChild(s);

  if (!box || !num) return;
  const refresh = () => {
    fetch(`${origin}/counter/TOTAL.json`, { credentials: 'omit', cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(d => {
        const value = String(d.count ?? '').trim();
        if (!value) return;
        num.textContent = value;
        box.hidden = false;
      })
      .catch(() => {}); // on failure the line simply stays hidden; never a made-up number
  };
  refresh();
  setInterval(() => { if (!document.hidden) refresh(); }, 60000);
})();
