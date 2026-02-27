
var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
// (async function () {
//   document.documentElement.classList.add('lummmen-ab-test-loading');
//   document.head.innerHTML += '<style>html.lummmen-ab-test-loading{opacity:0 !important;}</style>';
//   const lummmenAbSource = "https://getabtestseu-573194387152.europe-west1.run.app";
//   const lummmenShowPage = () => {
//     window.__LUMMMEN_TOO_LATE__ = true;
//     document.documentElement.classList.remove("lummmen-ab-test-loading");
//   };
//   const REQUIRED = new Set(["tests", "analytics"]), store = {}, loaded = new Set(), resolvers = {}, keyPromises = {};
//   REQUIRED.forEach(k => keyPromises[k] = new Promise(resolve => resolvers[k] = resolve));
//   let resolveAll;
//   const allReady = new Promise(resolve => resolveAll = resolve);
//   const markReady = (k, v) => {
//     if (!REQUIRED.has(k) || loaded.has(k)) return;
//     store[k] = v; loaded.add(k); resolvers[k](v);
//     if (loaded.size === REQUIRED.size) resolveAll(store);
//   };
//   window.__LUMMMEN__ = { markReady, ready: allReady, when: k => keyPromises[k], get: k => store[k] };
//   (async () => {
//     const previewId = new URLSearchParams(location.search).get("lummmen-ab-preview");
//     const cacheKey = "lummmen-ab-tests";
//     let tests;
//     if (previewId) {
//       tests = await fetch(lummmenAbSource, {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ idSite: matomoLuxiSiteId, previewId })
//       }).then(r => r.json(), () => []);
//       sessionStorage.setItem(cacheKey, JSON.stringify(tests));
//     } else {
//       const cached = sessionStorage.getItem(cacheKey);
//       if (cached) {
//         tests = JSON.parse(cached);
//       } else {
//         tests = await fetch(lummmenAbSource, {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idSite: matomoLuxiSiteId })
//         }).then(r => r.json(), () => []);
//         sessionStorage.setItem(cacheKey, JSON.stringify(tests));
//       }
//     }
//     window.__LUMMMEN__.markReady("tests", tests);
//   })();
//   setTimeout(lummmenShowPage, 400);
//   (function() {
//     var script = document.createElement('script');
//     script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.4.02/abtest.min.js";
//     script.integrity = "sha384-BVwBpsnXVYMuq6FeCtYy+RC2hVwi184PqSnUKf0O2o2pXrcC/lvsYtXqnEyYqhO7";
//     script.crossOrigin = "anonymous";
//     script.async = true;
//     document.head.appendChild(script);
//   })();
// })();


// Local testing
// var matomoLuxiSiteId = "5";
// var matomoLuxiSampleSize = "100";
// var _mtm = window._mtm = window._mtm || [];
// var _paq = window._paq = window._paq || [];
(async function () {
  document.documentElement.classList.add('lummmen-ab-test-loading');
  document.head.innerHTML += '<style>html.lummmen-ab-test-loading{opacity:0 !important;}</style>';
  const lummmenAbSource = "https://getabtestseu-573194387152.europe-west1.run.app";
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
      const previewId = new URLSearchParams(location.search).get("lummmen-ab-preview");
      const cacheKey = "lummmen-ab-tests";
      let tests;
      const startTime = performance.now();
      console.log("[LUMMMEN] Fetch AB tests started:", startTime);
  
      if (previewId) {
        tests = await fetch(lummmenAbSource, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idSite: matomoLuxiSiteId, previewId })
        }).then(r => r.json(), () => []);
        sessionStorage.setItem(cacheKey, JSON.stringify(tests));
        console.log("[LUMMMEN] Fetch AB tests (preview) finished:", performance.now() - startTime, "ms");
      } else {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          tests = JSON.parse(cached);
          console.log("[LUMMMEN] Loaded AB tests from cache:", performance.now() - startTime, "ms");
        } else {
          tests = await fetch(lummmenAbSource, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idSite: matomoLuxiSiteId })
          }).then(r => r.json(), () => []);
          sessionStorage.setItem(cacheKey, JSON.stringify(tests));
          console.log("[LUMMMEN] Fetch AB tests (live) finished:", performance.now() - startTime, "ms");
        }
      }
      window.__LUMMMEN__.markReady("tests", tests);
      console.log("[LUMMMEN] AB tests marked ready:", performance.now() - startTime, "ms");
  })();
  setTimeout(lummmenShowPage, 500);

  (function() { // TODO: Replace me with real jsDelivr cdn link
    var script = document.createElement('script');
    script.src = "jsDelivrLocalAbVariation.js";
    script.async = true;
    document.head.appendChild(script);
  })();
})();

// ABTEST (OLD) ==============================================================================================================
// var _mtm = window._mtm = window._mtm || [];
// var _paq = window._paq = window._paq || [];
// var shouldLuxiAbTest = true;
// document.documentElement.classList.add('luxi-ab-test-loading');
// document.head.innerHTML += '<style>html.luxi-ab-test-loading{opacity:0}</style>';
// var removeLuxiLoadingClass = () => document.documentElement.classList.remove("luxi-ab-test-loading");
// var luxiAutoTimeout = setTimeout(() => {
//   removeLuxiLoadingClass();
//   if (!new URLSearchParams(window.location.search).has('pk_ab_test')) shouldLuxiAbTest = false;
// }, 500);
// (function() {
//   var script = document.createElement('script');
//   script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.3.01/abtest.min.js";
//   script.integrity = "sha384-+bUq7ecXBASRJS4Zn1KW1G67ehvfDo2by/ckama+veKn+g/zVPAmim+/bqa75ixv";
//   script.crossOrigin = "anonymous";
//   script.async = true;
//   document.head.appendChild(script);
// })();

// DEFAULT =============================================================================================================
// var _mtm = window._mtm = window._mtm || [];
// var _paq = window._paq = window._paq || [];
// (function() {
//   var script = document.createElement('script');
//   script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.2.02/default.min.js";
//   script.integrity = "sha384-aIRAMkKxsFX6tOA6PFhqe85yPRXNadvhxK+X5tGYVLHHrwXdvTU9ma0mio9T+3jZ";
//   script.crossOrigin = "anonymous";
//   script.async = true;
//   document.head.appendChild(script);
// })();

// Special MTM test container. Exclude this from client code ===========================================================
// function todayParam() {
//   var pad = (number) => (number < 10 ? '0' : '') + number;
//   var today = new Date();
//   return `${today.getUTCFullYear()}-${pad(today.getUTCMonth() + 1)}-${pad(today.getUTCDate())}`;
// }
// var _mtm = window._mtm = window._mtm || [];
// _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
// (function() {
//   var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
//   g.async=true; g.src='https://analytics.luxifer.app/js/container_1jnfkkvV.js?d=' + todayParam(); s.parentNode.insertBefore(g, s);
// })();


// TESTING =============================================================================================================

