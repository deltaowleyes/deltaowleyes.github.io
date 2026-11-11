'use strict';
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');
  if (toggle && nav) {
    function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); nav.classList.remove('open'); }
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('open', open);
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); toggle.focus(); } });
  }
  // Small source manifest drives credible public record totals without loading the
  // 4,996-business index into the homepage or initial directory paint.
  if (document.querySelector('[data-record-total]')) {
    fetch('data/source-manifest.json', {cache: 'no-cache'})
      .then(response => { if (!response.ok) throw Error('Snapshot manifest unavailable'); return response.json(); })
      .then(data => {
        for (const name of ['businesses','churches','events']) {
          const total = data?.counts?.[name];
          if (Number.isInteger(total) && total >= 0) document.querySelectorAll('[data-record-total="' + name + '"]').forEach(el => { el.textContent = total.toLocaleString('en-CA'); });
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(data.retrieved_date || ''))) document.querySelectorAll('[data-snapshot-date]').forEach(el => { el.textContent = 'Source snapshot: ' + data.retrieved_date + ' · Listings require confirmation'; });
      })
      .catch(() => document.querySelectorAll('[data-snapshot-date]').forEach(el => { el.textContent = 'Directory statistics temporarily unavailable'; }));
  }
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));
})();
