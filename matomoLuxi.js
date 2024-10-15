var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var matomoLuxiStatsCode = "C0000";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
(function () {
  var script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.0.12/oneTrust.min.js";
  script.crossOrigin = "anonymous";
  script.async = true;
  document.head.appendChild(script);
})();


//Below is script to simulate a fake OneTrust implementation
(function () { 
  function fakeOneTrustInit() {
    window.OnetrustActiveGroups = ["C0000"];
    setTimeout(fakeOneTrustUpdate, 500);
  }

  function fakeOneTrustRemove() {
    window.OnetrustActiveGroups = [];
    setTimeout(fakeOneTrustUpdate, 500);
  }

  function fakeOneTrustUpdate() {
    var event = new CustomEvent("OneTrustGroupsUpdated", {
        detail: {
            updatedGroups: OnetrustActiveGroups,
        },
    });
    window.dispatchEvent(event);
  }
  
  var name = "statsCode=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0 && c.substring(name.length, c.length) === "C0000") {
        fakeOneTrustInit();
        fakeOneTrustUpdate();
      }
  }
})();