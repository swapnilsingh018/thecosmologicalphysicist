/* Truthful availability and analytics presentation.
   Chat is available only after the owner configures a genuine operator account.
   Visit counts are shown only after a trusted backend supplies a real integer. */
(() => {
  'use strict';
  const config = window.SKS_ENGAGEMENT_CONFIG || {};
  const dock = document.querySelector('[data-availability]');
  const label = dock?.querySelector('[data-availability-label]');
  const action = dock?.querySelector('[data-chat-action]');
  const actionLabel = action?.querySelector('[data-chat-label]');
  const stat = document.querySelector('[data-visitor-stat]');
  const number = stat?.querySelector('[data-visitor-number]');
  let status = 'unknown';
  let chatReady = false;

  const words = {
    unknown: ['availability_unknown', 'By email'],
    online: ['availability_online', 'Available now'],
    away: ['availability_away', 'Currently away'],
    offline: ['availability_offline', 'Currently offline']
  };
  const translate = (key, fallback) => window.SKSLanguage?.translate(key, fallback) ?? fallback;
  const reflect = () => {
    if (dock) {
      dock.classList.toggle('is-online', status === 'online');
      dock.classList.toggle('is-away', status === 'away');
      dock.dataset.status = status;
    }
    if (label) {
      const [key, fallback] = words[status] || words.unknown;
      label.textContent = translate(key, fallback);
    }
    if (actionLabel) actionLabel.textContent = chatReady ? translate('chat_live', 'Live chat') : translate('message_me', 'Message me');
  };
  document.addEventListener('sks:languagechange', reflect);
  reflect();

  // These are public widget identifiers, not credentials. The provider supplies
  // online/away/offline; browser code never guesses a user's laptop state.
  const property = String(config.tawkPropertyId || '').trim();
  const widget = String(config.tawkWidgetId || '').trim();
  if (/^[a-z0-9]{8,32}$/i.test(property) && /^[a-z0-9_-]{1,50}$/i.test(widget)) {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onStatusChange = next => {
      status = ['online','away','offline'].includes(next) ? next : 'unknown';
      reflect();
    };
    window.Tawk_API.onLoad = () => {
      chatReady = true;
      const current = window.Tawk_API.getStatus?.();
      status = ['online','away','offline'].includes(current) ? current : 'unknown';
      reflect();
    };
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://embed.tawk.to/${property}/${widget}`;
    tag.referrerPolicy = 'strict-origin-when-cross-origin';
    tag.onerror = () => { chatReady = false; status = 'unknown'; reflect(); };
    document.head.appendChild(tag);
  }
  action?.addEventListener('click', event => {
    if (!chatReady || typeof window.Tawk_API?.maximize !== 'function') return; // Email is the accessible fallback.
    event.preventDefault();
    window.Tawk_API.maximize();
  });

  // A public read-only stats endpoint must return { uniqueVisitors: number }.
  // An empty endpoint results in no counter, never a fake or zero value.
  const endpoint = String(config.visitorStatsEndpoint || '').trim();
  if (endpoint && stat && number) {
    let url;
    try { url = new URL(endpoint, location.href); } catch { return; }
    if (url.protocol !== 'https:' && url.origin !== location.origin) return;
    fetch(url.href, { method: 'GET', credentials: 'omit', cache: 'no-store' })
      .then(result => result.ok ? result.json() : Promise.reject(new Error('Stats unavailable')))
      .then(data => {
        if (!Number.isSafeInteger(data?.uniqueVisitors) || data.uniqueVisitors < 0) return;
        number.textContent = new Intl.NumberFormat(document.documentElement.lang).format(data.uniqueVisitors);
        stat.hidden = false;
      }).catch(() => { stat.hidden = true; });
  }
})();
