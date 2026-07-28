var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
(async function () {
  document.documentElement.classList.add('lummmen-ab-test-loading');
  const lummmenStyleEl = document.createElement('style');
  lummmenStyleEl.textContent = 'html.lummmen-ab-test-loading{opacity:0 !important;}';
  document.head.appendChild(lummmenStyleEl);
  const testResponseSource = "jsTestCreation/testResponse.json";
  const lummmenShowPage = () => {
    window.__LUMMMEN_TOO_LATE__ = true;
    document.documentElement.classList.remove("lummmen-ab-test-loading");
  };
  const REQUIRED = new Set(["tests", "analytics"]), store = {}, loaded = new Set(), resolvers = {}, keyPromises = {};
  REQUIRED.forEach(k => keyPromises[k] = new Promise(resolve => resolvers[k] = resolve));
  let resolveAll;
  const allReady = new Promise(resolve => resolveAll = resolve);
  const markReady = (k, v) => {
    if (!REQUIRED.has(k) || loaded.has(k)) return;
    store[k] = v; loaded.add(k); resolvers[k](v);
    if (loaded.size === REQUIRED.size) resolveAll(store);
  };
  window.__LUMMMEN__ = { markReady, ready: allReady, when: k => keyPromises[k], get: k => store[k] };
  (async () => {
      const loadTests = label => fetch(testResponseSource)
      .then(r => r.json(), () => ({}))
      .then(testResponse => {
        const tests = testResponse.previews || {};
        console.log(`[Lummmen] ${label} testResponse`, tests);
        return tests;
      });
      const tests = await loadTests("preview");
      window.__LUMMMEN__.markReady("tests", tests);
  })();
  setTimeout(lummmenShowPage, 400);
  (function() {
    var script = document.createElement('script');
    script.src = "jsTestCreation/lummmmenMain.js";
    script.async = true;
    document.head.appendChild(script);
  })();
})();
