
// ABTEST ==============================================================================================================
var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
// var _mtm = window._mtm = window._mtm || [];
// var _paq = window._paq = window._paq || [];
// var shouldLuxiAbTest = true;
// document.documentElement.classList.add('luxi-ab-test-loading');
// document.head.innerHTML += '<style>html.luxi-ab-test-loading{opacity:0}</style>';
// var removeLuxiLoadingClass = () => document.documentElement.classList.remove("luxi-ab-test-loading");
// var luxiAutoTimeout = setTimeout(() => {
//   removeLuxiLoadingClass();
//   if (!new URLSearchParams(window.location.search).has('pk_ab_test')) shouldLuxiAbTest = false;
// }, 500);
// (function() {
//   var script = document.createElement('script');
//   script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.3.01/abtest.min.js";
//   script.integrity = "sha384-+bUq7ecXBASRJS4Zn1KW1G67ehvfDo2by/ckama+veKn+g/zVPAmim+/bqa75ixv";
//   script.crossOrigin = "anonymous";
//   script.async = true;
//   document.head.appendChild(script);
// })();


// DEFAULT =============================================================================================================
  // var _mtm = window._mtm = window._mtm || [];
  // var _paq = window._paq = window._paq || [];
  // _paq.push(['MediaAnalytics.disableTrackEvents']);
  // _paq.push(['HeatmapSessionRecording::disable'])
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
//   g.async=true; g.src='https://analytics.luxifer.app/js/container_1jnfkkvV.js?d=' + todayParam(); s.parentNode.insertBefore(g, s);
// })();

// =====================================================================================================================

