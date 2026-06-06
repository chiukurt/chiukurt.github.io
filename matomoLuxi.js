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
//       const previewId = new URLSearchParams(location.search).get("lummmen-ab-preview");
//       const cacheKey = "lummmen-ab-tests";
//       let tests;
//       if (previewId) {
//         tests = await fetch(lummmenAbSource, {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idSite: matomoLuxiSiteId, previewId })
//         }).then(r => r.json(), () => []);
//         sessionStorage.setItem(cacheKey, JSON.stringify(tests));
//       } else {
//         const cached = sessionStorage.getItem(cacheKey);
//         if (cached) {
//           tests = JSON.parse(cached);
//         } else {
//           tests = await fetch(lummmenAbSource, {
//             method: "POST", headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ idSite: matomoLuxiSiteId })
//           }).then(r => r.json(), () => []);
//           sessionStorage.setItem(cacheKey, JSON.stringify(tests));
//         }
//       }
//       window.__LUMMMEN__.markReady("tests", tests);
//   })();
//   setTimeout(lummmenShowPage, 400);
//   (function() {
//     var script = document.createElement('script');
//     script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.5.00/abtest.min.js";
//     script.integrity = "sha384-PBYjGClXI08Pgco2+fhMGu1MxCitOXCvxQFjhbZ9pJi99tzIJNUWBgoD9Gvvg/rp";
//     script.crossOrigin = "anonymous";
//     script.async = true;
//     document.head.appendChild(script);
//   })();
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
//   g.async=true; g.src='https://analytics.luxifer.app/js/container_t9d5lGU5.js?d=' + todayParam(); s.parentNode.insertBefore(g, s);
// })();
