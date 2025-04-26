
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
  const pad = (number) => (number < 10 ? '0' : '') + number;
  const today = new Date();
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
  const luxiferAnalytics = "https://luxifer-analytics-cdn-fcbkengwhub0fdd9.z01.azurefd.net";
  const luxiferABDataSource = "https://getabtestseu-573194387152.europe-west1.run.app";
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') {
    return;
  }
  
  const start = performance.now();

  const style = document.createElement('style');
  style.textContent = `html.luxifer-ab-test-loading { opacity: 0; }`;
  document.head.appendChild(style);
  document.documentElement.classList.add('luxifer-ab-test-loading');

  _paq.push(['requireConsent']);

  (function () {
    const tests = [];
    let testsLoaded = false;
    let matomoLoaded = false;
    const removeLoadingClass = () => document.documentElement.classList.remove("luxifer-ab-test-loading");

    function startABTest() { 
      if (!testsLoaded || !matomoLoaded) return;
      
      if (!shouldLoad
        || tests.length === 0
        || tests.some(test => window.location.href.split('?')[0].startsWith(test.url)))
      {
        removeLoadingClass();
        return;
      }

      clearTimeout(timeout);

      console.log("Both loaded. Starting AB test..."); 
      tests.forEach((test) => {
        const { name, url, type, data } = test;
        _paq.push(["AbTesting::create", {
            name: name,
            includedTargets: [{ attribute: "url", type: "starts_with", value: url, inverted: "0" }],
            excludedTargets: [],
            variations: [
              {
                name: "original",
                activate: function (event) {
                  document.getElementById("ab-element").innerText = "A VERSION";
                  removeLoadingClass();
                },
              },
              {
                name: "test",
                activate: function (event) {
                  if (type === "simple_text") {
                    const abElement = document.getElementById("ab-element");
                    if (abElement) { abElement.innerHTML = data; }
                    removeLoadingClass();
                  }
                },
              },
            ],
          },
        ]);
      });
    }

    async function getTests() { 
      const response = await fetch(luxiferABDataSource, {
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

    let shouldLoad = true;

    g.onload = () => {
      console.log(`Matomo took ${performance.now() - start} milliseconds`);
      matomoLoaded = true;
      startABTest();
    };

    getTests().then((data) => {
      console.log(data);
      if (Array.isArray(data)) { tests.push(...data); }
      console.log(`ABTEST Took ${performance.now() - start} milliseconds`);
      testsLoaded = true;
      startABTest();
    });

    const timeout = setTimeout(() => {
      shouldLoad = false;
      removeLoadingClass();
      const end = performance.now();
      console.log(`Loading timeout -- Took ${end - start} milliseconds`);
    }, 400); 

    s.parentNode.insertBefore(g, s);
  })();

  function startMTM(){
    function todayParam() {
      const pad = (number) => (number < 10 ? '0' : '') + number;
      const today = new Date();
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
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setLuxiCookie(name, value) {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  const inSample = (inputNum) =>
    parseInt(inputNum, 10) <= parseInt(matomoLuxiSampleSize, 10);

  let luxiSample = getLuxiCookie("luxiSample");
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
