/* Homepage refresh: nav state + scrollspy, back-to-top, publication filter,
   and the paper preview dialog (with #paper=<id> deep links). */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function toArray(list) { return Array.prototype.slice.call(list); }

  /* ---------- Navigation state, scrollspy, back-to-top ---------- */

  var nav = doc.querySelector('.site-nav');
  var toTop = doc.querySelector('.to-top');
  var navLinks = toArray(doc.querySelectorAll('.site-nav__links a[href^="#"]'));
  var spyTargets = navLinks.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); });
  var ticking = false;

  function updateOnScroll() {
    ticking = false;
    var y = window.pageYOffset || root.scrollTop;
    if (nav) nav.classList.toggle('is-scrolled', y > 4);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);

    var line = (nav ? nav.offsetHeight : 0) + 40;
    var active = -1;
    for (var i = 0; i < spyTargets.length; i++) {
      if (spyTargets[i] && spyTargets[i].getBoundingClientRect().top <= line) active = i;
    }
    navLinks.forEach(function (a, i) {
      a.classList.toggle('is-active', i === active);
      if (i === active) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateOnScroll); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateOnScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Publication filter ---------- */

  var items = toArray(doc.querySelectorAll('.pub-item'));
  var containers = toArray(doc.querySelectorAll('.pub-group, .pub-block'));
  var filterBtns = toArray(doc.querySelectorAll('.pub-filter-btn'));

  function applyFilter(tag) {
    items.forEach(function (li) {
      var tags = (li.getAttribute('data-tags') || '').split('|');
      li.hidden = tag !== 'all' && tags.indexOf(tag) === -1;
    });
    containers.forEach(function (el) {
      el.hidden = !el.querySelector('.pub-item:not([hidden])');
    });
    filterBtns.forEach(function (b) {
      var on = b.getAttribute('data-filter') === tag;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    // cursor-text.js caches word positions; let it re-measure after the layout change.
    window.dispatchEvent(new Event('resize'));
  }
  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () { applyFilter(b.getAttribute('data-filter')); });
  });

  /* ---------- Paper preview dialog ---------- */

  var modal = doc.getElementById('paper-modal');
  var dataEl = doc.getElementById('pub-data');
  if (!modal || !dataEl) return;

  var pubs = {};
  try {
    var data = JSON.parse(dataEl.textContent);
    ['published', 'preprints'].forEach(function (key) {
      (data[key] || []).forEach(function (p) { if (p && p.id) pubs[p.id] = p; });
    });
  } catch (err) {
    return;
  }

  var panel = modal.querySelector('.paper-modal__panel');
  var body = modal.querySelector('.paper-modal__body');
  var eyebrow = modal.querySelector('.pm-eyebrow');
  var titleEl = modal.querySelector('.pm-title');
  var authorsEl = modal.querySelector('.pm-authors');
  var venueEl = modal.querySelector('.pm-venue');
  var figure = modal.querySelector('.pm-figure');
  var figLink = figure.querySelector('a');
  var figImg = figure.querySelector('img');
  var abstractWrap = modal.querySelector('.pm-abstract');
  var abstractText = abstractWrap.querySelector('p');
  var linksEl = modal.querySelector('.pm-links');
  var countEl = modal.querySelector('.pm-count');
  var prevBtn = modal.querySelector('[data-prev]');
  var nextBtn = modal.querySelector('[data-next]');
  var LINKS = [['pdf', 'PDF'], ['page', 'Project Page'], ['code', 'Code'], ['bibtex', 'BibTeX']];
  var currentId = null;
  var returnFocus = null;
  var hideTimer = null;

  function make(tag, className, text) {
    var el = doc.createElement(tag);
    el.className = className;
    el.textContent = text;
    return el;
  }

  // Order used by Previous/Next: the papers currently shown by the filter, in page order.
  function orderedIds() {
    var ids = items.filter(function (li) { return !li.hidden; })
      .map(function (li) { return li.getAttribute('data-pub-id'); });
    if (ids.indexOf(currentId) === -1) ids = items.map(function (li) { return li.getAttribute('data-pub-id'); });
    return ids;
  }

  function setHash(id) {
    if (!window.history || !history.replaceState) return;
    history.replaceState(null, '', location.pathname + location.search + (id ? '#paper=' + id : ''));
  }

  function render(id) {
    var p = pubs[id];
    currentId = id;

    eyebrow.textContent = '';
    if (p.conference_short) eyebrow.appendChild(make('span', 'pm-badge', p.conference_short));
    if (p.year) eyebrow.appendChild(make('span', 'pm-year', String(p.year)));
    (p.tags || []).forEach(function (t) { eyebrow.appendChild(make('span', 'tag-chip', t)); });

    titleEl.textContent = p.title || '';
    // authors/conference are the site's own inline HTML from _data/publications.yml (<strong>, [Oral] marker).
    authorsEl.innerHTML = p.authors || '';
    venueEl.innerHTML = p.conference || '';

    figure.hidden = !p.image;
    if (p.image) {
      figImg.src = p.image;
      figImg.alt = 'Overview figure for ' + p.title;
      figLink.href = p.image;
    } else {
      figImg.removeAttribute('src');
      figLink.removeAttribute('href');
    }

    abstractWrap.hidden = !p.abstract;
    abstractText.textContent = p.abstract || '';

    linksEl.textContent = '';
    LINKS.forEach(function (pair) {
      if (!p[pair[0]]) return;
      var a = make('a', 'pm-link' + (linksEl.childNodes.length ? '' : ' is-primary'), pair[1]);
      a.href = p[pair[0]];
      a.target = '_blank';
      a.rel = 'noopener';
      linksEl.appendChild(a);
    });

    var ids = orderedIds();
    var index = ids.indexOf(id);
    countEl.textContent = (index + 1) + ' / ' + ids.length;
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= ids.length - 1;
    body.scrollTop = 0;
    setHash(id);
  }

  function open(id, trigger) {
    if (!pubs[id]) return;
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (modal.hidden) returnFocus = trigger || doc.activeElement;
    render(id);
    modal.hidden = false;
    root.classList.add('modal-open');
    void modal.offsetWidth; // apply the closed state first so the opening transition runs
    modal.classList.add('is-open');
    panel.focus({ preventScroll: true });
  }

  function close() {
    if (modal.hidden || !currentId) return;
    currentId = null;
    modal.classList.remove('is-open');
    root.classList.remove('modal-open');
    hideTimer = setTimeout(function () { modal.hidden = true; hideTimer = null; }, reduceMotion ? 0 : 180);
    setHash(null);
    if (returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  }

  function step(delta) {
    var ids = orderedIds();
    var next = ids[ids.indexOf(currentId) + delta];
    if (next) render(next);
  }

  function trapFocus(e) {
    var focusable = toArray(panel.querySelectorAll('a[href], button:not([disabled])'))
      .filter(function (el) { return el.offsetParent !== null; });
    if (!focusable.length) { e.preventDefault(); return; }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && (doc.activeElement === first || doc.activeElement === panel)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && doc.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  doc.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-preview]');
    if (trigger) {
      e.preventDefault();
      open(trigger.getAttribute('data-preview'), trigger);
    }
  });

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) close();
    else if (e.target.closest('[data-prev]')) step(-1);
    else if (e.target.closest('[data-next]')) step(1);
  });

  doc.addEventListener('keydown', function (e) {
    if (modal.hidden || !currentId) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') trapFocus(e);
  });

  function openFromHash() {
    var m = /^#paper=([\w-]+)$/.exec(location.hash);
    if (m && pubs[m[1]]) open(m[1]);
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
