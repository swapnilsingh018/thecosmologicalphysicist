/* The navigation island and a ten-study archive, without a frontend framework. */
(() => {
  'use strict';
  const header = document.querySelector('.research-header');
  const nav = document.getElementById('research-nav');
  const menu = document.querySelector('[data-menu-toggle]');
  const filterButtons = [...document.querySelectorAll('[data-field-filter]')];
  const researchRows = [...document.querySelectorAll('.research-row[data-field]')];
  const count = document.getElementById('researchCount');
  const accepted = new Set(['all', 'theory', 'astro', 'engineering']);
  let selected = 'all';

  function closeMenu() {
    nav?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
  }

  menu?.addEventListener('click', () => {
    if (!nav) return;
    const open = nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (nav && menu && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });

  const syncHeader = () => header?.classList.toggle('is-scrolled', scrollY > 26);
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  function filter(field) {
    selected = accepted.has(field) ? field : 'all';
    let visible = 0;
    researchRows.forEach(row => {
      const show = selected === 'all' || row.dataset.field === selected;
      row.hidden = !show;
      if (show) visible++;
    });
    filterButtons.forEach(button => {
      const active = button.dataset.fieldFilter === selected;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (count) {
      const it = document.documentElement.lang === 'it';
      const areas = it
        ? { all: 'studi selezionati', theory: 'studi di teoria', astro: 'studi di astrofisica', engineering: 'studi di ingegneria' }
        : { all: 'selected studies', theory: 'theory studies', astro: 'astrophysics studies', engineering: 'engineering studies' };
      count.textContent = `${visible} ${areas[selected]}`;
    }
  }
  filterButtons.forEach(button => button.addEventListener('click', () => filter(button.dataset.fieldFilter)));
  document.addEventListener('sks:languagechange', () => filter(selected));
  filter(selected);

  const sections = [...document.querySelectorAll('main section[id], main#main')];
  if ('IntersectionObserver' in window && nav) {
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target.id === 'main' ? '#main' : `#${entry.target.id}`;
        nav.querySelectorAll('a[href^="#"]').forEach(link => {
          if (link.getAttribute('href') === target) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-20% 0px -65% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const revealTargets = [...document.querySelectorAll('.research-section-head, .research-feature-image, .research-feature-detail, .research-row, .research-practice-grid article')];
    revealTargets.forEach(node => node.dataset.reveal = '');
    document.body.classList.add('has-motion');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .05, rootMargin: '0px 0px -25px 0px' });
    revealTargets.forEach(node => revealObserver.observe(node));
  }
})();
