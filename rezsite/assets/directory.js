'use strict';
(() => {
  const el = id => document.getElementById(id);
  const tabs = [...document.querySelectorAll('[data-type]')];
  const validTypes = new Set(['businesses', 'churches', 'events']);
  const params = new URLSearchParams(location.search);
  let type = validTypes.has(params.get('type')) ? params.get('type') : 'businesses';
  let all = [], shown = 0, isPreview = false, fullBusinessLoaded = false, businessFullPromise = null, scope = "all";
  const limit = 12;
  const messages = {
    businesses: 'Explore Indigenous business research listings across Canada. Many records await direct owner confirmation; a source listing does not prove ownership or current operation.',
    churches: 'Find preliminary public church records serving First Nations communities. Indigenous leadership and on-reserve location must be independently documented; neither is assumed.',
    events: 'Explore public, source-linked community events. Upcoming verified events appear first; confirm access, dates and registration with the organizer.'
  };
  const files = {
    businesses: ['data/businesses-featured.json'],
    churches: ['data/churches.json'],
    events: ['data/events.json']
  };
  const cache = {};
  const fullSource = 'data/businesses-index.json';
  const create = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };
  function displayValue(value) { return (value === undefined || value === null) ? '' : String(value).trim(); }
  function safeLink(url) {
    if (!url || typeof url !== 'string') return null;
    try { const u = new URL(url); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; }
    catch { return null; }
  }
  function link(parent, title, url, external = true) {
    if (!url) return;
    const a = create('a', '', title + ' ↗');
    a.href = url;
    if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    parent.append(a);
  }
  function fromIndex(body) {
    if (Array.isArray(body)) return body;
    if (!body || body.schema !== 1 || !Array.isArray(body.fields) || !Array.isArray(body.records)) throw Error('Unknown directory data format');
    return body.records.map(values => Object.fromEntries(body.fields.map((key, i) => [key, values[i]])));
  }
  async function fetchJson(path) {
    const response = await fetch(path, {cache: 'no-cache'});
    if (!response.ok) throw Error(path + ': HTTP ' + response.status);
    return response.json();
  }
  async function loadType(next) {
    if (cache[next]) return cache[next];
    let error;
    for (let i = 0; i < files[next].length; i++) {
      try {
        const data = fromIndex(await fetchJson(files[next][i]));
        if (!Array.isArray(data)) throw Error('Expected directory records');
        cache[next] = {records: data, preview: i !== 0};
        return cache[next];
      } catch (err) { error = err; }
    }
    throw error || Error('No records available');
  }
  async function ensureFullBusinesses() {
    if (fullBusinessLoaded) return;
    if (businessFullPromise) return businessFullPromise;
    businessFullPromise = (async () => {
      try {
        const data = fromIndex(await fetchJson(fullSource));
        if (data.length < 1) throw Error('Full index is empty');
        cache.businesses = {records: data, preview: false};
        fullBusinessLoaded = true;
        if (type === 'businesses') {
          all = data; isPreview = false; rebuildFilters(true); render();
        }
      } catch (error) {
        if (type === 'businesses') {
          el('preview-notice').hidden = false;
          el('preview-notice').textContent = 'The complete business index could not be loaded. Please refresh or contact RezSite; do not rely on featured listings for exhaustive search.';
        }
      }
    })();
    return businessFullPromise;
  }
  function nameOf(item) { return displayValue(type === 'events' ? item.title : item.name); }
  function categoryOf(item) {
    if (type === 'businesses') {
      const proposed = displayValue(item.directory_category);
      const original = displayValue(item.original_category || item.category);
      return proposed === 'Other & Specialized Services' && original && original !== '-' ? original : proposed || original || 'Business';
    }
    return displayValue(type === 'churches' ? item.denomination : item.category) || 'Community';
  }
  function placeOf(item) { return displayValue(type === 'churches' ? item.reserve : item.city); }
  function locationOf(item) { return [placeOf(item), item.province].filter(Boolean).join(' · '); }
  function matchesScope(item) {
    if (scope === 'all') return true;
    if (scope === 'ontario') return displayValue(item.province).toLowerCase() === 'ontario';
    const region = [item.city, item.community, item.reserve].map(displayValue).join(' ').toLowerCase();
    return /walpole island|bkejwanong/.test(region);
  }
  function setScope(next) {
    scope = next;
    document.querySelectorAll('[data-scope]').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.scope === next)));
  }
  function priority(b) {
    const place = [b.city, b.community].join(' ').toLowerCase();
    if (/walpole island|bkejwanong/.test(place)) return 0;
    if (/aamjiwnaang|sarnia|chatham|wallaceburg|london/.test(place)) return 1;
    if (String(b.province).toLowerCase() === 'ontario') return 2;
    return 3;
  }
  function todayToronto() {
    const parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const byName = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return byName.year + '-' + byName.month + '-' + byName.day;
  }
  function formatDate(iso) { if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso||''))) return displayValue(iso); return new Intl.DateTimeFormat('en-CA',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(iso + 'T12:00:00Z')); }
  function listingStatus(item) {
    if (type === 'events') return {label: 'Source-verified', style: 'confirmed'};
    if (type === 'businesses' && item.owner_confirmed === true) return {label: 'Owner-confirmed', style: 'confirmed'};
    if (type === 'churches' && item.representative_confirmed === true && item.verification_status === 'verified') return {label: 'Church-confirmed', style: 'confirmed'};
    if (item.verification_status === 'partially_verified') return {label: 'Partially verified', style: 'partial'};
    return {label: 'Unverified', style: ''};
  }
  function card(item) {
    const article = create('article', 'result-card');
    const top = create('div', 'card-top');
    top.append(create('span', 'kind-label', categoryOf(item)));
    const status = listingStatus(item);
    top.append(create('span', 'verify-pill ' + status.style, status.label));
    article.append(top, create('h3', '', nameOf(item)));
    article.append(create('p', 'result-location', '⌖ ' + (locationOf(item) || 'Location not specified')));
    let description = '';
    if (type === 'businesses') description = displayValue(item.description) || 'Public business research listing. Please contact the business to confirm services and operation.';
    if (type === 'churches') description = [item.reserveLocated === true ? 'On-reserve location documented.' : 'On-reserve location not confirmed.', item.indigenousLed === true ? 'Indigenous leadership documented.' : 'Indigenous leadership not confirmed.'].join(' ');
    if (type === 'events') description = [formatDate(item.start_date) + (item.end_date && item.end_date !== item.start_date ? ' – ' + formatDate(item.end_date) : ''), displayValue(item.description)].filter(Boolean).join(' · ');
    article.append(create('p', 'result-desc', description));
    const foot = create('div', 'result-footer');
    if (type === 'businesses') {
      link(foot, 'Website', safeLink(item.website));
      const phone = displayValue(item.phone); if (phone) link(foot, 'Call', 'tel:' + phone.replace(/[^+0-9]/g,''), false);
      link(foot, 'Published source', safeLink(item.source_url));
    }
    if (type === 'churches') {
      const phone = displayValue(item.phone); if (phone) link(foot, 'Call', 'tel:' + phone.replace(/[^+0-9]/g,''), false);
      if (item.website) link(foot,'Church website',safeLink(item.website));
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(displayValue(item.email))) link(foot, 'Email', 'mailto:' + item.email, false);
      link(foot, 'Published source', safeLink(item.source));
    }
    if (type === 'events') {
      link(foot, 'Event details', safeLink(item.url));
    }
    if (!foot.children.length) foot.append(create('span', '', 'Contact details not published'));
    article.append(foot);
    return article;
  }
  function filtered() {
    const q = el('directory-search').value.trim().toLocaleLowerCase();
    const province = el('province-filter').value;
    const category = el('category-filter').value;
    const place = el('place-filter').value;
    const includePast = el('include-past').checked;
    const today = todayToronto();
    let records = all.filter(item => {
      if (!matchesScope(item)) return false;
      if (province && displayValue(item.province) !== province) return false;
      if (place && placeOf(item) !== place) return false;
      if (category && categoryOf(item) !== category) return false;
      if (type === 'events' && (item.status !== 'verified' || !item.start_date || (!includePast && (item.end_date || item.start_date) < today))) return false;
      if (q) {
        const haystack = [nameOf(item), categoryOf(item), item.city, item.province, item.community, item.reserve, item.description, item.organizer, item.original_category, item.phone].map(displayValue).join(' ').toLocaleLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    records.sort((a,b) => type === 'businesses' ? priority(a)-priority(b) || nameOf(a).localeCompare(nameOf(b)) : type === 'events' ? String(a.start_date).localeCompare(String(b.start_date)) || nameOf(a).localeCompare(nameOf(b)) : nameOf(a).localeCompare(nameOf(b)));
    return records;
  }
  function render(append = false) {
    const rows = filtered();
    const root = el('directory-results');
    if (!append) { shown = 0; root.replaceChildren(); }
    const next = rows.slice(shown, shown + limit);
    next.forEach(row => root.append(card(row)));
    shown += next.length;
    if (!rows.length) {
      const empty = create('div', 'empty-state');
      empty.append(create('h3', '', 'No matching listings found'));
      empty.append(create('p', '', 'Try different filters or clear your search.'));
      root.append(empty);
    }
    const suffix = isPreview ? ' · review sample (not a full transfer)' : '';
    const total = (isPreview || (type === 'businesses' && !fullBusinessLoaded)) ? {businesses:4996,churches:200,events:216}[type] : all.length;
    el('result-count').textContent = rows.length.toLocaleString() + ' matching · ' + all.length.toLocaleString() + ' loaded / ' + total.toLocaleString() + ' sourced records' + suffix;
    el('load-more').hidden = shown >= rows.length;
  }
  function setOptions(id, values, previousValue) {
    const select = el(id); select.replaceChildren(new Option(id === 'province-filter' ? 'All regions' : id === 'place-filter' ? 'All communities' : 'All categories', ''));
    [...new Set(values.map(displayValue).filter(Boolean))].sort((a,b)=>a.localeCompare(b)).forEach(v=>select.add(new Option(v,v)));
    if ([...select.options].some(o=>o.value===previousValue)) select.value=previousValue;
  }
  function rebuildFilters(preserve = false) {
    const oldProvince = preserve ? el('province-filter').value : '';
    const oldCategory = preserve ? el('category-filter').value : '';
    const oldPlace = preserve ? el('place-filter').value : '';
    setOptions('province-filter', all.map(a=>a.province), oldProvince);
    setOptions('category-filter', all.map(categoryOf), oldCategory);
    const selectedProvince = el('province-filter').value;
    setOptions('place-filter', all.filter(item => !selectedProvince || displayValue(item.province) === selectedProvince).map(placeOf), oldPlace);
    el('place-label').textContent = type === 'churches' ? 'FIRST NATION / COMMUNITY' : 'CITY / COMMUNITY';
    el('category-label').textContent = type === 'churches' ? 'DENOMINATION' : type === 'events' ? 'EVENT TYPE' : 'CATEGORY';
  }
  let sequence = 0;
  async function showType(next, preserveSearch = false) {
    const own = ++sequence;
    type = next;
    tabs.forEach(tab => { tab.setAttribute('aria-selected', String(tab.dataset.type === next)); tab.tabIndex = tab.dataset.type === next ? 0 : -1; });
    document.querySelectorAll('.nav-links a[href^="directory.html?type="]').forEach(a => { a.classList.toggle('is-active', a.getAttribute('href').endsWith('type=' + next)); if(a.classList.contains('is-active')) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    el('directory-results').setAttribute('aria-labelledby', 'tab-' + next);
    el('directory-explainer').textContent = messages[next];
    el('archive-wrap').hidden = next !== 'events';
    setScope('all');
    el('preview-notice').hidden = true;
    el('directory-results').replaceChildren();
    el('result-count').textContent = 'Loading ' + next + '…';
    if (!preserveSearch) { el('directory-search').value = ''; el('include-past').checked = false; }
    try {
      const result = await loadType(next);
      if (sequence !== own) return;
      all = result.records; isPreview = result.preview;
      rebuildFilters(); render();
      if (isPreview) {
        el('preview-notice').hidden = false;
        el('preview-notice').textContent = 'This local package is incomplete. Do not publish without all the required JSON files.';
      }
      if (location.protocol === 'https:' || location.protocol === 'http:') history.replaceState(null,'', 'directory.html?type=' + next);
    } catch (error) {
      if (sequence !== own) return;
      el('result-count').textContent = 'Directory could not load';
      const root=el('directory-results');
      const empty=create('div','empty-state'); empty.append(create('h3','','Unable to load directory records'),create('p','',error.message));root.append(empty);
    }
  }
  tabs.forEach(tab => tab.addEventListener('click', () => { if (tab.dataset.type !== type) showType(tab.dataset.type); }));
  const searchInput = el('directory-search');
  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => { if (type === 'businesses') await ensureFullBusinesses(); render(); }, 170);
  });
  for (const id of ['province-filter','place-filter','category-filter']) el(id).addEventListener('change', async () => {
    if (type === 'businesses') await ensureFullBusinesses();
    if (id === 'province-filter') {
      const currentProvince = el('province-filter').value;
      setOptions('place-filter', all.filter(item => !currentProvince || displayValue(item.province) === currentProvince).map(placeOf), '');
    }
    render();
  });
  document.querySelectorAll('[data-scope]').forEach(button => button.addEventListener('click', async () => { setScope(button.dataset.scope); if (type === 'businesses') await ensureFullBusinesses(); render(); }));
  el('clear-filters').addEventListener('click', () => {
    el('directory-search').value = ''; el('province-filter').value = ''; el('category-filter').value = ''; el('include-past').checked = false; setScope('all'); rebuildFilters(true); render(); el('directory-search').focus();
  });
  document.querySelector('.directory-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    const index = tabs.indexOf(document.activeElement); if(index < 0) return;
    event.preventDefault(); const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowLeft' ? -1 : 1) + tabs.length) % tabs.length;
    tabs[target].focus(); if (tabs[target].dataset.type !== type) showType(tabs[target].dataset.type);
  });
  el('include-past').addEventListener('change', () => render());
  el('load-more').addEventListener('click', async () => { if (type === 'businesses') await ensureFullBusinesses(); render(true); });
  window.addEventListener('popstate', () => { const p = new URLSearchParams(location.search).get('type'); if (validTypes.has(p)) showType(p); });
  showType(type);
})();
