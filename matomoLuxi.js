
// =====================================================================================================================
var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
var shouldLuxiAbTest = true;
document.documentElement.classList.add('luxi-ab-test-loading');
document.head.innerHTML += '<style>html.luxi-ab-test-loading{opacity:0}</style>';
var removeLuxiLoadingClass = () => document.documentElement.classList.remove("luxi-ab-test-loading");
var luxiAutoTimeout = setTimeout(() => {
  removeLuxiLoadingClass();
  if (!new URLSearchParams(window.location.search).has('pk_ab_test')) shouldLuxiAbTest = false;
}, 500); 
// (function() {
//   var script = document.createElement('script');
//   script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.2.02/default.min.js";
//   script.integrity = "sha384-aIRAMkKxsFX6tOA6PFhqe85yPRXNadvhxK+X5tGYVLHHrwXdvTU9ma0mio9T+3jZ";
//   script.crossOrigin = "anonymous";
//   script.async = true;
//   setTimeout(() => {
//     document.head.appendChild(script);
//   }, 10000);
// })();

// Special MTM test container. Exclude this from client code ===========================================================

function todayParam() {
  var pad = (number) => (number < 10 ? '0' : '') + number;
  var today = new Date();
  return `${today.getUTCFullYear()}-${pad(today.getUTCMonth() + 1)}-${pad(today.getUTCDate())}`;
}
var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
(function() {
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src='https://analytics.luxifer.app/js/container_1jnfkkvV.js?d=' + todayParam(); s.parentNode.insertBefore(g, s);
})();

// Special test file (Load from JsDelivr)==============================================================================

(async function () {
  var luxiferAnalytics = "https://luxifer-analytics-cdn-fcbkengwhub0fdd9.z01.azurefd.net";
  var luxiferAbDataSource = "https://getabtestseu-573194387152.europe-west1.run.app";
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') {
    return;
  }
  
  _paq.push(['requireConsent']);

  (function () {

    var tests = [];
    var testsLoaded = false;
    var matomoLoaded = false;
    function startABTest() { 
      if (!testsLoaded || !matomoLoaded) return;
      
      if (!shouldLuxiAbTest || tests.length === 0) {
        removeLuxiLoadingClass();
        return;
      }

      clearTimeout(luxiAutoTimeout);

      tests.forEach((test) => {
        var { name, url, type, data, selector, device } = test;
        _paq.push(["AbTesting::create", {
            name: name,
            trigger: () => {
              var ua = navigator.userAgent;
              var isiPad = /\biPad\b/.test(ua) || (navigator.platform === 'MacIntel' && 'ontouchend' in document);
              var isAndroidTablet = /\bAndroid\b/.test(ua) && !/\bMobile\b/.test(ua);
              var isOtherTablet = /Tablet|PlayBook|Silk|Kindle|Nexus 7|Nexus 10|SM-T/.test(ua);
              var isTablet = isiPad || isAndroidTablet || isOtherTablet;
              var isMobile = !isTablet && /Mobile|iPhone|iPod/.test(ua);
              var d = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
              return d === device;
            },
            includedTargets: [{ attribute: "url", type: "equals_exactly", value: url, inverted: "0" }],
            excludedTargets: [],
            variations: [
              {
                name: "original",
                activate: function (event) { },
              },
              {
                name: "test",
                activate: async function (event) {
                  async function waitForElm(selector) {
                    return new Promise(resolve => {
                      var node = document.querySelector(selector);
                      if (node) return resolve(node);

                      var observer = new MutationObserver(() => {
                        node = document.querySelector(selector);
                        if (node) {
                          observer.disconnect();
                          resolve(node);
                        }
                      });

                      var topNode = document.body || document.documentElement;
                      if (!(topNode instanceof Node)) return resolve(null);

                      observer.observe(topNode, { childList: true, subtree: true });
                    });
                  }

                  function applyBVersion(node) { 
                    if (type === "simple_text") node.innerHTML = data;
                    if (type === "simple_img") node.src = data;
                  }

                  waitForElm(selector).then((node) => { 
                    if (node) applyBVersion(node);
                  });
                },
              },
            ],
          },
        ]);
      });
      removeLuxiLoadingClass();
    }

    async function getTests() {
      try {
        var response = await fetch(luxiferAbDataSource, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ idSite: matomoLuxiSiteId }),
        });
        return await response.json();
      } catch (e) {
        return [];
      }
    }

    _paq.push(["setTrackerUrl", `${luxiferAnalytics}/matomo.php`]);
    _paq.push(['setSiteId', matomoLuxiSiteId]);
    var d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0];
    g.async = true; g.src = `${luxiferAnalytics}/matomo.js`;

    g.onload = () => {
      matomoLoaded = true;
      try {
        startABTest();
      } catch (e) {
        removeLuxiLoadingClass();
      }
    };

    getTests().then((data) => {
      if (Array.isArray(data)) { tests.push(...data); }
      testsLoaded = true;
      try {
        startABTest();
      } catch (e) {
        removeLuxiLoadingClass();
      }
    });

    s.parentNode.insertBefore(g, s);
  })();

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

  function startTracking(){
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    startMTM();
  }

  function getLuxiCookie(name) {
    var value = `; ${document.cookie}`;
    var parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setLuxiCookie(name, value) {
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  var inSample = (inputNum) => parseInt(inputNum, 10) <= parseInt(matomoLuxiSampleSize, 10);

  var luxiSample = getLuxiCookie("luxiSample");
  if (!luxiSample) {
    luxiSample = Math.floor(Math.random() * 100) + 1;
    setLuxiCookie("luxiSample", luxiSample);
  }
  if (inSample(luxiSample)) { 
    _paq.push(["setConsentGiven"]);
    _paq.push(["rememberConsentGiven"]);
    startTracking();
  }
})();
