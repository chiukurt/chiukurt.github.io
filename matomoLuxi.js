var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
(async function () {
  document.documentElement.classList.add('lummmen-ab-test-loading');
  const lummmenStyleEl = document.createElement('style');
  lummmenStyleEl.textContent = 'html.lummmen-ab-test-loading{opacity:0 !important;}';
  document.head.appendChild(lummmenStyleEl);
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
      if (previewId) {
        tests = await fetch(lummmenAbSource, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idSite: matomoLuxiSiteId, previewId })
        }).then(r => r.json(), () => []);
        sessionStorage.setItem(cacheKey, JSON.stringify(tests));
      } else {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try { tests = JSON.parse(cached); } catch { tests = undefined; }
        } else {
          tests = await fetch(lummmenAbSource, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idSite: matomoLuxiSiteId })
          }).then(r => r.json(), () => []);
          sessionStorage.setItem(cacheKey, JSON.stringify(tests));
        }
      }
      window.__LUMMMEN__.markReady("tests", tests);
  })();
  setTimeout(lummmenShowPage, 400);
  (function() {
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.5.01/abtest.min.js";
    script.integrity = "sha384-PaDzjjThqnRLLkV/qlGQopK4G3EzJA/YUB/DZweWTRh7y8kGFDDQj3oYVExAGIaX";
    script.crossOrigin = "anonymous";
    script.async = true;
    document.head.appendChild(script);
  })();
})();

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

// FAKE DEFAULT =============================================================================================================

// (function(){
//   if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') {
//     return;
//   }

//   _paq.push(['requireConsent']);
//   (function () {
//     _paq.push(["setTrackerUrl", "https://analytics.luxifer.app/matomo.php"]);
//     _paq.push(['setSiteId', matomoLuxiSiteId]);
//     var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
//     g.async = true; g.src = 'https://analytics.luxifer.app/matomo.js'; s.parentNode.insertBefore(g, s);
//   })();

//   function startMTM(){
//     return;
//   }

//   function startTracking(){
//     _paq.push(['trackPageView']);
//     _paq.push(['enableLinkTracking']);
//     console.log(_paq);
//     startMTM();
//   }

//   function getLuxiCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//   }

//   function setLuxiCookie(name, value) {
//     const d = new Date();
//     d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
//     document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
//   }

//   const inSample = (inputNum) =>
//     parseInt(inputNum, 10) <= parseInt(matomoLuxiSampleSize, 10);

//   let luxiSample = getLuxiCookie("luxiSample");
//   if (!luxiSample) {
//     luxiSample = Math.floor(Math.random() * 100) + 1;
//     setLuxiCookie("luxiSample", luxiSample);
//   }
//   if (inSample(luxiSample)) {
//     _paq.push(["setConsentGiven"]);
//     _paq.push(["rememberConsentGiven"]);
//     startTracking();
//   }
// })();

// END FAKE DEFAULT =============================================================================================================
