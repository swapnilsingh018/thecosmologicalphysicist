/* Scientific visualization of arXiv:2611.08491.
   Change the URL below only when a real journal-version link is available. */
const JOURNAL_PUBLICATION_URL = "";

const $ = (id) => document.getElementById(id);
const TAU = Math.PI * 2;
const BENCH = Object.freeze({
  gs: 0.2, L: 5, beta: 1, theta: 0.55,
  alpha: 0.03343948486,
  sigmaC: 460.6194988,
  aC: 1.3460268e-7,
  w0: 1e-4,
  y: 0.3189688111,
  rhoMin: 7.652995675,
  budget: 320,
  conifold: 46,
  fit: 1.1
});
const REDUCED_SCALE = BENCH.beta * Math.exp(-9 * BENCH.L / 2);
const PRESET_COLORS = {
  bg: "#000000", grid: "rgba(236,231,221,.09)", text: "#8b857a",
  gold: "#e3a764", blue: "#9fc4c9", orange: "#e3a764", rose: "#d58a8a"
};
const superscript = (str) => String(str).replace(/-/g, "⁻").replace(/0/g, "⁰").replace(/1/g, "¹").replace(/2/g, "²").replace(/3/g, "³").replace(/4/g, "⁴").replace(/5/g, "⁵").replace(/6/g, "⁶").replace(/7/g, "⁷").replace(/8/g, "⁸").replace(/9/g, "⁹");
const sci = (n, digits = 3) => Number.isFinite(n) ? n.toExponential(digits).replace("e-", " × 10⁻").replace("e+", " × 10⁺") : "—";
const comma = (v) => Number(v).toLocaleString("en-US");

function canvasSize(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(10, rect.width), h = Math.max(10, rect.height);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}
function line(ctx, pts, color, width = 2, dash = []) {
  if (!pts.length) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke(); ctx.restore();
}
function dot(ctx, x, y, color, radius = 5, halo = true) {
  ctx.save(); if (halo) { ctx.shadowColor = color; ctx.shadowBlur = 18; }
  ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU);
  ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
function label(ctx, s, x, y, color = PRESET_COLORS.text, size = 10, align = "left") {
  ctx.save(); ctx.font = size + "px DM Mono, monospace"; ctx.fillStyle = color;
  ctx.textAlign = align; ctx.fillText(s, x, y); ctx.restore();
}

// Eq. (7), in reduced four-dimensional Planck units.
function U(sigma, a) {
  return a * Math.pow(sigma, -2)
    + BENCH.alpha * Math.pow(sigma, -4)
    - BENCH.beta * Math.pow(sigma, -4.5) * (Math.log(sigma) - BENCH.L);
}
// Eq. (43): U_sigma = sigma^(-11/2) F.
function F(sigma, a) {
  return BENCH.beta * (4.5 * (Math.log(sigma) - BENCH.L) - 1)
    - 4 * BENCH.alpha * Math.sqrt(sigma)
    - 2 * a * Math.pow(sigma, 2.5);
}
function dU(sigma, a) { return Math.pow(sigma, -5.5) * F(sigma, a); }
const U_CRIT = U(BENCH.sigmaC, BENCH.aC);
function reducedHeight(x, tensionRatio) {
  return (U(x * BENCH.sigmaC, tensionRatio * BENCH.aC) - U_CRIT) / REDUCED_SCALE;
}
function reducedSlope(x, tensionRatio) {
  return BENCH.sigmaC * dU(x * BENCH.sigmaC, tensionRatio * BENCH.aC) / REDUCED_SCALE;
}
function stationaryPoints(tensionRatio) {
  if (tensionRatio >= 1 - 1e-9) return tensionRatio <= 1 + 1e-9 ? [1, 1] : [];
  const roots = [];
  const a = BENCH.aC * tensionRatio, N = 700, low = 0.38, high = 2.4;
  let left = low, fleft = F(left * BENCH.sigmaC, a);
  for (let i = 1; i <= N; i++) {
    const right = low + (high - low) * i / N, fright = F(right * BENCH.sigmaC, a);
    if (fleft * fright < 0) {
      let lo = left, hi = right, flo = fleft;
      for (let j = 0; j < 45; j++) {
        const mid = (lo + hi) / 2, fm = F(mid * BENCH.sigmaC, a);
        if (flo * fm <= 0) hi = mid;
        else { lo = mid; flo = fm; }
      }
      roots.push((lo + hi) / 2);
    }
    left = right; fleft = fright;
  }
  return roots;
}

