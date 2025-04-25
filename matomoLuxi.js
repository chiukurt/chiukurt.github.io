
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

// bare minimum data to execute an A/B test ===============================================================================================================================================================

// Things to replace before live version
// tookTooLong name
// 3000 delay

const style = document.createElement('style');
style.textContent = `html.ab-test-loading { opacity: 0; }`;
document.head.appendChild(style);
document.documentElement.classList.add('ab-test-loading');

// Special test file =======================================================================================================================================================================================================

(function(){
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') {
    return;
  }

  _paq.push(['requireConsent']);
  (function () {
    _paq.push(["setTrackerUrl", "https://analytics.luxifer.app/matomo.php"]);
    _paq.push(['setSiteId', matomoLuxiSiteId]);
    var d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0];
    g.async = true; g.src = "https://analytics.luxifer.app/matomo.js";

    let shouldLoad = true;

    g.onload = () => {
      setTimeout(() => { 
        clearTimeout(timeout);
        if (!shouldLoad) return;
        loaded = true;
        const tests = [
          {
            name: "Test_royod",
            url: "https://chiukurt.github.io/",
            type: "simple_text",
            data: "AB Test alternate",
          },
        ];
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
                    document.documentElement.classList.remove("ab-test-loading");
                  },
                },
                {
                  name: "test",
                  activate: function (event) {
                    if (type === "simple_text") {
                      document.getElementById("ab-element").innerText = data;
                      document.documentElement.classList.remove("ab-test-loading");
                    }
                  },
                },
              ],
            },
          ]);
        });

      }, 3000); 
      
    };
    
    g.onerror = () => {
      clearTimeout(timeout);
      document.documentElement.classList.remove('ab-test-loading');
      shouldLoad = false;
    };

    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('ab-test-loading');
      shouldLoad = false;
    }, 5000); 

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
      g.async = true; g.src = 'https://analytics.luxifer.app/js/container_orKRLPJg.js?d=' + todayParam(); s.parentNode.insertBefore(g, s);
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
