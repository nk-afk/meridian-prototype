/* Meridian · Lucide bridge for Deep Canvas.
   Lets padel use football's icon markup  <i data-lucide="chevron-down"></i>  verbatim.
   Football calls lucide.createIcons(), which REPLACES the <i> with an <svg>; inside a
   React-rendered Deep Canvas template that breaks reconciliation (React later tries to
   remove a node that is gone). So instead we APPEND the Lucide svg inside the <i> and
   leave the <i> in place (display:contents, see helmet style), and re-run on every DOM
   mutation so re-rendered lists / opened sub-docs get their icons too.
   Sizing + colour come from football's host rules in styles.css (.dd-btn svg, .chev svg,
   .rv2-arrow svg, .dp-arrow svg, .backlink svg …), exactly as on the football pages. */
(function () {
  if (window.__meridianLucideBridge) return;
  window.__meridianLucideBridge = true;

  function pascal(name) {
    return name.split('-').map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1); }).join('');
  }
  // Custom Meridian icons Lucide doesn't ship, in Lucide's IconNode shape (an array of
  // [tag, attrs] children). createElement(children) wraps them in the stroke svg, exactly
  // as for a built-in. We consult this map directly instead of writing into lucide.icons,
  // which is a guarded object that silently drops added keys.
  var CUSTOM = {
    racket: [
      ['ellipse', { cx: '9.5', cy: '9.5', rx: '5.5', ry: '6' }],
      ['line', { x1: '9.5', y1: '15.5', x2: '13', y2: '20' }],
      ['circle', { cx: '17.5', cy: '17.5', r: '1.8' }]
    ]
  };
  function iconNode(L, name) {
    if (CUSTOM[name]) return CUSTOM[name];
    var key = pascal(name);
    return (L.icons && L.icons[key]) || L[key] || null;
  }
  function fill(el) {
    var L = window.lucide;
    if (!L || typeof L.createElement !== 'function') return;
    var name = el.getAttribute('data-lucide') || '';
    // Re-fill if the engine wiped our svg (an empty <i> with a stale done-marker).
    if (!name || (el.getAttribute('data-lucide-done') === name && el.firstChild)) return;
    var node = iconNode(L, name);
    if (!node) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    var svg = L.createElement(node);
    // Same attribute merge lucide.createIcons does: placeholder attrs go onto the svg.
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name === 'data-lucide' || a.name === 'data-lucide-done') continue;
      if (a.name === 'class') svg.setAttribute('class', ((svg.getAttribute('class') || '') + ' ' + a.value).trim());
      else svg.setAttribute(a.name, a.value);
    }
    svg.classList.add('lucide', 'lucide-' + name);
    el.appendChild(svg);
    el.setAttribute('data-lucide-done', name);
  }
  function scan(root) {
    if (!root) return;
    if (root.nodeType === 1) {
      if (root.matches && root.matches('i[data-lucide]')) fill(root);
      var list = root.querySelectorAll ? root.querySelectorAll('i[data-lucide]') : [];
      for (var i = 0; i < list.length; i++) fill(list[i]);
    }
  }
  function start() {
    scan(document.body);
    // Belt and braces for the first seconds: anything rendered while lucide was still
    // downloading, or re-created by the engine without a mutation we saw, gets swept up.
    var sweeps = 0;
    var sweep = setInterval(function () {
      scan(document.body);
      if (++sweeps >= 20) clearInterval(sweep);
    }, 400);
    window.addEventListener('load', function () { scan(document.body); });
    // Flush on a 0ms timeout, NOT requestAnimationFrame: rAF is paused in background tabs,
    // which left freshly rendered lists icon-less until the tab was fronted.
    var queue = [], timer = 0;
    function flush() {
      timer = 0;
      var muts = queue; queue = [];
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'attributes') { fill(m.target); continue; }
        if (m.removedNodes.length && m.target.nodeType === 1 && m.target.matches('i[data-lucide]')) fill(m.target);
        for (var j = 0; j < m.addedNodes.length; j++) scan(m.addedNodes[j]);
      }
    }
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) queue.push(muts[i]);
      if (!timer) timer = setTimeout(flush, 0);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-lucide'] });
  }
  // lucide is loaded from unpkg by a helmet <script>; it may land after us.
  var tries = 0;
  (function wait() {
    if (window.lucide && typeof window.lucide.createElement === 'function') {
      if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
    } else if (tries++ < 400) setTimeout(wait, 50);
  })();
})();
