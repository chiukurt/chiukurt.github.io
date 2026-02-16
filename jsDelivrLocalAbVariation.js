
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
  
  function startracking() {
    console.log("tracking started");
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

  function startAbTesting(testObjects) { 
    if (!testObjects)  return;
    let tests;
    if (typeof testObjects === "object" && testObjects !== null) tests = Object.values(testObjects);
    if (!Array.isArray(tests) || tests.length === 0) return;
    tests.forEach((test) => {
      var { name, url, replacements } = test;
      console.log("testing...: ", test);
      if (!name || !url || !replacements) return;
      var currentUrl = normalizeUrl(window.location.pathname + window.location.search);
      var testUrl = normalizeUrl(url);
      if (currentUrl !== testUrl) return;
      _paq.push(["AbTesting::create", {
          name: name ?? "Unknown",
          trigger: () => {
            console.log("segment: ", typeof window.__LUMMMEN__?.inSegment === "function" && window.__LUMMMEN__.inSegment(test));
              return typeof window.__LUMMMEN__?.inSegment === "function" && window.__LUMMMEN__.inSegment(test);
          },
          includedTargets: [{ attribute: "url", type: "equals_exactly", value: url, inverted: "0" }],
          excludedTargets: [],
          variations: [
            {
              name: "original",
              activate: function (event) {
                console.log("original");
              },
            },
            {
              name: "test",
              activate: async function (event) {
                                console.log("testing more...." , test);
                const helper = window.__LUMMMEN__;
                if (typeof helper?.waitForElm !== "function") return;
                if (typeof helper?.inSegment !== "function") return;
                console.log("test");
                replacements.forEach((r) => {
                  helper.waitForElm(r.selector).then((node) => { 
                    if (node) helper.applyVariation(node, r);
                  });
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

  window.__LUMMMEN__.__waitForElmHub = window.__LUMMMEN__.__waitForElmHub || (function () {
    const pendingBySelector = new Map();

    let observer = null;
    let ticking = false;
    let domReadyPromise = null;

    function whenDomReady() {
      console.log("[waitForElmHub] whenDomReady called");
      if (document.body || document.documentElement) {
        console.log("[waitForElmHub] DOM ready immediately");
        return Promise.resolve();
      }
      if (domReadyPromise) {
        console.log("[waitForElmHub] domReadyPromise already exists");
        return domReadyPromise;
      }
      domReadyPromise = new Promise((resolve) => {
        const done = () => {
          console.log("[waitForElmHub] DOMContentLoaded event fired");
          resolve();
        };
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", done, { once: true });
        } else {
          done();
        }
      });
      return domReadyPromise;
    }

    function getTopNode() {
      const topNode = document.body || document.documentElement;
      console.log("[waitForElmHub] getTopNode:", topNode);
      return topNode instanceof Node ? topNode : null;
    }

    function ensureObserver() {
      if (observer) {
        console.log("[waitForElmHub] Observer already exists");
        return true;
      }
      const topNode = getTopNode();
      if (!topNode) {
        console.log("[waitForElmHub] No top node found for observer");
        return false;
      }

      observer = new MutationObserver(() => {
        if (ticking) return;
        ticking = true;
        (window.requestAnimationFrame || window.setTimeout)(() => {
          ticking = false;
          flush();
        }, 16);
      });

      observer.observe(topNode, { childList: true, subtree: true });
      console.log("[waitForElmHub] Observer attached");
      return true;
    }

    function stopObserverIfIdle() {
      if (pendingBySelector.size !== 0) return;
      if (!observer) return;
      observer.disconnect();
      observer = null;
      console.log("[waitForElmHub] Observer disconnected");
    }

    function flush() {
      console.log("[waitForElmHub] flush called, pendingBySelector.size:", pendingBySelector.size);
      if (pendingBySelector.size === 0) {
        stopObserverIfIdle();
        return;
      }

      const selectors = Array.from(pendingBySelector.keys());
      for (const selector of selectors) {
        const waiters = pendingBySelector.get(selector);
        console.log("[waitForElmHub] flush selector:", selector, "waiters:", waiters);
        if (!waiters || waiters.length === 0) {
          pendingBySelector.delete(selector);
          continue;
        }

        const node = document.querySelector(selector);
        console.log("[waitForElmHub] flush querySelector:", selector, "node:", node);
        if (!node) continue;

        pendingBySelector.delete(selector);
        for (const w of waiters) {
          if (w.timeoutId) clearTimeout(w.timeoutId);
          w.resolve(node);
        }
      }

      stopObserverIfIdle();
    }

    function waitForElm(selector, options) {
      const opts = options || {};
      const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 300;

      console.log("[waitForElmHub] waitForElm called:", selector, opts);

      return new Promise((resolve, reject) => {
        if (!selector || typeof selector !== "string") {
          console.log("[waitForElmHub] Invalid selector:", selector);
          return resolve(null);
        }

        const existing = document.querySelector(selector);
        console.log("[waitForElmHub] waitForElm querySelector:", selector, "existing:", existing);
        if (existing) return resolve(existing);

        // If body/html isn't available yet, wait for DOM ready then retry.
        if (!getTopNode()) {
          console.log("[waitForElmHub] No top node, waiting for DOM ready");
          whenDomReady().then(() => {
            const nowExisting = document.querySelector(selector);
            console.log("[waitForElmHub] DOM ready, querySelector:", selector, "nowExisting:", nowExisting);
            if (nowExisting) return resolve(nowExisting);
            if (!ensureObserver()) {
              console.log("[waitForElmHub] Failed to ensure observer after DOM ready");
              return resolve(null);
            }

            // Register waiter after DOM is ready (so observer can attach)
            const waiter = { resolve, reject, start: Date.now(), timeoutMs, timeoutId: undefined };

            if (timeoutMs > 0) {
              waiter.timeoutId = window.setTimeout(() => {
                const list = pendingBySelector.get(selector);
                if (list) {
                  const idx = list.indexOf(waiter);
                  if (idx >= 0) list.splice(idx, 1);
                  if (list.length === 0) pendingBySelector.delete(selector);
                }
                stopObserverIfIdle();
                console.log("[waitForElmHub] Timeout reached for selector:", selector);
                resolve(null);
              }, timeoutMs);
            }

            const list = pendingBySelector.get(selector);
            if (list) list.push(waiter);
            else pendingBySelector.set(selector, [waiter]);

            flush();
          });

          return;
        }

        if (!ensureObserver()) {
          console.log("[waitForElmHub] Failed to ensure observer");
          return resolve(null);
        }

        const waiter = {
          resolve,
          reject,
          start: Date.now(),
          timeoutMs,
          timeoutId: undefined,
        };

        if (timeoutMs > 0) {
          waiter.timeoutId = window.setTimeout(() => {
            const list = pendingBySelector.get(selector);
            if (list) {
              const idx = list.indexOf(waiter);
              if (idx >= 0) list.splice(idx, 1);
              if (list.length === 0) pendingBySelector.delete(selector);
            }
            stopObserverIfIdle();
            console.log("[waitForElmHub] Timeout reached for selector:", selector);
            resolve(null);
          }, timeoutMs);
        }

        const list = pendingBySelector.get(selector);
        if (list) list.push(waiter);
        else pendingBySelector.set(selector, [waiter]);

        flush();
      });
    }

    return { waitForElm, flush };
  })();

  window.__LUMMMEN__.waitForElm = async function waitForElm(selector, options) {
    return window.__LUMMMEN__.__waitForElmHub.waitForElm(selector, options);
  };

  // TODO: Add guards/validation for high risk items
  window.__LUMMMEN__.applyVariation = async function applyVariation(node, replacement) {
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
    console.log("t: ", data)
    try {
      if (data?.preview) {
        data.preview.replacements.forEach((r) => {
          window.__LUMMMEN__.waitForElm(r.selector).then((node) => { 
            if (node) window.__LUMMMEN__.applyVariation(node, r);
          });
        });
      }

      if (data?.permanent) {
        data.permanent.forEach((t) => {
          t.replacements.forEach((r) => {
            window.__LUMMMEN__.waitForElm(r.selector).then((node) => { 
              if (node) window.__LUMMMEN__.applyVariation(node, r);
            });
          });
        });
      }
    } catch { lummmenShowPage(); }
  });

  window.__LUMMMEN__.ready.then((data) => {
    console.log("r: ", data);
    try {
      if (data?.tests?.ongoing) startAbTesting(data.tests.ongoing);
    } catch { lummmenShowPage(); }
  });

  _paq.push(['requireConsent']);  
  
  var luxiSample = getLuxiCookie("luxiSample");
  if (!luxiSample) {
    luxiSample = Math.floor(Math.random() * 100) + 1;
    setLuxiCookie("luxiSample", luxiSample);
  }
  if (inSample(luxiSample) && !new URLSearchParams(location.search).has('lummmen-ab-preview')) { 
    _paq.push(["setConsentGiven"]);
    _paq.push(["rememberConsentGiven"]);
    startracking();
  }
})();
