/* Independent research portfolio — interface and Eq. (7) potential preview. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector(".menu");
  const nav = $("nav");
  const progress = $("scrollProgress");
  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  function onScroll() {
    header?.classList.toggle("compact", window.scrollY > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0).toFixed(2) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  }));

  const sigmaC = 460.6194988;
  const ac = 1.3460268e-7;
  const alpha = .03343948486;
  const L = 5;
  const beta = 1;
  const U = (sigma, a) => a / (sigma * sigma) + alpha / Math.pow(sigma, 4)
    - beta * (Math.log(sigma) - L) / Math.pow(sigma, 4.5);
  const F = (sigma, a) => beta * (4.5 * (Math.log(sigma) - L) - 1)
    - 4 * alpha * Math.sqrt(sigma) - 2 * a * Math.pow(sigma, 2.5);
  const uc = U(sigmaC, ac);
  const normalizer = beta * Math.exp(-9 * L / 2);
  const z = (x, q) => (U(sigmaC * x, ac * q) - uc) / normalizer;
  const roots = q => {
    if (q >= 1) return q === 1 ? [1, 1] : [];
    const result = [], lo = .38, hi = 2.4, a = ac * q, n = 650;
    let x0 = lo, f0 = F(x0 * sigmaC, a);
    for (let i = 1; i <= n; i++) {
      const x1 = lo + (hi - lo) * i / n;
      const f1 = F(x1 * sigmaC, a);
      if (f0 * f1 < 0) {
        let left = x0, right = x1, fl = f0;
        for (let k = 0; k < 40; k++) {
          const mid = (left + right) / 2, fm = F(mid * sigmaC, a);
          if (fl * fm <= 0) right = mid;
          else { left = mid; fl = fm; }
        }
        result.push((left + right) / 2);
      }
      x0 = x1; f0 = f1;
    }
    return result;
  };

  const canvas = $("featureCanvas");
  const slider = $("featureSlider");
  function drawPotential() {
    if (!canvas || !slider) return;
    const bounds = canvas.getBoundingClientRect();
    const w = Math.max(100, bounds.width), h = Math.max(140, bounds.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const q = Number(slider.value);
    const p = { l: w < 420 ? 42 : 60, r: 16, t: 34, b: 45 };
    const W = w - p.l - p.r, H = h - p.t - p.b;
    const xmin = .55, xmax = 1.65;
    const ymin = q > .9 ? -.0014 : -.0058;
    const ymax = q > .9 ? .012 : .014;
    const X = x => p.l + (x - xmin) / (xmax - xmin) * W;
    const Y = y => p.t + (ymax - y) / (ymax - ymin) * H;
    const txt = (str, x, y, color, size = 10, align = "left") => {
      ctx.fillStyle = color; ctx.textAlign = align;
      ctx.font = size + "px DM Mono, monospace"; ctx.fillText(str, x, y);
    };
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i <= 5; i++) {
      const px = p.l + i * W / 5, py = p.t + i * H / 5;
      ctx.strokeStyle = "rgba(171,198,207,.10)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, p.t); ctx.lineTo(px, p.t + H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p.l, py); ctx.lineTo(p.l + W, py); ctx.stroke();
      txt((xmin + i / 5 * (xmax - xmin)).toFixed(2), px, h - 18, "#8098a7", 9, "center");
    }
    ctx.save(); ctx.setLineDash([4, 6]); ctx.strokeStyle = "rgba(230,200,145,.44)";
    ctx.beginPath(); ctx.moveTo(X(1), p.t); ctx.lineTo(X(1), p.t + H); ctx.stroke(); ctx.restore();
    const curve = [];
    for (let i = 0; i <= 360; i++) {
      const x = xmin + i / 360 * (xmax - xmin);
      curve.push([X(x), Y(z(x, q))]);
    }
    ctx.save();
    ctx.beginPath(); ctx.rect(p.l, p.t, W, H); ctx.clip();
    ctx.beginPath(); ctx.moveTo(curve[0][0], curve[0][1]);
    for (let i = 1; i < curve.length; i++) ctx.lineTo(curve[i][0], curve[i][1]);
    ctx.lineTo(p.l + W, p.t + H); ctx.lineTo(p.l, p.t + H); ctx.closePath();
    const gradient = ctx.createLinearGradient(0, p.t, 0, p.t + H);
    gradient.addColorStop(0, "rgba(209,179,119,.16)"); gradient.addColorStop(1, "rgba(209,179,119,0)");
    ctx.fillStyle = gradient; ctx.fill();
    ctx.beginPath(); ctx.moveTo(curve[0][0], curve[0][1]);
    for (let i = 1; i < curve.length; i++) ctx.lineTo(curve[i][0], curve[i][1]);
    ctx.strokeStyle = q > 1.0005 ? "#dda4a1" : "#edcb8e";
    ctx.lineWidth = 2.4; ctx.shadowColor = "#e8bd7e"; ctx.shadowBlur = 9; ctx.stroke(); ctx.shadowBlur = 0;
    const rr = roots(q);
    if (q < 1 && rr.length === 2) {
      for (let k = 0; k < 2; k++) {
        const x = X(rr[k]), y = Y(z(rr[k], q));
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = k === 0 ? "#93dfd0" : "#f1b27f";
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 16; ctx.fill();
        ctx.shadowBlur = 0;
      }
    } else if (Math.abs(q - 1) <= .0005) {
      ctx.beginPath(); ctx.arc(X(1), Y(0), 6, 0, Math.PI * 2);
      ctx.fillStyle = "#fff0c7"; ctx.fill();
    }
    ctx.restore();
    txt("REDUCED U", p.l, 18, "#8ea9b5", 9);
    txt("σ / σc", w - 11, h - 7, "#a2b9c0", 10, "right");
    txt("FOLD", X(1) + 8, p.t + 13, "#c8ad82", 9);
    $("featureQ").textContent = q.toFixed(3);
    const state = $("featureState");
    if (state) {
      state.textContent = q > 1.0005 ? "VALLEY LOST" : q >= .9995 ? "AT THE FOLD" : "METASTABLE";
      state.style.color = q > 1.0005 ? "#e8a5a8" : "#d3b987";
    }
  }
  slider?.addEventListener("input", drawPotential);
  window.addEventListener("resize", () => window.requestAnimationFrame(drawPotential), { passive: true });
  drawPotential();

  const form = $("contactForm");
  const status = $("contactStatus");
  form?.addEventListener("submit", async event => {
    event.preventDefault();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    status.classList.remove("error");
    status.textContent = "Sending…";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) throw Error("Delivery failed");
      form.reset();
      status.textContent = "Thank you. Your message has been sent.";
    } catch (_) {
      status.classList.add("error");
      status.textContent = "This message could not be sent. Please use the email link.";
    } finally {
      button.disabled = false;
    }
  });
})();
