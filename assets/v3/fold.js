/* Interactive figure: the local normal form near the Kähler stability wall.
   V(x; a) = x^3/3 - a x. For a > 0 there is a minimum at x = +sqrt(a) and a
   barrier at x = -sqrt(a); they merge at a = 0 (saddle-node).
   Barrier height  dV = (4/3) a^(3/2);  curvature at the minimum  V'' = 2 sqrt(a). */
(() => {
  'use strict';
  const root = document.querySelector('[data-fold]');
  if (!root) return;
  const svg = root.querySelector('svg');
  const input = root.querySelector('input[type="range"]');
  const out = root.querySelector('output');
  const curve = svg.querySelector('[data-curve]');
  const minDot = svg.querySelector('[data-min]');
  const maxDot = svg.querySelector('[data-max]');
  const gap = svg.querySelector('[data-gap]');
  const dV = root.querySelector('[data-dv]');
  const m2 = root.querySelector('[data-m2]');
  const state = root.querySelector('[data-state]');

  // Plot window (data units) mapped to the SVG viewBox 0 0 560 320.
  const X0 = -2.1, X1 = 2.1, Y0 = -1.6, Y1 = 1.6;
  const L = 48, R = 540, T = 18, B = 290;
  const px = x => L + (x - X0) / (X1 - X0) * (R - L);
  const py = y => B - (Math.max(Y0, Math.min(Y1, y)) - Y0) / (Y1 - Y0) * (B - T);
  const V = (x, a) => x * x * x / 3 - a * x;
  const fmt = v => v.toFixed(2).replace('-', '−');

  function draw(a) {
    let d = '';
    for (let i = 0; i <= 220; i++) {
      const x = X0 + (X1 - X0) * i / 220;
      d += (i ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(V(x, a)).toFixed(1);
    }
    curve.setAttribute('d', d);
    out.value = fmt(a);
    if (a > 0) {
      const r = Math.sqrt(a);
      minDot.setAttribute('cx', px(r)); minDot.setAttribute('cy', py(V(r, a)));
      maxDot.setAttribute('cx', px(-r)); maxDot.setAttribute('cy', py(V(-r, a)));
      gap.setAttribute('x1', px(r)); gap.setAttribute('x2', px(r));
      gap.setAttribute('y1', py(V(-r, a))); gap.setAttribute('y2', py(V(r, a)));
      [minDot, maxDot, gap].forEach(el => el.removeAttribute('visibility'));
      dV.textContent = fmt(4 / 3 * Math.pow(a, 1.5));
      m2.textContent = fmt(2 * r);
      state.textContent = a < 0.12 ? 'Close to the wall: the minimum is about to disappear.' : '';
    } else {
      [minDot, maxDot, gap].forEach(el => el.setAttribute('visibility', 'hidden'));
      dV.textContent = '0';
      m2.textContent = '—';
      state.textContent = a === 0 ? 'At the wall: minimum and barrier have merged.' : 'Past the wall: no minimum, the volume runs away.';
    }
  }
  input.addEventListener('input', () => draw(parseFloat(input.value)));
  draw(parseFloat(input.value));
})();
