/* The Observatory — a two-path, keyboard-accessible entrance. */
(() => {
  "use strict";
  const stage = document.getElementById("blackhole-entry");
  const enter = document.getElementById("blackhole-enter");
  const panel = document.getElementById("portalChoices");
  const back = document.getElementById("portalReturn");
  if (!stage || !enter || !panel || !back) return;

  const destinations = [...panel.querySelectorAll(".choice-card")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let phase = "rest";
  let transitionTimer = 0;

  function showChoices() {
    phase = "choices";
    stage.dataset.phase = phase;
    panel.setAttribute("aria-hidden", "false");
    enter.setAttribute("aria-expanded", "true");
    destinations.forEach(link => link.tabIndex = 0);
    back.focus({ preventScroll: true });
  }

  function begin() {
    if (phase !== "rest") return;
    phase = "transition";
    stage.dataset.phase = phase;
    enter.disabled = true;
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(showChoices, reduced ? 20 : 1120);
  }

  function returnToHorizon() {
    window.clearTimeout(transitionTimer);
    phase = "rest";
    stage.dataset.phase = phase;
    panel.setAttribute("aria-hidden", "true");
    enter.setAttribute("aria-expanded", "false");
    enter.disabled = false;
    destinations.forEach(link => link.tabIndex = -1);
    enter.focus({ preventScroll: true });
  }

  enter.addEventListener("click", begin);
  back.addEventListener("click", returnToHorizon);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && phase === "choices") {
      event.preventDefault();
      returnToHorizon();
    }
  });
  stage.dataset.phase = "rest";
})();
