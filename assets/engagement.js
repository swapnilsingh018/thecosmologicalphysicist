/* Tawk-powered live chat and truthful availability; no simulated message form.
   Visitor totals appear only after a trusted backend supplies a real integer. */
(() => {
  'use strict';
  const config = window.SKS_ENGAGEMENT_CONFIG || {};
  const docks = [...document.querySelectorAll('[data-availability]')];
  const actions = [...document.querySelectorAll('[data-chat-trigger]')];
  const stat = document.querySelector('[data-visitor-stat]');
  const number = stat?.querySelector('[data-visitor-number]');
  const property = String(config.tawkPropertyId || '').trim();
  const widget = String(config.tawkWidgetId || '').trim();
  const configured = /^[a-z0-9]{8,32}$/i.test(property) && /^[a-z0-9_-]{1,50}$/i.test(widget);
  let status = configured ? 'connecting' : 'unavailable';
  let chatReady = false;
  let pendingOpen = false;
  let loadFailed = false;

  const words = {
    unknown: ['availability_unknown', 'Chat ready'],
    connecting: ['availability_connecting', 'Connecting…'],
    online: ['availability_online', 'Online'],
    away: ['availability_away', 'Away'],
    offline: ['availability_offline', 'Offline'],
    unavailable: ['availability_unavailable', 'Chat unavailable']
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
      if (actionLabel) actionLabel.textContent = status === 'unavailable'
        ? translate('chat_unavailable', 'Unavailable')
        : chatReady ? translate('chat_live', 'Live chat') : translate('chat_open_action', 'Open chat');
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
    },
    requestLive() {
      if (this.openLive()) return true;
      if (!configured || loadFailed) { status = 'unavailable'; reflect(); return false; }
      pendingOpen = true;
      status = 'connecting';
      reflect();
      return true;
    }
  };
  document.addEventListener('sks:languagechange', reflect);
  reflect();
  actions.forEach(action => action.addEventListener('click', event => {
    event.preventDefault();
    window.SKSChat.requestLive();
  }));

  // These are public widget identifiers, not credentials. The provider supplies
  // online/away/offline; browser code never guesses a user's laptop state.
  if (configured) {
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
      if (pendingOpen) { pendingOpen = false; window.SKSChat.openLive(); }
    };
    window.Tawk_API.onChatMinimized = () => window.Tawk_API.hideWidget?.();
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://embed.tawk.to/${property}/${widget}`;
    tag.referrerPolicy = 'strict-origin-when-cross-origin';
    tag.onerror = () => { chatReady = false; pendingOpen = false; loadFailed = true; status = 'unavailable'; reflect(); };
    document.head.appendChild(tag);
    window.setTimeout?.(() => {
      if (chatReady || loadFailed) return;
      pendingOpen = false;
      loadFailed = true;
      status = 'unavailable';
      reflect();
    }, 18000);
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
