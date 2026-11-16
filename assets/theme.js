/* A small, site-wide preference: no framework, remote state, or external service. */
(() => {
  "use strict";
  const root = document.documentElement;
  const key = "sks-appearance";
  const valid = value => value === "light" || value === "dark";

  let stored = null;
  try { stored = localStorage.getItem(key); } catch (_) { /* Private browsing is fine. */ }
  let theme = valid(stored) ? stored : "dark";

  function apply(value) {
    theme = value;
    root.dataset.theme = value;
    root.style.colorScheme = value;
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.content = value === "light" ? "#ebe6da" : "#060c09";
    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      const next = value === "dark" ? "light" : "dark";
      const italian = root.lang === "it";
      const action = italian ? `Passa al tema ${next === "light" ? "chiaro" : "scuro"}` : `Switch to ${next} mode`;
      button.setAttribute("aria-label", action);
      button.setAttribute("title", action);
      button.setAttribute("aria-pressed", String(value === "light"));
      const label = button.querySelector(".theme-word");
      const symbol = button.querySelector(".theme-symbol");
      if (label) label.textContent = italian ? (next === "light" ? "Chiaro" : "Scuro") : (next === "light" ? "Light" : "Dark");
      if (symbol) symbol.textContent = next === "light" ? "☼" : "☾";
    });
  }

  // Executed in the head so the first painted frame uses the selected palette.
  apply(theme);

  const initializeButtons = () => {
    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      button.addEventListener("click", () => {
        const next = theme === "dark" ? "light" : "dark";
        apply(next);
        try { localStorage.setItem(key, next); } catch (_) { /* Still works for this visit. */ }
      });
    });
    apply(theme);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeButtons, { once: true });
  } else initializeButtons();

  window.addEventListener("storage", event => {
    if (event.key === key && valid(event.newValue)) apply(event.newValue);
  });
  document.addEventListener("sks:languagechange", () => apply(theme));
})();