const potential = $("potentialCanvas");
const tension = $("tensionSlider");
let tensionRatio = Number(tension.value);
let flow = { active: false, x: 0.91, velocity: 0, last: 0 };
function drawPotential() {
  const { ctx, w, h } = canvasSize(potential);
  const p = { left: w < 500 ? 47 : 68, right: 20, top: 26, bottom: 54 };
  const pw = w - p.left - p.right, ph = h - p.top - p.bottom;
  const xlo = .55, xhi = 1.63;
  const close = tensionRatio >= .91, ymin = close ? -.00155 : -.0060, ymax = close ? .013 : .0145;
  const X = (x) => p.left + (x - xlo) / (xhi - xlo) * pw;
  const Y = (y) => p.top + (ymax - y) / (ymax - ymin) * ph;

  const wash = ctx.createLinearGradient(0, 0, 0, h);
  wash.addColorStop(0, "#0a0907"); wash.addColorStop(1, "#000000");
  ctx.fillStyle = wash; ctx.fillRect(0, 0, w, h);
  ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i++) {
    const x = p.left + i / 6 * pw;
    ctx.strokeStyle = PRESET_COLORS.grid; ctx.beginPath(); ctx.moveTo(x, p.top); ctx.lineTo(x, p.top + ph); ctx.stroke();
    label(ctx, (xlo + i / 6 * (xhi - xlo)).toFixed(2), x, h - 27, PRESET_COLORS.text, 10, "center");
  }
  for (let i = 0; i <= 5; i++) {
    const y = ymin + i / 5 * (ymax - ymin), sy = Y(y);
    ctx.strokeStyle = PRESET_COLORS.grid; ctx.beginPath(); ctx.moveTo(p.left, sy); ctx.lineTo(w - p.right, sy); ctx.stroke();
    label(ctx, y.toFixed(3), p.left - 9, sy + 3, PRESET_COLORS.text, 10, "right");
  }
  // Fold guide x=1, y=0.
  const foldX = X(1), foldY = Y(0);
  line(ctx, [[foldX, p.top], [foldX, p.top + ph]], "rgba(220,193,139,.50)", 1, [5, 6]);
  line(ctx, [[p.left, foldY], [w - p.right, foldY]], "rgba(220,193,139,.18)", 1, [4, 5]);
  label(ctx, "σ / σc", w - p.right, h - 6, "#c9d4da", 11, "right");
  label(ctx, "[U − Uc] / (βe⁻⁹ᴸᐟ²)", p.left, 15, "#c9d4da", w < 500 ? 9 : 10);
  const pts = [];
  for (let i = 0; i <= 500; i++) {
    const x = xlo + (xhi - xlo) * i / 500;
    pts.push([X(x), Y(reducedHeight(x, tensionRatio))]);
  }
  ctx.save(); ctx.beginPath(); ctx.rect(p.left, p.top, pw, ph); ctx.clip();
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (const pt of pts.slice(1)) ctx.lineTo(pt[0], pt[1]);
  ctx.lineTo(X(xhi), p.top + ph); ctx.lineTo(X(xlo), p.top + ph); ctx.closePath();
  const fill = ctx.createLinearGradient(0, p.top, 0, h);
  fill.addColorStop(0, "rgba(211,172,107,.22)"); fill.addColorStop(1, "rgba(211,172,107,.005)");
  ctx.fillStyle = fill; ctx.fill();
  ctx.shadowColor = "#e1bd80"; ctx.shadowBlur = 10;
  line(ctx, pts, "#e1bd80", 2.5); ctx.shadowBlur = 0;
  const roots = stationaryPoints(tensionRatio);
  if (roots.length === 2 && tensionRatio < 1) {
    dot(ctx, X(roots[0]), Y(reducedHeight(roots[0], tensionRatio)), PRESET_COLORS.blue, 6);
    dot(ctx, X(roots[1]), Y(reducedHeight(roots[1], tensionRatio)), PRESET_COLORS.orange, 6);
  } else if (roots.length === 2) dot(ctx, foldX, foldY, "#ffffff", 6);
  // Only a toy gradient-flow trajectory is integrated here, not an actual cosmological equation of motion.
  const fx = X(flow.x), fy = Y(reducedHeight(flow.x, tensionRatio));
  dot(ctx, fx, fy, flow.active ? "#e8f7ee" : "#c0b3a2", 5);
  ctx.restore();
  label(ctx, "CRITICAL σc", foldX + 8, p.top + 18, "#e1c792", 9);
}
function setPotential(q) {
  tensionRatio = Math.min(1.08, Math.max(.3, Number(q)));
  tension.value = String(tensionRatio);
  $("tensionValue").textContent = tensionRatio.toFixed(3);
  const roots = stationaryPoints(tensionRatio);
  const state = $("potentialState");
  state.className = "plot-state " + (tensionRatio > 1.0005 ? "lost" : tensionRatio >= .9995 ? "critical" : "stable");
  state.textContent = tensionRatio > 1.0005 ? "No minimum" : tensionRatio >= .9995 ? "Critical fold" : "Metastable minimum";
  if (tensionRatio < 1 && roots.length === 2) {
    const minU = U(roots[0] * BENCH.sigmaC, BENCH.aC * tensionRatio);
    const maxU = U(roots[1] * BENCH.sigmaC, BENCH.aC * tensionRatio);
    $("minSigma").textContent = (roots[0] * BENCH.sigmaC).toFixed(3);
    $("barrierSigma").textContent = (roots[1] * BENCH.sigmaC).toFixed(3);
    $("barrierHeight").textContent = sci(3 * BENCH.w0 ** 2 * Math.max(0, maxU - minU) / (3 * BENCH.w0 ** 2), 2);
    $("potentialExplain").textContent = "Two stationary points: the lower-volume root is locally stable; the higher-volume root is the barrier toward decompactification.";
  } else if (tensionRatio <= 1.0005) {
    $("minSigma").textContent = BENCH.sigmaC.toFixed(3);
    $("barrierSigma").textContent = BENCH.sigmaC.toFixed(3);
    $("barrierHeight").textContent = "0";
    $("potentialExplain").textContent = "At the exact fold, Uσ and Uσσ vanish together. The Kähler minimum and barrier collide.";
  } else {
    $("minSigma").textContent = "No local root";
    $("barrierSigma").textContent = "No local root";
    $("barrierHeight").textContent = "—";
    $("potentialExplain").textContent = "Beyond the wall, the nearby metastable Kähler valley has disappeared. The local one-volume stabilization no longer exists.";
  }
  document.querySelectorAll("[data-tension]").forEach((b) => b.classList.toggle("selected", Math.abs(Number(b.dataset.tension) - tensionRatio) < .001));
  flow.active = false; flow.velocity = 0; flow.x = .91; $("flowRun").textContent = "RUN MOTION ▶";
  drawPotential();
  updateChamberFromTension(tensionRatio, roots);
}

