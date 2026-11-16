/* Local editorial facts, not simulated visitor analytics or citation metrics.
 * Figures are maintained in profile-facts-v28.json; no service credentials. */
(() => {
  'use strict';
  const wrapper = document.querySelector('[data-profile-stats]');
  if (!wrapper) return;
  const cells = [...wrapper.querySelectorAll('[data-stat]')];
  const fallback = { papers: 25, projects: 17, countries: 7, years: 4 };
  const lessMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  let values = fallback;
  let shown = false;
  const yearsSince = iso => {
    const start = new Date(iso + 'T00:00:00Z');
    const now = new Date();
    if (!Number.isFinite(start.getTime()) || now < start) return fallback.years;
    let elapsed = now.getUTCFullYear() - start.getUTCFullYear();
    if (now.getUTCMonth() < start.getUTCMonth() ||
        (now.getUTCMonth() === start.getUTCMonth() && now.getUTCDate() < start.getUTCDate())) elapsed--;
    return Math.max(0, elapsed);
  };
  const render = (fraction) => {
    const eased = 1 - Math.pow(1 - Math.min(1, Math.max(0, fraction)), 3);
    cells.forEach(cell => {
      const label = cell.dataset.stat;
      const target = Number(values[label]) || 0;
      const number = Math.round(target * eased);
      cell.textContent = `${number}${label === 'papers' || label === 'years' ? '+' : ''}`;
      const suffix = (label === 'papers' || label === 'years')
        ? (document.documentElement.lang === 'it' ? ' o più' : ' plus') : '';
      cell.setAttribute('aria-label', `${target}${suffix}`);
    });
  };
  const run = () => {
    if (shown) return;
    shown = true;
    if (lessMotion || typeof requestAnimationFrame !== 'function') { render(1); return; }
    const duration = 920;
    let start = null;
    const step = now => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / duration);
      render(t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  // Same-domain JSON is intentionally editable without rebuilding site scripts.
  fetch(new URL('assets/profile-facts-v28.json', document.baseURI), { cache:'no-store' })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('Unreachable fact file')))
    .then(data => {
      values = {
        papers: Number.isInteger(data?.papers?.minimum) && data.papers.minimum >= 0 ? data.papers.minimum : fallback.papers,
        projects: Number.isInteger(data?.projects) && data.projects >= 0 ? data.projects : fallback.projects,
        countries: Number.isInteger(data?.countries?.total) && data.countries.total >= 0 ? data.countries.total : fallback.countries,
        years: yearsSince(data?.firstAppointment || '2022-07-01')
      };
      if (shown) render(1);
    }).catch(() => { /* Accurate HTML fallback stays visible. */ });
  document.addEventListener('sks:languagechange', () => { if (shown) render(1); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); run(); }
    }, { threshold: 0.2 });
    observer.observe(wrapper);
  } else run();
})();
