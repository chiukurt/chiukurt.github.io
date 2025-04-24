var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.2.02/default.min.js";
  script.integrity = "sha384-aIRAMkKxsFX6tOA6PFhqe85yPRXNadvhxK+X5tGYVLHHrwXdvTU9ma0mio9T+3jZ";
  script.crossOrigin = "anonymous";
  script.async = true;
  document.head.appendChild(script);
})();

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


const code = ```
_paq.push(['AbTesting::create', {
  name: 'Test_royod',
  includedTargets: [{"attribute":"url","type":"starts_with","value":"https://chiukurt.github.io/","inverted":"0"}],
  excludedTargets: [],
  variations: [
      {
          name: 'original',
          activate: function (event) { }
      },
      {
          name: 'test',
          activate: function(event) {
            document.getElementById("ab-element").innerText = "AB Test alternate";
          }
      }            
  ]
}]);```;

const execute = new Function(code)();