// The chamber visualizes a *parameter-space* surface, not a spatial embedding.
// Every surface vertex is evaluated with the benchmark's Eq. (7) potential.
const manifoldCanvas = $("manifoldCanvas");
const chamberSlider = $("chamberSlider");
const chamberPlay = $("chamberPlay");
const chamberMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let cameraYaw = -.77, cameraPitch = .68;
let chamberPlaying = false, chamberStart = 0, chamberVisible = false;
let chamberDrawTime = 0, lastChamberQ = tensionRatio, chamberFrame = 0;
let chamberDragging = null, lastInteraction = performance.now();
let chamberPausedElapsed = 0, chamberPlaybackEpoch = 0;
const chamberX0 = .57, chamberX1 = 1.62;
const chamberQ0 = .30, chamberQ1 = 1.08;
const meshNX = 44, meshNQ = 31;
const manifoldVertices = [];
for (let j = 0; j <= meshNQ; j++) {
  const q = chamberQ0 + (chamberQ1 - chamberQ0) * j / meshNQ;
  const row = [];
  for (let i = 0; i <= meshNX; i++) {
    const x = chamberX0 + (chamberX1 - chamberX0) * i / meshNX;
    row.push({ x, q, z: reducedHeight(x, q) });
  }
  manifoldVertices.push(row);
}
const stationaryBranches = [];
for (let i = 0; i <= 92; i++) {
  const q = chamberQ0 + (.99995 - chamberQ0) * i / 92;
  const roots = stationaryPoints(q);
  if (roots.length === 2) stationaryBranches.push({
    q, min: { x: roots[0], z: reducedHeight(roots[0], q) },
    barrier: { x: roots[1], z: reducedHeight(roots[1], q) }
  });
}
stationaryBranches.push({ q: 1, min: { x: 1, z: 0 }, barrier: { x: 1, z: 0 } });

function chamberProject(x, q, z, w, h) {
  const xn = (x - 1.02) / .59;
  const yn = (q - .70) / .47;
  const zn = z * 113;
  const cy = Math.cos(cameraYaw), sy = Math.sin(cameraYaw);
  const across = xn * cy - yn * sy;
  const back = xn * sy + yn * cy;
  const vertical = back * Math.sin(cameraPitch) - zn * Math.cos(cameraPitch);
  const depth = back * Math.cos(cameraPitch) + zn * Math.sin(cameraPitch);
  const scale = Math.min(w * .355, h * .365);
  return { x: w * .50 + across * scale, y: h * .555 + vertical * scale, depth };
}
function chamberPath(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k].x, pts[k].y);
}
function drawChamber(now = performance.now()) {
  if (!manifoldCanvas) return;
  const { ctx, w, h } = canvasSize(manifoldCanvas);
  const P = (x, q, z) => chamberProject(x, q, z, w, h);
  const ambient = ctx.createRadialGradient(w * .5, h * .43, 5, w * .5, h * .45, Math.max(w, h) * .8);
  ambient.addColorStop(0, "#1a1610");
  ambient.addColorStop(.43, "#0c0a08");
  ambient.addColorStop(1, "#000000");
  ctx.fillStyle = ambient; ctx.fillRect(0, 0, w, h);

  // A quiet technical grid provides parallax without claiming physical coordinates.
  ctx.save();
  ctx.strokeStyle = "rgba(137,185,197,.045)";
  ctx.lineWidth = 1;
  for (let i = -12; i <= 12; i++) {
    const gx = w * .5 + i * 52;
    line(ctx, [[gx, 0], [gx, h]], "rgba(117,157,174,.035)", 1);
  }
  for (let i = 0; i <= 11; i++) {
    const gy = i / 11 * h;
    line(ctx, [[0, gy], [w, gy]], "rgba(117,157,174,.035)", 1);
  }
  ctx.restore();

  // Project the analytic surface and depth-sort its quads, giving an orbitable
  // orthographic rendering without a third-party/WebGL dependency.
  const projected = manifoldVertices.map(row => row.map(v => P(v.x, v.q, v.z)));
  const quads = [];
  for (let j = 0; j < meshNQ; j++) {
    for (let i = 0; i < meshNX; i++) {
      const pts = [projected[j][i], projected[j][i + 1], projected[j + 1][i + 1], projected[j + 1][i]];
      quads.push({ pts, depth: pts.reduce((sum, p) => sum + p.depth, 0) / 4, j, i });
    }
  }
  quads.sort((a, b) => a.depth - b.depth);
  ctx.save();
  ctx.lineJoin = "round";
  for (const face of quads) {
    const nearWall = face.j / meshNQ;
    const xValue = face.i / meshNX;
    const criticalGlow = Math.exp(-Math.pow((nearWall - .88) * 6, 2));
    const light = Math.round(19 + nearWall * 19 + criticalGlow * 12 + xValue * 7);
    const red = Math.round(14 + nearWall * 46 + criticalGlow * 29);
    const green = Math.round(83 + light + criticalGlow * 13);
    const blue = Math.round(105 + light * .75 - nearWall * 34);
    ctx.fillStyle = "rgba(" + red + "," + green + "," + blue + ",.89)";
    chamberPath(ctx, face.pts); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = criticalGlow > .6 ? "rgba(240,199,139,.16)" : "rgba(133,219,223,.11)";
    ctx.lineWidth = .65; ctx.stroke();
  }
  ctx.restore();

  // Translucent critical wall q = 1 and its exact saddle-node endpoint.
  const wallBase = [P(chamberX0, 1, reducedHeight(chamberX0, 1)),
    P(chamberX1, 1, reducedHeight(chamberX1, 1))];
  line(ctx, [[wallBase[0].x, wallBase[0].y], [wallBase[1].x, wallBase[1].y]],
    "rgba(250,222,167,.66)", 1.5, [6, 5]);
  const wallPoint = P(1, 1, 0);
  ctx.save(); ctx.shadowColor = "#ffe4b0"; ctx.shadowBlur = 24;
  dot(ctx, wallPoint.x, wallPoint.y, "#f7ddb2", 4.5, false); ctx.restore();
  label(ctx, "Critical fold", wallPoint.x + 13, wallPoint.y - 23, "#e9cf9e", w < 500 ? 8 : 10);
  label(ctx, "a / ac = 1", wallPoint.x + 13, wallPoint.y - 9, "#a7aebb", w < 500 ? 8 : 9);

  // Stationary branches: the blue stable solution and warm-orange barrier
  // merge exactly at the fold. They are evaluated from dU/dσ = 0.
  for (const kind of ["min", "barrier"]) {
    const raw = stationaryBranches.map(s => P(s[kind].x, s.q, s[kind].z));
    ctx.save();
    ctx.shadowColor = kind === "min" ? "#8af4e1" : "#f6a46d";
    ctx.shadowBlur = 15;
    line(ctx, raw.map(p => [p.x, p.y]), kind === "min" ? "#9cece0" : "#f4b182", w < 500 ? 2 : 2.9);
    ctx.restore();
  }

  // The gold slice is synchronized with the paper's 2D plot and both sliders.
  const cross = [];
  for (let i = 0; i <= 110; i++) {
    const x = chamberX0 + (chamberX1 - chamberX0) * i / 110;
    const p = P(x, tensionRatio, reducedHeight(x, tensionRatio));
    cross.push([p.x, p.y]);
  }
  ctx.save();
  ctx.shadowColor = tensionRatio > 1 ? "#f4a4a7" : "#f8d7a0";
  ctx.shadowBlur = 20;
  line(ctx, cross, tensionRatio > 1 ? "#f0a2a7" : "#ffe0a0", 3.5);
  ctx.restore();

  const roots = stationaryPoints(tensionRatio);
  if (tensionRatio < .999999 && roots.length === 2) {
    const rootMin = P(roots[0], tensionRatio, reducedHeight(roots[0], tensionRatio));
    const rootMax = P(roots[1], tensionRatio, reducedHeight(roots[1], tensionRatio));
    dot(ctx, rootMin.x, rootMin.y, "#a9fff0", 6.5);
    dot(ctx, rootMax.x, rootMax.y, "#ffb789", 6.5);
    if (Math.abs(rootMin.x - rootMax.x) > 50 || Math.abs(rootMin.y - rootMax.y) > 50) {
      label(ctx, "MINIMUM", rootMin.x - 7, rootMin.y + 24, "#b5f0df", 9, "right");
      label(ctx, "BARRIER", rootMax.x + 11, rootMax.y - 15, "#ffd1a2", 9);
    }
  } else if (Math.abs(tensionRatio - 1) <= .0005) {
    const pulse = chamberMotionReduced ? 11 : 12 + 5 * Math.sin(now / 350);
    ctx.save(); ctx.beginPath(); ctx.arc(wallPoint.x, wallPoint.y, pulse, 0, TAU);
    ctx.strokeStyle = "rgba(255,237,194,.7)"; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.beginPath(); ctx.arc(wallPoint.x, wallPoint.y, pulse * 1.8, 0, TAU);
    ctx.strokeStyle = "rgba(255,237,194,.24)"; ctx.stroke(); ctx.restore();
  }

  // Cartesian projection ticks and axes — labels explicitly identify parameter
  // coordinates; screen depth/perspective is purely a presentation device.
  const o = P(chamberX0, chamberQ0, -.0055);
  const xo = P(chamberX1, chamberQ0, -.0055);
  const qo = P(chamberX0, chamberQ1, -.0055);
  const zo = P(chamberX0, chamberQ0, .013);
  line(ctx, [[o.x, o.y], [xo.x, xo.y]], "rgba(222,221,203,.43)", 1.1);
  line(ctx, [[o.x, o.y], [qo.x, qo.y]], "rgba(222,221,203,.43)", 1.1);
  line(ctx, [[o.x, o.y], [zo.x, zo.y]], "rgba(222,221,203,.28)", 1);
  label(ctx, "σ / σc", xo.x + 8, xo.y + 6, "#d2c6ab", 11);
  label(ctx, "a / ac", qo.x + 7, qo.y + 7, "#d2c6ab", 11);
  label(ctx, "reduced U", zo.x + 5, zo.y - 7, "#8cabbc", 10);

  // Horizon register and camera status.
  label(ctx, "Potential surface", 25, h - 102, "#7293a8", w < 500 ? 7 : 9);
  const phase = tensionRatio > 1.0005 ? "No stable pair" : tensionRatio >= .9995 ? "FOLD" : "Metastable pair";
  label(ctx, phase, w - 25, h - 102,
    tensionRatio > 1.0005 ? "#f4a3a9" : "#e2c796", w < 500 ? 8 : 10, "right");
}

