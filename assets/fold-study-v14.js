/* A live drawing of the universal saddle-node normal form.
   V(x; a) = x^3 / 3 - a*x. This is an explanatory local model,
   not a fitted numerical solution of the full Kähler potential. */
(() => {
  'use strict';
  const stage = document.querySelector('[data-fold-stage]');
  if (!stage) return;

  const main = stage.querySelector('[data-fold-main]');
  const far = stage.querySelector('[data-fold-echo="far"]');
  const near = stage.querySelector('[data-fold-echo="near"]');
  const barrier = stage.querySelector('[data-fold-point="barrier"]');
  const minimum = stage.querySelector('[data-fold-point="minimum"]');
  const barrierGuide = stage.querySelector('[data-fold-guide="barrier"]');
  const minimumGuide = stage.querySelector('[data-fold-guide="minimum"]');
  const reading = stage.querySelector('[data-fold-value]');
  const progress = stage.querySelector('[data-fold-progress]');
  if (![main, far, near, barrier, minimum, barrierGuide, minimumGuide].every(Boolean)) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const left = 140, right = 1060, bottom = 477, baseline = 290;
  const domain = 1.72, yScale = 143;
  let visible = true;
  let frame = 0;
  let lastDraw = 0;
  let elapsed = 0;
  let previousTime = 0;

  const potential = (x, a) => (x * x * x / 3) - a * x;
  const px = x => left + ((x + domain) / (2 * domain)) * (right - left);
  const py = value => baseline - value * yScale;

  function curve(a) {
    const points = [];
    for (let i = 0; i <= 146; i++) {
      const x = -domain + 2 * domain * i / 146;
      points.push(`${i ? 'L' : 'M'}${px(x).toFixed(1)} ${py(potential(x, a)).toFixed(1)}`);
    }
    return points.join(' ');
  }

  function setPoint(node, guide, x, a) {
    const screenX = px(x);
    const screenY = py(potential(x, a));
    node.setAttribute('cx', screenX.toFixed(1));
    node.setAttribute('cy', screenY.toFixed(1));
    guide.setAttribute('x1', screenX.toFixed(1));
    guide.setAttribute('x2', screenX.toFixed(1));
    guide.setAttribute('y1', screenY.toFixed(1));
    guide.setAttribute('y2', String(bottom));
  }

  function draw(a) {
    main.setAttribute('d', curve(a));
    near.setAttribute('d', curve(a * .70));
    far.setAttribute('d', curve(a * 1.32));
    const stationary = Math.sqrt(a);
    setPoint(barrier, barrierGuide, -stationary, a);
    setPoint(minimum, minimumGuide, stationary, a);
    if (reading) reading.textContent = a.toFixed(2);
    if (progress) progress.style.width = `${Math.max(0, Math.min(100, a / 1.15 * 100)).toFixed(1)}%`;
  }

  function animate(time) {
    frame = 0;
    if (!visible || document.hidden) return;
    if (previousTime) elapsed += Math.min(80, time - previousTime);
    previousTime = time;
    if (time - lastDraw >= 33) {
      const phase = (1 + Math.cos(elapsed * .00033)) * .5;
      const a = .018 + 1.13 * phase * phase;
      draw(a);
      lastDraw = time;
    }
    frame = requestAnimationFrame(animate);
  }

  function start() {
    if (reduced || !visible || document.hidden || frame) return;
    previousTime = 0;
    frame = requestAnimationFrame(animate);
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }

  draw(.78);
  if (!reduced) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? false;
        visible ? start() : stop();
      }, { threshold: .02 });
      observer.observe(stage);
    }
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    start();
  }
})();
