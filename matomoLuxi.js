
// =======================================================================================================================================================================================================

var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
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

// Special MTM test container. ==========================================================================================================================================================================

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

// Special test file =======================================================================================================================================================================================================

(function () {
  var luxiferAnalytics = "https://luxifer-analytics-cdn-fcbkengwhub0fdd9.z01.azurefd.net";
  var luxiferABDataSource = "https://getabtestseu-573194387152.europe-west1.run.app";
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') {
    return;
  }
  
  var start = performance.now();

  var style = document.createElement('style');
  style.textContent = `html.luxifer-ab-test-loading { opacity: 0; }`;
  document.head.appendChild(style);
  document.documentElement.classList.add('luxifer-ab-test-loading');

  _paq.push(['requireConsent']);

  (function () {
    var tests = [];
    var testsLoaded = false;
    var matomoLoaded = false;
    var removeLoadingClass = () => document.documentElement.classList.remove("luxifer-ab-test-loading");

    function startABTest() { 
      console.log(tests, testsLoaded, matomoLoaded, tests.length);
      if (!testsLoaded || !matomoLoaded) return;
      
      if (!shouldTest || tests.length === 0) {
        removeLoadingClass();
        return;
      }

      clearTimeout(timeout);

      console.log("Both loaded. Starting AB test..."); 
      tests.forEach((test) => {
        var { name, url, type, data, selector } = test;
        _paq.push(["AbTesting::create", {
            name: name,
            includedTargets: [{ attribute: "url", type: "equals_simple", value: url, inverted: "0" }],
            excludedTargets: [],
            variations: [
              {
                name: "original",
                activate: function (event) {
                  var abElement = document.querySelector(selector);
                  if (!abElement) { return; }
                  if (type === "simple_text") abElement.innerText = "A VERSION";
                },
              },
              {
                name: "test",
                activate: function (event) {
                  function applyBVersion(node) { 
                    console.log("Applying test variation for: ", name);
                    if (type === "simple_text") node.innerHTML = data;
                    if (type === "simple_img") node.src = data;
                  }

                  console.log("Attempting test variation: ", name);

                  const node = document.querySelector(selector);
                  if (node) {
                    applyBVersion(node);
                    return;
                  }

                  function checkNodeAndChildren(node, selector) {
                    if (node.nodeType === 1 && node.matches?.(selector)) {
                      applyBVersion(node);
                      return true;
                    }
                    return Array.from(node.children || []).some((child) => checkNodeAndChildren(child, selector));
                  }
                  
                  const observer = new MutationObserver((mutationsList, observer) => {
                    for (const mutation of mutationsList) {
                      for (const node of mutation.addedNodes) {
                        const out = checkNodeAndChildren(node, selector);
                        console.log("OUT -- ", out, node);
                        if (out) {
                          observer.disconnect();
                          return;
                        }
                      }
                    }
                  });

                  observer.observe(document.body, {
                    childList: true,    
                    subtree: true,
                  });
                },
              },
            ],
          },
        ]);
      });
      removeLoadingClass();
    }

    async function getTests() { 
      var response = await fetch(luxiferABDataSource, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ idSite: matomoLuxiSiteId }),
      });
      return await response.json();
    }

    _paq.push(["setTrackerUrl", `${luxiferAnalytics}/matomo.php`]);
    _paq.push(['setSiteId', matomoLuxiSiteId]);
    var d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0];
    g.async = true; g.src = `${luxiferAnalytics}/matomo.js`;

    var shouldTest = true;

    g.onload = () => {
      console.log(`Matomo took ${performance.now() - start} milliseconds`);
      matomoLoaded = true;
      startABTest();
    };

    getTests().then((data) => {
      if (Array.isArray(data)) { tests.push(...data); }
      console.log(`ABTEST Took ${performance.now() - start} milliseconds`);
      testsLoaded = true;
      startABTest();
    });

    var timeout = setTimeout(() => {
      removeLoadingClass();
      if (new URLSearchParams(window.location.search).has('pk_ab_test')) return;
      shouldTest = false;
      var end = performance.now();
      console.log(`Loading timeout -- Took ${end - start} milliseconds`);
    }, 500); 

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

  var inSample = (inputNum) =>
    parseInt(inputNum, 10) <= parseInt(matomoLuxiSampleSize, 10);

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