function updateChamberFromTension(q, roots) {
  if (!chamberSlider) return;
  chamberSlider.value = String(q);
  $("chamberQ").textContent = q.toFixed(3);
  $("heroCriticality").textContent = q.toFixed(3) + " a/ac";
  $("chamberJourneyProgress").style.width = ((q - .3) / .78 * 100).toFixed(1) + "%";
  const hero = $("heroCriticality").parentElement;
  const state = $("chamberState");
  const heroState = $("heroCriticalityState");
  let phase, headline, narrative;
  if (q > 1.0005) {
    phase = 4; headline = "Minimum gone";
    narrative = "Across the exact stability wall, the nearby minimum–barrier pair no longer exists. This one-volume model has lost its metastable Kähler valley.";
    state.className = "tower-state state-lost";
    hero.className = "hero-live-readout lost";
    heroState.textContent = "No stable pair";
  } else if (q >= .9995) {
    phase = 3; headline = "At the wall";
    narrative = "Minimum and barrier meet at σc. At this saddle-node fold the first and second volume derivatives both vanish: Uσ = Uσσ = 0.";
    state.className = "tower-state state-critical";
    hero.className = "hero-live-readout critical";
    heroState.textContent = "Critical fold";
  } else if (q >= .88) {
    phase = 2; headline = "Barrier thinning";
    narrative = "The two stationary solutions close in. The canonical field separation and the potential barrier shrink toward zero as uplift approaches its critical value.";
    state.className = "tower-state";
    hero.className = "hero-live-readout";
    heroState.textContent = "Barrier thinning";
  } else {
    phase = 1; headline = "Minimum present";
    narrative = "A locally stable lower-volume minimum is protected by a higher-volume decompactification barrier. Increase the uplift to see both branches converge.";
    state.className = "tower-state";
    hero.className = "hero-live-readout";
    heroState.textContent = "Metastable minimum";
  }
  $("chamberStateNo").textContent = "0" + phase + " / 04";
  state.textContent = headline;
  $("chamberNarrative").textContent = narrative;
  if (q < 1 && roots.length === 2) {
    const separation = Math.sqrt(3 / 2) * Math.log(roots[1] / roots[0]);
    const barrier = U(roots[1] * BENCH.sigmaC, q * BENCH.aC)
      - U(roots[0] * BENCH.sigmaC, q * BENCH.aC);
    $("chamberSeparation").textContent = separation.toFixed(5) + " Mₚ";
    $("chamberBarrier").textContent = sci(Math.max(0, barrier), 2);
    $("chamberCurvature").textContent = "POSITIVE (+)";
  } else if (q <= 1.0005) {
    $("chamberSeparation").textContent = "0";
    $("chamberBarrier").textContent = "0";
    $("chamberCurvature").textContent = "ZERO (0)";
  } else {
    $("chamberSeparation").textContent = "No pair";
    $("chamberBarrier").textContent = "No barrier";
    $("chamberCurvature").textContent = "No minimum";
  }
  if (lastChamberQ < 1 && q >= 1 && !chamberMotionReduced) {
    const flash = $("wallFlash");
    flash.classList.add("flash");
    window.setTimeout(() => flash.classList.remove("flash"), 480);
  }
  lastChamberQ = q;
  drawChamber();
}

