(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Tunables
  var H_RANGE = 110;               // px — horizontal half-window around cursor X (≈ 5–6 words)
  var Y_PADDING = 2;               // px — small slack so cursor right at line edge still counts
  var FOCUS_RGB = [78, 42, 132];   // NU Purple #4E2A84
  var TRANSITION_MS = 180;

  var style = document.createElement('style');
  style.textContent =
    '.cursor-word{transition:color ' + TRANSITION_MS + 'ms ease;will-change:color;}';
  document.head.appendChild(style);

  function isSkippable(node) {
    if (!node) return true;
    var tag = node.tagName;
    if (!tag) return false;
    if (tag === 'CODE' || tag === 'PRE' || tag === 'SCRIPT' || tag === 'STYLE' ||
        tag === 'NOSCRIPT' || tag === 'I' || tag === 'IFRAME' || tag === 'CANVAS') return true;
    if (node.classList && (node.classList.contains('cursor-word') ||
        node.classList.contains('social-icons') ||
        node.classList.contains('image'))) return true;
    return false;
  }

  function wrapTextNode(textNode) {
    var text = textNode.nodeValue;
    if (!text || !/\S/.test(text)) return;
    var frag = document.createDocumentFragment();
    var parts = text.split(/(\s+)/);
    var anyWord = false;
    for (var i = 0; i < parts.length; i++) {
      var t = parts[i];
      if (!t) continue;
      if (/^\s+$/.test(t)) {
        frag.appendChild(document.createTextNode(t));
      } else {
        var span = document.createElement('span');
        span.className = 'cursor-word';
        span.textContent = t;
        frag.appendChild(span);
        anyWord = true;
      }
    }
    if (anyWord) textNode.parentNode.replaceChild(frag, textNode);
  }

  function walkAndWrap(root) {
    if (isSkippable(root)) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentNode;
        while (p && p !== root) {
          if (isSkippable(p)) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        if (!/\S/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (var i = 0; i < nodes.length; i++) wrapTextNode(nodes[i]);
  }

  var headerEl = document.querySelector('header');
  var sectionEl = document.querySelector('section');
  if (headerEl) walkAndWrap(headerEl);
  if (sectionEl) walkAndWrap(sectionEl);

  var words = Array.prototype.slice.call(document.querySelectorAll('.cursor-word'));

  // Cache each word's horizontal center + vertical band (line bounds)
  var rects = [];
  function refreshRects() {
    rects.length = 0;
    for (var i = 0; i < words.length; i++) {
      var r = words[i].getBoundingClientRect();
      if (r.width === 0 || r.height === 0) { rects.push(null); continue; }
      rects.push({ cx: r.left + r.width / 2, top: r.top, bottom: r.bottom });
    }
  }
  refreshRects();
  window.addEventListener('resize', refreshRects);
  window.addEventListener('scroll', refreshRects, { passive: true });

  var mouse = { x: -9999, y: -9999, active: false };
  var pending = false;
  var lastDirty = [];

  function update() {
    pending = false;
    var nextDirty = [];

    if (mouse.active) {
      for (var i = 0; i < words.length; i++) {
        var r = rects[i];
        if (!r) continue;
        // Stage 1: same line as cursor (Y must lie within the word's vertical band)
        if (mouse.y < r.top - Y_PADDING) continue;
        if (mouse.y > r.bottom + Y_PADDING) continue;
        // Stage 2: within horizontal window around cursor X
        var dx = r.cx - mouse.x;
        if (dx > H_RANGE || dx < -H_RANGE) continue;

        words[i].style.color = 'rgb(' +
          FOCUS_RGB[0] + ',' + FOCUS_RGB[1] + ',' + FOCUS_RGB[2] + ')';
        nextDirty.push(i);
      }
    }

    for (var j = 0; j < lastDirty.length; j++) {
      var idx = lastDirty[j];
      if (nextDirty.indexOf(idx) !== -1) continue;
      words[idx].style.color = '';
    }
    lastDirty = nextDirty;
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    mouse.active = false;
    if (!pending) { pending = true; requestAnimationFrame(update); }
  });
})();
