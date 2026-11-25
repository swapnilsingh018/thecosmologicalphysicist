/* Live citation counts from INSPIRE-HEP (public API, CORS-enabled).
   Fills [data-cites] next to each paper and the [data-inspire-stats] summary line.
   If the request fails, everything stays hidden: no stale or invented numbers. */
(() => {
  'use strict';
  const targets = document.querySelectorAll('[data-cites], [data-inspire-stats]');
  if (!targets.length) return;

  const AUTHOR = '2052015';
  const KEY = 'inspire-v1';
  const url = 'https://inspirehep.net/api/literature?size=100&q=' +
    encodeURIComponent(`authors.record.$ref:${AUTHOR}`) + '&fields=' +
    encodeURIComponent('citation_count,arxiv_eprints,dois');

  const fromCache = () => {
    try {
      const c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      return c && Date.now() - c.t < 6 * 3600e3 ? c.d : null;
    } catch { return null; }
  };
  const toCache = d => { try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d })); } catch {} };

  const load = () => {
    const cached = fromCache();
    if (cached) return Promise.resolve(cached);
    return fetch(url, { credentials: 'omit' })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(j => {
        const d = { total: j.hits.total, sum: 0, by: {} };
        for (const h of j.hits.hits) {
          const m = h.metadata, n = m.citation_count || 0;
          d.sum += n;
          for (const a of m.arxiv_eprints || []) d.by[a.value] = n;
          for (const x of m.dois || []) d.by[x.value.toLowerCase()] = n;
        }
        toCache(d);
        return d;
      });
  };

  const fmt = n => n.toLocaleString('en-GB');
  load().then(d => {
    document.querySelectorAll('[data-cites]').forEach(el => {
      const n = el.dataset.cites.split(' ').map(k => d.by[k]).find(v => v !== undefined);
      if (n > 0) { el.textContent = n === 1 ? 'Cited once' : `Cited ${fmt(n)} times`; el.hidden = false; }
    });
    document.querySelectorAll('[data-inspire-stats]').forEach(el => {
      const p = el.querySelector('[data-inspire-papers]'), c = el.querySelector('[data-inspire-cites]');
      if (p) p.textContent = fmt(d.total);
      if (c) c.textContent = fmt(d.sum);
      if (d.total > 0) el.hidden = false;
    });
  }).catch(() => {});
})();