function stopChamberPlayback(preservePosition = false) {
  if (chamberPlaying && preservePosition) chamberPausedElapsed = performance.now() - chamberStart;
  else if (!preservePosition) chamberPausedElapsed = 0;
  chamberPlaying = false;
  chamberPlaybackEpoch++;
  $("chamberPlayIcon").textContent = "▶";
  $("chamberPlayText").textContent = chamberPausedElapsed > 0 ? "Resume the sweep" : "Sweep through the wall";
  chamberPlay.setAttribute("aria-pressed", "false");
}
function smoothChamber(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}
function chamberSequence(ms) {
  // An intentionally staged *parameter sweep* with a hold at the exact fold.
  // No physical cosmological time is represented by these milliseconds.
  if (ms < 3300) return .55 + .35 * smoothChamber(ms / 3300);
  if (ms < 6200) return .90 + .095 * smoothChamber((ms - 3300) / 2900);
  if (ms < 8100) return .995 + .005 * smoothChamber((ms - 6200) / 1900);
  if (ms < 9650) return 1;
  return 1 + .07 * smoothChamber((ms - 9650) / 2800);
}
function playChamberFrame(now, epoch) {
  if (!chamberPlaying || epoch !== chamberPlaybackEpoch) return;
  const elapsed = now - chamberStart;
  if (elapsed > 12450) {
    setPotential(1.07);
    stopChamberPlayback();
    return;
  }
  setPotential(chamberSequence(elapsed));
  requestAnimationFrame(next => playChamberFrame(next, epoch));
}
chamberPlay.addEventListener("click", () => {
  if (chamberPlaying) { stopChamberPlayback(true); return; }
  chamberPlaying = true;
  $("chamberPlayIcon").textContent = "Ⅱ";
  $("chamberPlayText").textContent = "Pause the sweep";
  chamberPlay.setAttribute("aria-pressed", "true");
  if (chamberPausedElapsed === 0) setPotential(.55);
  chamberStart = performance.now() - chamberPausedElapsed;
  chamberPausedElapsed = 0;
  const epoch = ++chamberPlaybackEpoch;
  requestAnimationFrame(now => playChamberFrame(now, epoch));
});
$("chamberRestart").addEventListener("click", () => {
  stopChamberPlayback();
  setPotential(.55);
});
chamberSlider.addEventListener("input", () => {
  stopChamberPlayback();
  setPotential(chamberSlider.value);
});
tension.addEventListener("input", () => stopChamberPlayback());
document.querySelectorAll("[data-tension]").forEach(b => b.addEventListener("click", () => stopChamberPlayback()));

manifoldCanvas.addEventListener("pointerdown", e => {
  chamberDragging = { x: e.clientX, y: e.clientY };
  lastInteraction = performance.now();
  manifoldCanvas.setPointerCapture(e.pointerId);
});
manifoldCanvas.addEventListener("pointermove", e => {
  if (!chamberDragging) return;
  const dx = e.clientX - chamberDragging.x;
  const dy = e.clientY - chamberDragging.y;
  cameraYaw += dx * .009;
  cameraPitch = Math.max(.22, Math.min(1.28, cameraPitch - dy * .007));
  chamberDragging = { x: e.clientX, y: e.clientY };
  lastInteraction = performance.now();
  drawChamber();
});
function releaseChamberPointer() { chamberDragging = null; }
manifoldCanvas.addEventListener("pointerup", releaseChamberPointer);
manifoldCanvas.addEventListener("pointercancel", releaseChamberPointer);
manifoldCanvas.addEventListener("lostpointercapture", releaseChamberPointer);
manifoldCanvas.addEventListener("keydown", e => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
  e.preventDefault();
  if (e.key === "ArrowLeft") cameraYaw -= .12;
  if (e.key === "ArrowRight") cameraYaw += .12;
  if (e.key === "ArrowUp") cameraPitch = Math.min(1.28, cameraPitch + .10);
  if (e.key === "ArrowDown") cameraPitch = Math.max(.22, cameraPitch - .10);
  lastInteraction = performance.now();
  drawChamber();
});
$("cameraReset").addEventListener("click", () => {
  cameraYaw = -.77; cameraPitch = .68; lastInteraction = performance.now(); drawChamber();
});
if ("IntersectionObserver" in window) {
  const chamberObserver = new IntersectionObserver(entries => {
    chamberVisible = entries[0].isIntersecting;
  }, { threshold: .06 });
  chamberObserver.observe(manifoldCanvas);
} else chamberVisible = true;
function chamberIdleFrame(now) {
  if (chamberVisible && !chamberMotionReduced && !chamberDragging && now - chamberDrawTime > 60) {
    // Subtle camera breathing is disabled following manual orbit interaction.
    if (now - lastInteraction > 12000 && !chamberPlaying) {
      cameraYaw += .00055;
      drawChamber(now);
    } else if (!chamberPlaying && Math.abs(tensionRatio - 1) < .0005) {
      drawChamber(now);
    }
    chamberDrawTime = now;
  }
  chamberFrame = requestAnimationFrame(chamberIdleFrame);
}
if (!chamberMotionReduced) chamberFrame = requestAnimationFrame(chamberIdleFrame);

