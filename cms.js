/* Dragon AI CMS Runtime — include in partner pages */
(function () {
  const pageName = document.body.getAttribute('data-cms-page');
  if (!pageName) return;

  const raw = localStorage.getItem('cms_' + pageName);
  if (!raw) return;

  let data;
  try { data = JSON.parse(raw); } catch (e) { return; }

  const setText = (sel, val, scope) => {
    if (!val) return;
    const el = (scope || document).querySelector(sel);
    if (el) el.textContent = val;
  };
  const setHtml = (sel, val, scope) => {
    if (!val) return;
    const el = (scope || document).querySelector(sel);
    if (el) el.innerHTML = val.replace(/\n/g, '<br>');
  };

  /* ── Hero ── */
  if (data.hero) {
    const h = data.hero;
    setText('.project-title', h.title);
    setText('.project-title-zh', h.titleZh);
    setText('.project-category-text', h.categoryText);
    setText('.project-about', h.about);
    if (h.tags) {
      const container = document.querySelector('.project-tags');
      if (container)
        container.innerHTML = h.tags
          .map(t => `<span class="project-tag">${t}</span>`).join('');
    }
  }

  /* ── Meta sidebar ── */
  if (data.meta) {
    document.querySelectorAll('.project-meta-item').forEach(item => {
      const label = item.querySelector('.project-meta-label')?.textContent?.toLowerCase().trim();
      const val   = item.querySelector('.project-meta-value');
      if (!label || !val) return;
      const m = data.meta;
      if      (label === 'client'        && m.client)       val.textContent = m.client;
      else if (label === 'campaign type' && m.campaignType) val.textContent = m.campaignType;
      else if (label === 'market'        && m.market)       val.textContent = m.market;
      else if (label === 'services'      && m.services)     val.innerHTML   = m.services.join('<br>');
      else if (label === 'campaigns'     && m.campaigns)    val.textContent = m.campaigns;
      else if (label === 'industry'      && m.industry)     val.textContent = m.industry;
    });
  }

  /* ── Campaign sections ── */
  if (data.campaigns) {
    const sections = document.querySelectorAll('.campaign-section');
    data.campaigns.forEach((cam, i) => {
      const s = sections[i];
      if (!s) return;
      setText('.campaign-num',            cam.num,           s);
      setText('.campaign-category-label', cam.categoryLabel, s);
      setHtml('.campaign-title',          cam.title,         s);
      setText('.campaign-title-zh',       cam.titleZh,       s);
      if (cam.desc) {
        const descs = s.querySelectorAll('.campaign-desc');
        cam.desc.forEach((d, j) => { if (descs[j] && d) descs[j].textContent = d; });
      }
      if (cam.venue) {
        const venue = s.querySelector('.campaign-venue');
        if (venue) {
          const icon = venue.querySelector('i');
          venue.textContent = cam.venue;
          if (icon) venue.prepend(icon);
        }
      }
    });
  }
})();
