/* Purposeful motion and project discovery, without a rendering framework. */
(() => {
  "use strict";

  const rows = [...document.querySelectorAll("[data-project-row]")];
  const filters = [...document.querySelectorAll("[data-project-filter]")];
  const count = document.getElementById("projectCount");
  const accepted = new Set(["all", "theory", "observation", "engineering"]);

  if (rows.length && filters.length) {
    function showField(field, updateURL = false) {
      const chosen = accepted.has(field) ? field : "all";
      let visible = 0;
      rows.forEach(row => {
        const matches = chosen === "all" || row.dataset.field === chosen;
        row.hidden = !matches;
        if (matches) visible++;
      });
      filters.forEach(button => {
        const selected = button.dataset.projectFilter === chosen;
        button.setAttribute("aria-pressed", String(selected));
        button.classList.toggle("is-active", selected);
      });
      if (count) {
        const it = document.documentElement.lang === 'it';
        const labels = it
          ? { all: 'tutti', theory: 'cosmologia e teoria', observation: 'astrofisica', engineering: 'ingegneria' }
          : { all: 'all', theory: 'cosmology and theory', observation: 'astrophysics', engineering: 'engineering' };
        count.textContent = it
          ? chosen === 'all' ? `Mostrati tutti i ${visible} studi` : `Mostrati ${visible} studi di ${labels[chosen]}`
          : chosen === 'all' ? `Showing all ${visible} studies` : `Showing ${visible} studies in ${labels[chosen]}`;
      }
      if (updateURL) {
        const url = new URL(location.href);
        if (chosen === "all") url.searchParams.delete("field");
        else url.searchParams.set("field", chosen);
        history.replaceState(null, "", url.pathname + url.search + url.hash);
      }
    }
    filters.forEach(button => button.addEventListener("click", () => showField(button.dataset.projectFilter, true)));
    document.addEventListener('sks:languagechange', () => showField(new URLSearchParams(location.search).get('field') || 'all'));
    showField(new URLSearchParams(location.search).get("field") || "all");
  }

  const items = [...document.querySelectorAll("[data-reveal]")];
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (items.length && "IntersectionObserver" in window && !reducedMotion) {
    document.body.classList.add("has-reveals");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: "0px 0px -30px 0px" });
    items.forEach(item => observer.observe(item));
  }
})();