tension.addEventListener("input", () => setPotential(tension.value));
document.querySelectorAll("[data-tension]").forEach((b) => b.addEventListener("click", () => setPotential(b.dataset.tension)));
$("flowReset").addEventListener("click", () => { flow = { active: false, x: .91, velocity: 0, last: 0 }; $("flowRun").textContent = "RUN MOTION ▶"; drawPotential(); });
$("flowRun").addEventListener("click", () => {
  flow.active = !flow.active; flow.last = performance.now();
  $("flowRun").textContent = flow.active ? "PAUSE MOTION ‖" : "RUN MOTION ▶";
  if (flow.active) requestAnimationFrame(stepFlow);
});
function stepFlow(now) {
  if (!flow.active) return;
  const dt = Math.min(.035, (now - flow.last) / 1000 || .016); flow.last = now;
  const slope = Math.max(-.3, Math.min(.3, reducedSlope(flow.x, tensionRatio)));
  // Overdamped toy model xdot = -k dU/dx with finite visualization speed.
  const dx = Math.max(-.035, Math.min(.035, -slope * 120 * dt));
  flow.x = Math.max(.551, Math.min(1.629, flow.x + dx));
  if (flow.x <= .552 || flow.x >= 1.628) {
    flow.active = false; $("flowRun").textContent = "RUN MOTION ▶";
  }
  drawPotential();
  if (flow.active) requestAnimationFrame(stepFlow);
}

// Eq. (59): y parametrizes the critical branch across effective theories.
const branchSlider = $("branchSlider");
function branchValues(y) {
  return {
    theta: y * Math.exp(.8 * (1 - y)),
    sigma: Math.exp(BENCH.L + 20 / 9 - 8 / 5 * (1 - y)),
    aC: .9 * BENCH.beta * Math.exp(-5 * BENCH.L / 2 - 14 / 9 - 4 * y) * (1 - y),
    alpha: 2.25 * BENCH.beta * y / Math.sqrt(Math.exp(BENCH.L + 20 / 9 - 8 / 5 * (1 - y))),
    xi: 5 - 4 * y
  };
}
function drawBranch(y) {
  const { ctx, w, h } = canvasSize($("branchCanvas"));
  const p = { left: w < 500 ? 43 : 54, right: 20, top: 32, bottom: 38 };
  const W = w - p.left - p.right, H = h - p.top - p.bottom;
  const X = (v) => p.left + v * W, Y = (v) => p.top + (1 - v) * H;
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i <= 5; i++) {
    const yy = Y(i / 5), xx = X(i / 5);
    line(ctx, [[p.left, yy], [p.left + W, yy]], "#d9d3c7", 1);
    line(ctx, [[xx, p.top], [xx, p.top + H]], "#dfd8ce", 1);
    label(ctx, (i / 5).toFixed(1), p.left - 10, yy + 3, "#7b8790", 9, "right");
    label(ctx, (i / 5).toFixed(1), xx, h - 10, "#7b8790", 9, "center");
  }
  const branch = [], tension = [];
  const aMax = branchValues(.001).aC;
  for (let i = 0; i <= 300; i++) {
    const yy = .001 + i / 300 * .998, values = branchValues(yy);
    branch.push([X(yy), Y(values.theta)]);
    tension.push([X(yy), Y(values.aC / aMax)]);
  }
  line(ctx, branch, "#345f79", 2.5); line(ctx, tension, "#ab5060", 2.5);
  line(ctx, [[X(y), p.top], [X(y), p.top + H]], "#9d9080", 1, [4, 4]);
  const current = branchValues(y);
  dot(ctx, X(y), Y(current.theta), "#345f79", 5);
  dot(ctx, X(y), Y(current.aC / aMax), "#ab5060", 5);
  label(ctx, "θ(y)", X(.10), Y(.77), "#345f79", 11);
  label(ctx, "a₍c₎ / a₍c₎(0)", X(.5), Y(.45), "#ab5060", 10);
  label(ctx, "BRANCH COORDINATE y", p.left + W / 2, h - 1, "#7b8790", 9, "center");
}
function updateBranch() {
  const y = Number(branchSlider.value), b = branchValues(y);
  $("branchY").textContent = y.toFixed(3);
  $("branchTheta").textContent = b.theta.toFixed(3);
  $("branchSigma").textContent = b.sigma.toFixed(1);
  $("branchAc").textContent = b.aC.toExponential(3);
  $("branchXi").textContent = b.xi.toFixed(3);
  drawBranch(y);
}
branchSlider.addEventListener("input", updateBranch);

