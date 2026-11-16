/* Truthful availability and analytics presentation.
   Chat is available only after the owner configures a genuine operator account.
   Visit counts are shown only after a trusted backend supplies a real integer. */
(() => {
  'use strict';
  const config = window.SKS_ENGAGEMENT_CONFIG || {};
  const docks = [...document.querySelectorAll('[data-availability]')];
  const actions = [...document.querySelectorAll('[data-chat-trigger]')];
  const stat = document.querySelector('[data-visitor-stat]');
  const number = stat?.querySelector('[data-visitor-number]');
  let status = 'unknown';
  let chatReady = false;

  const words = {
    unknown: ['availability_unknown', 'By email'],
    online: ['availability_online', 'Online'],
    away: ['availability_away', 'Away'],
    offline: ['availability_offline', 'Offline']
  };
  const translate = (key, fallback) => window.SKSLanguage?.translate(key, fallback) ?? fallback;
  const reflect = () => {
    docks.forEach(dock => {
      dock.classList.toggle('is-online', status === 'online');
      dock.classList.toggle('is-away', status === 'away');
      dock.dataset.status = status;
      const label = dock.querySelector('[data-availability-label]');
      if (!label) return;
      const [key, fallback] = words[status] || words.unknown;
      label.textContent = translate(key, fallback);
    });
    actions.forEach(action => {
      const actionLabel = action.querySelector('[data-chat-label]');
      if (actionLabel) actionLabel.textContent = chatReady ? translate('chat_live', 'Live chat') : translate('message_me', 'Message me');
    });
    document.dispatchEvent(new CustomEvent('sks:chatstatus', { detail: { status, ready: chatReady } }));
  };
  window.SKSChat = {
    get status() { return status; },
    get ready() { return chatReady; },
    openLive() {
      if (!chatReady || typeof window.Tawk_API?.maximize !== 'function') return false;
      window.Tawk_API.showWidget?.();
      window.Tawk_API.maximize();
      return true;
    }
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
      window.Tawk_API.hideWidget?.(); // A single contact control on the page.
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
