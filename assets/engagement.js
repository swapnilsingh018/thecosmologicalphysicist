/* Legacy pages: live chat and the availability indicator have been removed.
   Any old "chat" control now opens an email instead; status indicators are hidden.
   No third-party script is loaded. */
(() => {
  'use strict';
  const mail = 'mailto:swapnilsingh.ph@gmail.com?subject=Research%20enquiry';
  const hide = () => {
    document.querySelectorAll('[data-availability], .availability-dock, .gateway-live, [data-visitor-stat]')
      .forEach(el => { el.hidden = true; el.style.display = 'none'; });
    document.querySelectorAll('[data-chat-trigger]').forEach(el => {
      if (el.closest('[data-availability]')) return;
      el.addEventListener('click', e => { e.preventDefault(); window.location.href = mail; });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hide);
  else hide();
})();
