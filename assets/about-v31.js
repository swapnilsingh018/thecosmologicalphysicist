/* V31: measured pointer highlight. Does not move the canvas or page. */
(() => {
  'use strict';
  const rows = document.querySelectorAll('.about-v27 .experience-row');
  const lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!lessMotion) {
    rows.forEach((row) => row.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const r = row.getBoundingClientRect();
      row.style.setProperty('--about-mx', `${Math.round(event.clientX-r.left)}px`);
      row.style.setProperty('--about-my', `${Math.round(event.clientY-r.top)}px`);
    }, { passive:true }));
  }
  document.querySelectorAll('.institution-favicon').forEach((image) => {
    image.addEventListener('error', () => image.parentElement?.classList.add('icon-unavailable'), {once:true});
  });
})();
