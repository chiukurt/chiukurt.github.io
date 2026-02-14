
(async function () {
  const luxiferAnalytics = "https://luxifer-analytics-cdn-fcbkengwhub0fdd9.z01.azurefd.net";
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') return;

  setTimeout(() => {
    window.__LUMMMEN__.markReady("matomo", "data");
  }, 3000);

  window.__LUMMMEN__.when("tests").then((tests) => {
    try {
      if (data.tests) console.log(data);//startAbTest(data.tests);
    } catch { lummmenShowPage(); }
  });

  window.__LUMMMEN__.ready.then((data) => {
    try {
      if (data.tests) console.log(data);//startAbTest(data.tests);
    } catch { lummmenShowPage(); }
  });

  //////////////////////////////

  _paq.push(['requireConsent']);  

  function startMTM(){
    function todayParam() {
      var pad = (number) => (number < 10 ? '0' : '') + number;
      var today = new Date();
      return `${today.getUTCFullYear()}-${pad(today.getUTCMonth() + 1)}-${pad(today.getUTCDate())}`;
    }
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    (function() {
      var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
      g.async = true; g.src = `${luxiferAnalytics}/js/container_orKRLPJg.js?d=` + todayParam(); s.parentNode.insertBefore(g, s);
    })();
  }

  function allowTracking(){
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    startMTM();
  }

  const getLuxiCookie = n => ((v = `; ${document.cookie}`.split(`; ${n}=`)) && v.length === 2 ? v.pop().split(';').shift() : undefined);
  const setLuxiCookie = (n, v) => document.cookie = `${n}=${v};expires=${new Date(Date.now() + 365*24*60*60*1000).toUTCString()};path=/`;
  const inSample = (inputNum) => parseInt(inputNum, 10) <= parseInt(matomoLuxiSampleSize, 10);

  var luxiSample = getLuxiCookie("luxiSample");
  if (!luxiSample) {
    luxiSample = Math.floor(Math.random() * 100) + 1;
    setLuxiCookie("luxiSample", luxiSample);
  }
  if (inSample(luxiSample)) { 
    _paq.push(["setConsentGiven"]);
    _paq.push(["rememberConsentGiven"]);
    allowTracking();
  }
})();


// (async function () {

//   (function () {
//     function normalizeUrl(u) {
//       try {
//         var parsed = new URL(u, window.location.origin);
//         var params = new URLSearchParams(parsed.search);
//         params.delete('pk_ab_test');
//         var sortedParams = new URLSearchParams();
//         Array.from(params.keys()).sort().forEach(key => {
//           sortedParams.set(key, params.get(key));
//         });
//         return parsed.pathname + (sortedParams.toString() ? '?' + sortedParams.toString() : '');
//       } catch (e) {
//         return u;
//       }
//     }

//     function startAbTest(tests) { 
//       if (!testsLoaded || !matomoLoaded) return;
//       if (!shouldLuxiAbTest || tests.length === 0) {
//         lummmenShowPage();
//         return;
//       }

//       tests.forEach((test) => {
//         var { name, url, type, data, selector, device } = test;
//         var currentUrl = normalizeUrl(window.location.pathname + window.location.search);
//         var testUrl = normalizeUrl(url);
//         if (currentUrl !== testUrl) return;
//         _paq.push(["AbTesting::create", {
//             name: name,
//             trigger: () => {
//               var ua = navigator.userAgent;
//               var isiPad = /\biPad\b/.test(ua) || (navigator.platform === 'MacIntel' && 'ontouchend' in document);
//               var isAndroidTablet = /\bAndroid\b/.test(ua) && !/\bMobile\b/.test(ua);
//               var isOtherTablet = /Tablet|PlayBook|Silk|Kindle|Nexus 7|Nexus 10|SM-T/.test(ua);
//               var isTablet = isiPad || isAndroidTablet || isOtherTablet;
//               var isMobile = !isTablet && /Mobile|iPhone|iPod/.test(ua);
//               var d = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
//               return d === device;
//             },
//             includedTargets: [{ attribute: "url", type: "equals_exactly", value: url, inverted: "0" }],
//             excludedTargets: [],
//             variations: [
//               {
//                 name: "original",
//                 activate: function (event) { },
//               },
//               {
//                 name: "test",
//                 activate: async function (event) {
//                   async function waitForElm(selector) {
//                     return new Promise(resolve => {
//                       var node = document.querySelector(selector);
//                       if (node) return resolve(node);

//                       var observer = new MutationObserver(() => {
//                         node = document.querySelector(selector);
//                         if (node) {
//                           observer.disconnect();
//                           resolve(node);
//                         }
//                       });

//                       var topNode = document.body || document.documentElement;
//                       if (!(topNode instanceof Node)) return resolve(null);

//                       observer.observe(topNode, { childList: true, subtree: true });
//                     });
//                   }

//                   function applyBVersion(node) { 
//                     if (type === "simple_text") node.innerHTML = data;
//                     if (type === "simple_img") node.src = data;
//                   }

//                   waitForElm(selector).then((node) => { 
//                     if (node) applyBVersion(node);
//                   });
//                 },
//               },
//             ],
//           },
//         ]);
//       });
//       removeLuxiLoadingClass();
//     }

//     async function getTests() {
//       try {
//         var response = await fetch(luxiferAbDataSource, {
//           method: 'POST',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({ idSite: matomoLuxiSiteId }),
//         });
//         return await response.json();
//       } catch (e) {
//         return [];
//       }
//     }

//     var tests = [];
//     var testsLoaded = false;
//     var matomoLoaded = false;
//     _paq.push(["setTrackerUrl", `${luxiferAnalytics}/matomo.php`]);
//     _paq.push(['setSiteId', matomoLuxiSiteId]);
//     var d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0];
//     g.async = true; g.src = `${luxiferAnalytics}/matomo.js`;
//     s.parentNode.insertBefore(g, s);
//     g.onload = () => { window.__LUMMMEN__.markReady("analytics", 200) };
//   })();





// })();