
(async function () {
  function startMtm(){
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

  function normalizeUrl(u) {
    try {
      var parsed = new URL(u, window.location.origin);
      var params = new URLSearchParams(parsed.search);
      params.delete('pk_ab_test');
      var sortedParams = new URLSearchParams();
      Array.from(params.keys()).sort().forEach(key => {
        sortedParams.set(key, params.get(key));
      });
      return parsed.pathname + (sortedParams.toString() ? '?' + sortedParams.toString() : '');
    } catch (e) {
      return u;
    }
  }
  
  function startracking(){
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    startMatomo()
    startMtm();
  }

  function startMatomo() {
    if (!matomoLuxiSampleSize || !matomoLuxiSiteId) return;
    _paq.push(["setTrackerUrl", `${luxiferAnalytics}/matomo.php`]);
    _paq.push(['setSiteId', matomoLuxiSiteId]);
    var d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0];
    g.async = true; g.src = `${luxiferAnalytics}/matomo.js`;
    s.parentNode.insertBefore(g, s);
    g.onload = () => { window.__LUMMMEN__.markReady("analytics", 200) };
  }

  function startAbTest(tests) { 
    if (!tests || !Array.isArray(tests)) return;
    tests.forEach((test) => {
      var { name, url, type, data, selector, device } = test;
      var currentUrl = normalizeUrl(window.location.pathname + window.location.search);
      var testUrl = normalizeUrl(url);
      if (currentUrl !== testUrl) return;
      _paq.push(["AbTesting::create", {
          name: name ?? "Unknown",
          trigger: () => {
            return typeof window.__LUMMMEN__?.inSegment === "function" && window.__LUMMMEN__.inSegment(test);
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
                const helper = window.__LUMMMEN__;
                if (typeof helper?.waitForElm !== "function") return;
                if (typeof helper?.inSegment !== "function") return;
                helper.waitForElm(selector).then((node) => { 
                  if (node) helper.applyVariation(node);
                });
              },
            },
          ],
        },
      ]);
    });
  }

  if (!window.__LUMMMEN__) return;
  window.__LUMMMEN__.inSegment = function (test) {
    const device = test.device;
    try {
      const uad = navigator.userAgentData;
      const ua = navigator.userAgent || "";
      const hasiPadOs = (uad && uad.platform === "MacIntel") || (!uad && /\bMacintosh\b/.test(ua));
      const isiPad = /\biPad\b/.test(ua) || (hasiPadOs && (navigator.maxTouchPoints || 0) > 1);
      const isAndroid = /\bAndroid\b/i.test(ua);
      const isAndroidTablet = isAndroid && !/\bMobile\b/i.test(ua);
      const isOtherTablet = /\b(Tablet|PlayBook|Silk|Kindle|Nexus 7|Nexus 10|SM-T)\b/i.test(ua);
      const isTablet = isiPad || isAndroidTablet || isOtherTablet;
      const isMobile = uad?.mobile || (!isTablet && /\b(Mobile|iPhone|iPod)\b/i.test(ua));
      const d = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
      return d === device;
    } catch (e) {
      return false;
    }
  };

  
  // TODO: Replace with system that only sets up one observer due to performance concerns
  window.__LUMMMEN__.waitForElm = async function waitForElm(selector) {
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

  // TODO: Add guards/validation for high risk items
  window.__LUMMMEN__.applyVariation = async function applyVariation(replacement) {
    const node = await window.__LUMMMEN__.waitForElm(replacement.selector);
    if (!node) return;
    if (replacement.style) Object.assign(node.style, replacement.style);
    if (replacement.textContent !== undefined) node.textContent = replacement.textContent;
    if (replacement.htmlReplacement !== undefined) node.innerHTML = replacement.htmlReplacement;
    if (replacement.placeholder !== undefined) node.placeholder = replacement.placeholder;
    if (replacement.src !== undefined) node.src = replacement.src;
  }

  const getLuxiCookie = n => ((v = `; ${document.cookie}`.split(`; ${n}=`)) && v.length === 2 ? v.pop().split(';').shift() : undefined);
  const setLuxiCookie = (n, v) => document.cookie = `${n}=${v};expires=${new Date(Date.now() + 365*24*60*60*1000).toUTCString()};path=/`;
  const inSample = (inputNum) => parseInt(inputNum, 10) <= parseInt(matomoLuxiSampleSize, 10);
  const luxiferAnalytics = "https://luxifer-analytics-cdn-fcbkengwhub0fdd9.z01.azurefd.net";
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') return;

  // Apply previews and winners
  window.__LUMMMEN__.when("tests").then((data) => {
    try { if (data) console.log("tests",data);//startAbTest(data.tests);
    } catch { lummmenShowPage(); }
  });

  window.__LUMMMEN__.ready.then((data) => {
    if (new URLSearchParams(location.search).get("lummmen-ab-preview")) return; // Abort matomo if in preview mode
    try { if (data) console.log("full", data);//startAbTest(data.tests);
    } catch { lummmenShowPage(); }
  });

  _paq.push(['requireConsent']);  
  
  var luxiSample = getLuxiCookie("luxiSample");
  if (!luxiSample) {
    luxiSample = Math.floor(Math.random() * 100) + 1;
    setLuxiCookie("luxiSample", luxiSample);
  }
  if (inSample(luxiSample)) { 
    _paq.push(["setConsentGiven"]);
    _paq.push(["rememberConsentGiven"]);
    startracking();
  }
})();