// Eqs. (87) and (103): coefficient-normalized universal powers.
let mixing = 1;
function scalingValues(mu) {
  return { chi: Math.sqrt(mu), mass: Math.sqrt(mu), barrier: Math.pow(mu, 1.5), schur: mixing * mixing / Math.sqrt(mu) };
}
function drawScaling() {
  const { ctx, w, h } = canvasSize($("scalingCanvas"));
  const p = { left: w < 500 ? 50 : 63, right: 18, top: 25, bottom: 44 };
  const W = w - p.left - p.right, H = h - p.top - p.bottom;
  const X = (logMu) => p.left + (logMu + 8) / 6 * W;
  const Y = (logV) => p.top + (4 - logV) / 16 * H;
  ctx.clearRect(0, 0, w, h);
  for (let x = -8; x <= -2; x++) {
    line(ctx, [[X(x), p.top], [X(x), p.top + H]], "rgba(191,209,222,.10)", 1);
    label(ctx, "10" + superscript(x), X(x), h - 20, "#91a2b0", 9, "center");
  }
  for (let y = -12; y <= 4; y += 4) {
    line(ctx, [[p.left, Y(y)], [p.left + W, Y(y)]], "rgba(191,209,222,.10)", 1);
    label(ctx, "10" + superscript(y), p.left - 11, Y(y) + 3, "#91a2b0", 9, "right");
  }
  label(ctx, "μ / ac  →", p.left + W, h - 4, "#a6b3bf", 10, "right");
  const series = [
    { color: "#72c6d8", value: (mu) => Math.sqrt(mu), dash: [] },
    { color: "#e0c38e", value: (mu) => Math.sqrt(mu), dash: [5, 4] },
    { color: "#eba069", value: (mu) => mu ** 1.5, dash: [] },
    { color: "#da7696", value: (mu) => mixing * mixing / Math.sqrt(mu), dash: [] }
  ];
  series.forEach((s) => {
    if (s.value(.0001) <= 0) return;
    const pts = [];
    for (let i = 0; i <= 250; i++) {
      const lx = -8 + 6 * i / 250, ly = Math.log10(s.value(10 ** lx));
      pts.push([X(lx), Y(ly)]);
    }
    line(ctx, pts, s.color, s.dash.length ? 2 : 2.5, s.dash);
  });
  const lx = Number($("muSlider").value);
  line(ctx, [[X(lx), p.top], [X(lx), p.top + H]], "rgba(245,239,229,.45)", 1, [4, 4]);
  for (const s of series) {
    const val = s.value(10 ** lx);
    if (val > 0) dot(ctx, X(lx), Y(Math.log10(val)), s.color, 4.5);
  }
}
function updateScaling() {
  const l = Number($("muSlider").value), mu = 10 ** l;
  mixing = Number($("mixSlider").value);
  $("muValue").textContent = "10" + superscript(l.toFixed(2).replace(/\.00$/, ""));
  $("mixValue").textContent = Math.round(mixing * 100) + "%";
  const v = scalingValues(mu);
  $("scDist").textContent = v.chi.toExponential(2);
  $("scMass").textContent = v.mass.toExponential(2);
  $("scBarrier").textContent = v.barrier.toExponential(2);
  $("scSchur").textContent = v.schur.toExponential(2);
  drawScaling();
}
$("muSlider").addEventListener("input", updateScaling);
$("mixSlider").addEventListener("input", updateScaling);

// Paper Eq. (19), (148), (149), (151) and Table IV.
const fluxCanvas = $("fluxCanvas");
let fluxSettings = { gs: .2, budget: 320, rhoMin: 7.653, conifold: 46, fit: 1.1 };
let selectedFlux = { M: 16, K: 12 };
const fluxClasses = ["tadpole", "conifold", "warping", "bulk volume", "passes displayed necessary filters"];
const fluxColors = ["#dce3e9", "#8c93b8", "#c96572", "#c9a369", "#188b78"];
let fluxCounts = [0, 0, 0, 0, 0];
let latticeGeometry = {};
function classFlux(M, K) {
  const s = fluxSettings, rho = 2 * Math.PI * K / (3 * s.gs * M);
  if (M * K > s.budget) return 0;
  if (s.gs * M * M < s.conifold || s.gs * M <= 1) return 1;
  if (rho <= s.rhoMin) return 2;
  if (BENCH.sigmaC ** 1.5 < s.fit * M * K) return 3;
  return 4;
}
function scanFlux() {
  fluxCounts = [0, 0, 0, 0, 0];
  for (let M = 1; M <= 80; M++) for (let K = 1; K <= 80; K++) fluxCounts[classFlux(M, K)]++;
  $("survivorCount").textContent = comma(fluxCounts[4]);
  ["Tadpole", "Conifold", "Warp", "Bulk", "Allowed"].forEach((name, i) => $("count" + name).textContent = comma(fluxCounts[i]));
  drawFlux();
  showFluxPoint();
}
function drawFlux() {
  const { ctx, w, h } = canvasSize(fluxCanvas);
  const pad = { left: 49, right: 15, top: 16, bottom: 46 };
  const s = Math.floor(Math.min((w - pad.left - pad.right) / 80, (h - pad.top - pad.bottom) / 80) * 100) / 100;
  const W = s * 80, H = s * 80, left = pad.left + (w - pad.left - pad.right - W) / 2, top = pad.top + (h - pad.top - pad.bottom - H) / 2;
  latticeGeometry = { left, top, cell: s, W, H };
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#faf6ee"; ctx.fillRect(0, 0, w, h);
  for (let M = 1; M <= 80; M++) for (let K = 1; K <= 80; K++) {
    ctx.fillStyle = fluxColors[classFlux(M, K)];
    ctx.fillRect(left + (M - 1) * s + .1, top + (80 - K) * s + .1, Math.max(.9, s - .3), Math.max(.9, s - .3));
  }
  // Exact continuous tadpole and warping boundaries.
  const tad = [], warp = [];
  for (let m = 1; m <= 80; m += .25) {
    const kBudget = fluxSettings.budget / m;
    const kWarp = m * 3 * fluxSettings.gs * fluxSettings.rhoMin / (2 * Math.PI);
    if (kBudget >= 1 && kBudget <= 80) tad.push([left + (m - .5) * s, top + (80.5 - kBudget) * s]);
    if (kWarp >= 1 && kWarp <= 80) warp.push([left + (m - .5) * s, top + (80.5 - kWarp) * s]);
  }
  line(ctx, tad, "#1d2a3a", 1.8);
  line(ctx, warp, "#ad3349", 2, [7, 4]);
  for (let n = 10; n <= 80; n += 10) {
    label(ctx, String(n), left + (n - .5) * s, top + H + 17, "#566574", 10, "center");
    label(ctx, String(n), left - 9, top + (80.5 - n) * s + 3, "#566574", 10, "right");
  }
  label(ctx, "RR FLUX QUANTUM M", left + W / 2, h - 4, "#526372", 10, "center");
  label(ctx, "K ↑", left - 36, top + 3, "#526372", 10);
  const x = left + (selectedFlux.M - .5) * s, y = top + (80.5 - selectedFlux.K) * s;
  ctx.save(); ctx.strokeStyle = "#2b2924"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, Math.max(7, s * 1.3), 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, Math.max(3, s * .4), 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); ctx.restore();
}
function showFluxPoint() {
  const { M, K } = selectedFlux;
  const rho = 2 * Math.PI * K / (3 * fluxSettings.gs * M);
  const outcome = fluxClasses[classFlux(M, K)];
  $("fluxPointText").textContent = "SELECTED (M, K) = (" + M + ", " + K + ") · ρ = " + rho.toFixed(3) + " · KM = " + (M * K) + " · " + outcome;
}
function updateFlux() {
  fluxSettings = {
    gs: Number($("gsSlider").value), budget: Number($("budgetSlider").value),
    rhoMin: Number($("rhoSlider").value), conifold: Number($("cfSlider").value), fit: 1.1
  };
  $("gsValue").textContent = fluxSettings.gs.toFixed(2);
  $("budgetValue").textContent = String(fluxSettings.budget);
  $("rhoValue").textContent = fluxSettings.rhoMin.toFixed(3);
  $("cfValue").textContent = String(fluxSettings.conifold);
  scanFlux();
}
["gsSlider", "budgetSlider", "rhoSlider", "cfSlider"].forEach((id) => $(id).addEventListener("input", updateFlux));
$("fluxDefaults").addEventListener("click", () => {
  $("gsSlider").value = ".2"; $("budgetSlider").value = "320";
  $("rhoSlider").value = "7.653"; $("cfSlider").value = "46";
  selectedFlux = { M: 16, K: 12 }; updateFlux();
});
$("fluxReset").addEventListener("click", () => { selectedFlux = { M: 16, K: 12 }; drawFlux(); showFluxPoint(); });
function selectFluxAtEvent(event) {
  const rect = fluxCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left, y = event.clientY - rect.top;
  const g = latticeGeometry;
  if (x < g.left || x >= g.left + g.W || y < g.top || y >= g.top + g.H) return;
  const M = Math.floor((x - g.left) / g.cell) + 1;
  const K = 80 - Math.floor((y - g.top) / g.cell);
  selectedFlux = { M, K }; drawFlux(); showFluxPoint();
}
fluxCanvas.addEventListener("click", selectFluxAtEvent);
fluxCanvas.addEventListener("mousemove", (e) => {
  const r = fluxCanvas.getBoundingClientRect(), g = latticeGeometry, x = e.clientX - r.left, y = e.clientY - r.top;
  fluxCanvas.style.cursor = x >= g.left && x < g.left + g.W && y >= g.top && y < g.top + g.H ? "crosshair" : "default";
});

