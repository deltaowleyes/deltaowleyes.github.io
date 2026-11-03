(() => {
  'use strict';
  if (!/^\/news(?:\/|$)/.test(location.pathname)) return;
  const KEY = 'doe-news-language-v9';
  const getSaved = () => {
    try { return localStorage.getItem(KEY) === 'rez' ? 'rez' : 'professional'; }
    catch (_) { return 'professional'; }
  };
  const save = mode => { try { localStorage.setItem(KEY, mode); } catch (_) {} };
  const main = document.querySelector('main');
  if (!main) return;
  const entries = [...main.querySelectorAll('article')];
  if (!entries.length) return;
  const slugFrom = article => {
    const link = article.querySelector('h2 a[href*="/news/articles/"]');
    const path = link ? new URL(link.href, location.href).pathname : location.pathname;
    const match = path.match(/\/news\/articles\/([^/]+)\//);
    return match ? match[1] : '';
  };
  const createSwitch = () => {
    const box = document.createElement('fieldset');
    box.className = 'doe-news-language-toggle';
    box.setAttribute('aria-label', 'Article reading style');
    const legend = document.createElement('legend');
    legend.textContent = 'Reading style';
    box.append(legend);
    for (const [mode, label] of [['professional', 'Professional'], ['rez', 'Rez Slang 9.0']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.newsMode = mode;
      button.textContent = label;
      button.setAttribute('aria-pressed', 'false');
      box.append(button);
    }
    return box;
  };
  fetch('/news/rez-slang-9.json', {cache: 'no-store'})
    .then(response => { if (!response.ok) throw new Error('Missing style data'); return response.json(); })
    .then(data => {
      if (data.version !== '9.0' || !data.articles) throw new Error('Invalid style data');
      const enhanced = [];
      entries.forEach(article => {
        const slug = slugFrom(article);
        const item = data.articles[slug];
        if (!item || !Array.isArray(item.sections) || !item.sections.length) return;
        const heading = article.querySelector('h1, h2');
        if (!heading) return;
        const headingTextNode = heading.querySelector('a') || heading;
        const originalHeadline = headingTextNode.textContent;
        const professional = document.createElement('div');
        professional.className = 'doe-news-version';
        professional.dataset.newsVersion = 'professional';
        const rez = document.createElement('div');
        rez.className = 'doe-news-version';
        rez.dataset.newsVersion = 'rez';
        rez.hidden = true;
        while (heading.nextSibling) professional.append(heading.nextSibling);
        for (const section of item.sections) {
          if (!section.text || !section.label) continue;
          const paragraph = document.createElement('p');
          const strong = document.createElement('strong');
          strong.textContent = section.label + ': ';
          paragraph.append(strong, document.createTextNode(section.text));
          rez.append(paragraph);
        }
        const sources = [...professional.querySelectorAll('a[href^="https://"]')];
        const unique = new Set();
        if (sources.length) {
          const sourceParagraph = document.createElement('p');
          sourceParagraph.className = 'doe-news-sources';
          const lead = document.createElement('strong');
          lead.textContent = 'Original sources: ';
          sourceParagraph.append(lead);
          for (const source of sources) {
            if (unique.has(source.href)) continue;
            unique.add(source.href);
            if (unique.size > 1) sourceParagraph.append(document.createTextNode(' · '));
            const link = source.cloneNode(true);
            sourceParagraph.append(link);
          }
          rez.append(sourceParagraph);
        }
        const note = document.createElement('p');
        note.className = 'doe-news-language-note';
        note.textContent = 'Rez Slang 9.0 is a conversational rewrite of this report, not an Indigenous-language translation. Dates, attribution, source links and factual qualifications are retained.';
        rez.insertBefore(note, rez.firstChild);
        heading.after(professional, rez);
        enhanced.push({professional, rez, headingTextNode, originalHeadline, headline:item.headline});
      });
      if (!enhanced.length) return;
      const switcher = createSwitch();
      if (entries.length === 1 && main.querySelector('article h1')) {
        main.querySelector('article h1').after(switcher);
      } else {
        main.insertBefore(switcher, entries[0]);
      }
      const status = document.createElement('p');
      status.className = 'doe-news-language-status';
      status.setAttribute('role', 'status');
      switcher.after(status);
      const setMode = mode => {
        if (mode !== 'rez') mode = 'professional';
        for (const e of enhanced) {
          e.professional.hidden = mode === 'rez';
          e.rez.hidden = mode !== 'rez';
          e.headingTextNode.textContent = mode === 'rez' ? e.headline : e.originalHeadline;
        }
        for (const button of switcher.querySelectorAll('button')) {
          const on = button.dataset.newsMode === mode;
          button.setAttribute('aria-pressed', String(on));
        }
        const missing = entries.length - enhanced.length;
        status.textContent = (mode === 'rez'
          ? 'Showing Rez Slang 9.0 editions. All sources and verification standards are unchanged.'
          : 'Showing original Professional editions.') +
          (missing && mode === 'rez' ? ' ' + missing + ' article(s) do not yet have reviewed Rez Slang editions and remain Professional.' : '');
        save(mode);
      };
      switcher.addEventListener('click', event => {
        const button = event.target.closest('button[data-news-mode]');
        if (button && switcher.contains(button)) setMode(button.dataset.newsMode);
      });
      setMode(getSaved());
    })
    .catch(() => { /* Keep original professional text available if the data cannot load. */ });
})();
