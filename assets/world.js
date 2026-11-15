/* Research Atlas — progressive disclosure keeps the project map approachable. */
(() => {
  "use strict";
  const groups = [...document.querySelectorAll(".field-group")];
  function setOpen(group, open) {
    const button = group.querySelector(".field-toggle");
    const panel = group.querySelector(".field-panel");
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    group.classList.toggle("is-open", open);
  }
  for (const group of groups) {
    const button = group.querySelector(".field-toggle");
    button?.addEventListener("click", () => {
      const next = button.getAttribute("aria-expanded") !== "true";
      groups.forEach(item => setOpen(item, item === group && next));
    });
  }
  const field = new URLSearchParams(location.search).get("field");
  if (field) {
    const matching = groups.find(group => group.dataset.field === field);
    if (matching) setOpen(matching, true);
  }
})();
