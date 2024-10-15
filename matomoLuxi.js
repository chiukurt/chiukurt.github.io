var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var matomoLuxiStatsCode = "C0000";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
// (function () {
//   var script = document.createElement("script");
//   script.src =
//     "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.0.11/oneTrust.min.js";
//   script.crossOrigin = "anonymous";
//   script.async = true;
//   document.head.appendChild(script);
// })();
(function(){
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiStatsCode === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') {
    return;
  }

  _paq.push(['requireConsent']);
  (function () {
    _paq.push(['setTrackerUrl', 'https://northpnd.matomo.cloud/matomo.php']);
    _paq.push(['setSiteId', matomoLuxiSiteId]);
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true; g.src = 'https://cdn.matomo.cloud/northpnd.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g, s);
  })();

  var waitForTrackerCount = 0;
  function matomoWaitForTracker() {
    if (typeof _paq === 'undefined' || typeof OnetrustActiveGroups === 'undefined') {
      if (waitForTrackerCount < 40) {
        setTimeout(matomoWaitForTracker, 250);
        waitForTrackerCount++;
        return;
      }
    } else {
      window.addEventListener('OneTrustGroupsUpdated', function (e) {
        consentSet();
      });
    }
  }

  function consentSet() {
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

    function startMTM(){
      function todayParam() {
        const pad = (number) => (number < 10 ? '0' : '') + number;
        const today = new Date();
        return `${today.getUTCFullYear()}-${pad(today.getUTCMonth() + 1)}-${pad(today.getUTCDate())}`;
      }
      _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
      (function() {
        var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
        g.async = true; g.src = 'https://cdn.matomo.cloud/northpnd.matomo.cloud/container_orKRLPJg.js?d=' + todayParam(); s.parentNode.insertBefore(g, s);
      })();
    }

    function startTracking(){
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      startMTM();
    }

    const inSample = (inputNum) =>
      parseInt(inputNum, 10) <= parseInt(matomoLuxiSampleSize, 10);

    if (OnetrustActiveGroups.includes(matomoLuxiStatsCode)) {
      _paq.push(["setConsentGiven"]);
      _paq.push(["rememberConsentGiven"]);
      let luxiSample = getLuxiCookie("luxiSample");
      if (!luxiSample) {
        luxiSample = Math.floor(Math.random() * 100) + 1;
        setLuxiCookie("luxiSample", luxiSample);
      }
      if (inSample(luxiSample)) { 
        startTracking();
      }
    } else {
      _paq.push(["forgetConsentGiven"]);
      _paq.push(["deleteCookies"]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => matomoWaitForTracker());
  } else {
    matomoWaitForTracker();
  }
})();
