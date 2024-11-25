// var matomoLuxiSiteId = "5";
// var matomoLuxiSampleSize = "100";
// var matomoLuxiStatsCode = "C0000";
// var _mtm = window._mtm = window._mtm || [];
// var _paq = window._paq = window._paq || [];
// (function () {
//   var script = document.createElement("script");
//   script.src =
//     "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.0.12/oneTrust.min.js";
//   script.crossOrigin = "anonymous";
//   script.async = true;
//   document.head.appendChild(script);
// })();

// //Below is script to simulate a fake OneTrust implementation (automatic)
// (function () {
//   var name = "statsCode=";
//   var decodedCookie = decodeURIComponent(document.cookie);
//   var ca = decodedCookie.split(';');
//   for (var i = 0; i < ca.length; i++) {
//       var c = ca[i];
//       while (c.charAt(0) == ' ') {
//           c = c.substring(1);
//       }
//       if (c.indexOf(name) == 0 && c.substring(name.length, c.length) === "C0000") {
//         fakeOneTrustInit();
//         fakeOneTrustUpdate();
//       }
//   }
// })();

// //Below is script to simulate a fake OneTrust implementation (user inputs)
// function fakeOneTrustInit() {
//   window.OnetrustActiveGroups = ["C0000"];
//   setTimeout(fakeOneTrustUpdate, 500);
// }

// function fakeOneTrustRemove() {
//   window.OnetrustActiveGroups = [];
//   setTimeout(fakeOneTrustUpdate, 500);
// }

// function fakeOneTrustUpdate() {
//   var event = new CustomEvent("OneTrustGroupsUpdated", {
//       detail: {
//           updatedGroups: OnetrustActiveGroups,
//       },
//   });
//   window.dispatchEvent(event);
// }

var _paq = (window._paq = window._paq || []);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "//analytics.luxifer.app/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "1"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = u + "matomo.js";
  s.parentNode.insertBefore(g, s);
})();


var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
(function() {
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src='https://analytics.luxifer.app/js/container_GLkS5pMb.js'; s.parentNode.insertBefore(g,s);
})();
