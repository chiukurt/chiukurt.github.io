
const style = document.createElement('style');
style.textContent = `html.ab-test-loading { opacity: 0; }`;
document.head.appendChild(style);

const tookTooLong = false;
document.documentElement.classList.add('ab-test-loading');

setTimeout(() => {
  document.documentElement.classList.remove('ab-test-loading');
  tookTooLong = true
}, 1000);

var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.2.02/default.min.js";
  // script.onload="document.documentElement.classList.remove('ab-test-loading')"
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


// bare minimum data to execute an A/B test
(function () {
    const tests = [
        {
            name: 'Test_royod',
            url: "https://chiukurt.github.io/",
            type: "simple_text",
            data: "AB Test alternate",
        }
    ];

    tests.forEach(test => {
        const { name, url, type, data } = test;
        _paq.push(['AbTesting::create', {
            name: name,
            includedTargets: [{"attribute":"url","type":"starts_with","value":url,"inverted":"0"}],
            excludedTargets: [],
            variations: [
                {
                    name: 'original',
                    activate: function (event) { }
                },
                {
                    name: 'test',
                    activate: function (event) {
                        if (type === "simple_text") { 
                            document.getElementById("ab-element").innerText = data;
                        }
                    }
                }            
            ]
          }]);
    });
})();