// Visual progress / navigation; all content remains in static HTML for indexing.
const anchors = [...document.querySelectorAll(".desktop-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
function updateScroll() {
  const range = document.documentElement.scrollHeight - innerHeight;
  $("readProgress").style.width = (range > 0 ? Math.min(100, scrollY / range * 100) : 0) + "%";
  let current = "";
  for (const section of sections) if (section.getBoundingClientRect().top < innerHeight * .35) current = section.id;
  anchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", updateScroll, { passive: true });
const menu = $("menuToggle"), mobile = $("mobileNav");
menu.addEventListener("click", () => {
  const open = mobile.hidden;
  mobile.hidden = !open; menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { mobile.hidden = true; menu.setAttribute("aria-expanded", "false"); }));

// Scientific references and reserved publication destination.
if (JOURNAL_PUBLICATION_URL.trim()) {
  const link = $("journalLink");
  link.href = JOURNAL_PUBLICATION_URL.trim(); link.setAttribute("aria-disabled", "false"); link.removeAttribute("tabindex");
  link.setAttribute("target", "_blank"); link.setAttribute("rel", "noopener noreferrer");
  link.textContent = "READ JOURNAL VERSION ↗";
  link.classList.remove("btn-future"); link.classList.add("btn-outline");
  document.querySelector(".future-note").textContent = "Journal publication link provided by the author.";
}
const bib = "@article{Singh2026KahlerWall,\n"
  + "  author = {Swapnil Kumar Singh},\n"
  + "  title = {The Kähler Stability Wall in Perturbative Brane--Antibrane Inflation},\n"
  + "  journal = {arXiv preprint arXiv:2611.08491},\n"
  + "  year = {2026},\n"
  + "  eprint = {2611.08491},\n"
  + "  archivePrefix = {arXiv},\n"
  + "  primaryClass = {hep-th},\n"
  + "  doi = {10.48550/arXiv.2611.08491}\n"
  + "}";
$("copyBib").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(bib);
    $("copyFeedback").textContent = "BibTeX copied.";
  } catch (_) {
    $("copyFeedback").textContent = "Copy unavailable in this browser. Use the arXiv citation tools.";
  }
});

// Quiet, reduced-motion-aware starfield.
const heroCanvas = $("heroCanvas"), starSeed = [];
let seed = 261108491;
const rand = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
for (let i = 0; i < 135; i++) starSeed.push({ x: rand(), y: rand(), r: .3 + rand() * 1.2, a: .1 + rand() * .45, phase: rand() * TAU });
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function drawStars(t) {
  const { ctx, w, h } = canvasSize(heroCanvas);
  ctx.clearRect(0, 0, w, h);
  for (const s of starSeed) {
    const alpha = s.a * (reduceMotion ? 1 : (.76 + .24 * Math.sin(t / 2200 + s.phase)));
    ctx.beginPath(); ctx.fillStyle = "rgba(221,225,222," + alpha.toFixed(3) + ")";
    ctx.arc(s.x * w, s.y * h, s.r, 0, TAU); ctx.fill();
  }
}
let lastStarFrame = 0;
function starLoop(t) {
  if (t - lastStarFrame > 60) { drawStars(t); lastStarFrame = t; }
  requestAnimationFrame(starLoop);
}
if (!reduceMotion) requestAnimationFrame(starLoop);
else drawStars(0);

function redrawAll() { drawPotential(); drawChamber(); drawBranch(Number(branchSlider.value)); drawScaling(); drawFlux(); }
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { redrawAll(); if (reduceMotion) drawStars(0); }, 110);
});
setPotential(tensionRatio);
updateBranch();
updateScaling();
updateFlux();
updateScroll();
