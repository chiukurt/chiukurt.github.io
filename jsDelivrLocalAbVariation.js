
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
  
  function starTracking() {
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
      if (!name || !url || !replacements) return;
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
            { name: "original", activate: function (event) { } },
            {
              name: "test",
              activate: async function (event) {
                const ab = window.__LUMMMEN_AB__;
                if (typeof ab?.waitFor !== "function") return;
                if (typeof ab?.applyVariation !== "function") return;

                replacements.forEach((r) => {
                  ab.waitFor(r.selector).then((node) => {
                    if (node) ab.applyVariation(node, r);
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
  (function initLummmenAbGlobal() {
    if (window.__LUMMMEN_AB__) return;

    const _DateNow = Date.now.bind(Date);
    const _SetTimeout = window.setTimeout.bind(window);
    const _ClearTimeout = window.clearTimeout.bind(window);
    const _RAF = (window.requestAnimationFrame || function (cb) { return _SetTimeout(cb, 16); }).bind(window);

    const _MutationObserver = window.MutationObserver;
    const _Node = window.Node;
    const _NodeFilter = window.NodeFilter;

    const _DocumentQuerySelector = document.querySelector.bind(document);
    const _DocumentCreateElement = document.createElement.bind(document);
    const _DocumentCreateTreeWalker = document.createTreeWalker
      ? document.createTreeWalker.bind(document)
      : null;

    const _ElementReplaceChildren = Element.prototype.replaceChildren;
    const _NodeAppendChild = Node.prototype.appendChild;
    const _NodeCloneNode = Node.prototype.cloneNode;

    const _URL = window.URL;
    const _URLSearchParams = window.URLSearchParams;

    function inSegment(test) {
      const device = test && test.device;
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
    }

    const waitFor = (function createWaitFor() {
      const pendingBySelector = new Map();
      let observer = null;
      let ticking = false;
      let domReadyPromise = null;

      function whenDomReady() {
        if (document.body || document.documentElement) return Promise.resolve();
        if (domReadyPromise) return domReadyPromise;

        domReadyPromise = new Promise((resolve) => {
          const done = () => resolve();
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
        return topNode instanceof _Node ? topNode : null;
      }

      function ensureObserver() {
        if (observer) return true;
        const topNode = getTopNode();
        if (!topNode) return false;
        if (!_MutationObserver) return false;

        observer = new _MutationObserver(() => {
          if (ticking) return;
          ticking = true;
          _RAF(() => {
            ticking = false;
            flush();
          });
        });

        observer.observe(topNode, { childList: true, subtree: true });
        return true;
      }

      function stopObserverIfIdle() {
        if (pendingBySelector.size !== 0) return;
        if (!observer) return;
        observer.disconnect();
        observer = null;
      }

      function flush() {
        if (pendingBySelector.size === 0) {
          stopObserverIfIdle();
          return;
        }

        const selectors = Array.from(pendingBySelector.keys());
        for (const selector of selectors) {
          const waiters = pendingBySelector.get(selector);
          if (!waiters || waiters.length === 0) {
            pendingBySelector.delete(selector);
            continue;
          }

          const node = _DocumentQuerySelector(selector);
          if (!node) continue;

          pendingBySelector.delete(selector);
          for (const w of waiters) {
            if (w.timeoutId) _ClearTimeout(w.timeoutId);
            w.resolve(node);
          }
        }

        stopObserverIfIdle();
      }

      return function waitForElm(selector, options) {
        const opts = options || {};
        const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 300;

        return new Promise((resolve) => {
          if (!selector || typeof selector !== "string") return resolve(null);

          const existing = _DocumentQuerySelector(selector);
          if (existing) return resolve(existing);

          if (!getTopNode()) {
            whenDomReady().then(() => {
              const nowExisting = _DocumentQuerySelector(selector);
              if (nowExisting) return resolve(nowExisting);
              if (!ensureObserver()) return resolve(null);

              const waiter = { resolve, start: _DateNow(), timeoutMs, timeoutId: undefined };

              if (timeoutMs > 0) {
                waiter.timeoutId = _SetTimeout(() => {
                  const list = pendingBySelector.get(selector);
                  if (list) {
                    const idx = list.indexOf(waiter);
                    if (idx >= 0) list.splice(idx, 1);
                    if (list.length === 0) pendingBySelector.delete(selector);
                  }
                  stopObserverIfIdle();
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

          if (!ensureObserver()) return resolve(null);

          const waiter = { resolve, start: _DateNow(), timeoutMs, timeoutId: undefined };

          if (timeoutMs > 0) {
            waiter.timeoutId = _SetTimeout(() => {
              const list = pendingBySelector.get(selector);
              if (list) {
                const idx = list.indexOf(waiter);
                if (idx >= 0) list.splice(idx, 1);
                if (list.length === 0) pendingBySelector.delete(selector);
              }
              stopObserverIfIdle();
              resolve(null);
            }, timeoutMs);
          }

          const list = pendingBySelector.get(selector);
          if (list) list.push(waiter);
          else pendingBySelector.set(selector, [waiter]);

          flush();
        });
      };
    })();

    function sanitizeToFragment(html, bannedHostTags) {
      if (typeof html !== "string") return null;

      const banned = bannedHostTags instanceof Set ? bannedHostTags : new Set();
      const urlBearing = [
        "style",
        "href",
        "src",
        "xlink:href",
        "formaction",
        "srcset",
        "poster",
        "action",
        "srcdoc",
        "target",
        "download",
      ];

      const tpl = _DocumentCreateElement("template");
      tpl.innerHTML = html;

      if (!_DocumentCreateTreeWalker) return null;
      const walker = _DocumentCreateTreeWalker(tpl.content, _NodeFilter.SHOW_ELEMENT, null);

      while (walker.nextNode()) {
        const el = walker.currentNode;
        const tag = (el.tagName || "").toLowerCase();
        if (banned.has(tag)) return null;

        for (const attr of Array.from(el.attributes)) {
          const name = attr.name.toLowerCase();
          const value = (attr.value || "").trim();

          if (name.startsWith("on")) return null;
          if (urlBearing.includes(name)) return null;
          if (name !== "class") return null;
          if (!/^[a-z0-9_\-\s]+$/i.test(value)) return null;
        }
      }

      return tpl.content;
    }

    function sanitizeStyleObject(styleObj) {
      if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) return null;

      const out = {};
      const bannedProps = ["background", "background-image", "filter", "mask", "content", "cursor"];
      const isSafeProp = (prop) =>
        typeof prop === "string" &&
        /^[a-z][a-z0-9-]*$/i.test(prop) &&
        !/^--/i.test(prop) &&
        !/^behavior$/i.test(prop) &&
        !bannedProps.includes(prop.toLowerCase());

      const normalizeCssValueForScan = (input) => {
        const s = String(input);
        const noComments = s.replace(/\/\*[\s\S]*?\*\//g, "");
        const deEscaped = noComments.replace(/\\\s*/g, "");
        const collapsed = deEscaped.replace(/\s+/g, "");
        return collapsed.toLowerCase();
      };

      const isSafeValue = (val) => {
        if (val === null || val === undefined) return false;
        const raw = String(val).trim();
        if (!raw) return false;
        if (/[<>"'`;\\]/.test(raw)) return false;
        const scan = normalizeCssValueForScan(raw);
        if (scan.includes("expression(")) return false;
        if (scan.includes("javascript:")) return false;
        if (scan.includes("vbscript:")) return false;
        if (scan.includes("data:")) return false;
        if (scan.includes("@import")) return false;
        if (scan.includes("url(")) return false;
        return true;
      };

      for (const [rawProp, rawVal] of Object.entries(styleObj)) {
        if (!isSafeProp(rawProp)) continue;
        if (!isSafeValue(rawVal)) continue;
        out[rawProp] = String(rawVal).trim();
      }

      return out;
    }

    async function applyVariation(node, replacement) {
      if (!node) return;
      if (!replacement || typeof replacement !== "object") return;

      const tag = (node.tagName || "").toLowerCase();
      const hasHtml = replacement.htmlReplacement !== undefined;
      const hasStyle = replacement.style !== undefined;
      const hasText = replacement.textContent !== undefined;
      const hasPlaceholder = replacement.placeholder !== undefined;
      const hasSrc = replacement.src !== undefined;

      let sanitizedFrag = null;
      let sanitizedStyle = null;

      if (hasHtml) {
        const bannedHostTags = new Set(["a", "input", "textarea", "button", "img"]);
        if (bannedHostTags.has(tag)) return;
        sanitizedFrag = sanitizeToFragment(replacement.htmlReplacement, bannedHostTags);
        if (!sanitizedFrag) return;
      }

      if (hasSrc) {
        if (tag !== "img") return;
        if (typeof replacement.src !== "string") return;
        const src = replacement.src.trim();
        if (!src) return;
        const lower = src.toLowerCase();
        if (lower.startsWith("javascript:")) return;
        if (lower.startsWith("data:")) return;
        try {
          const url = new _URL(src, window.location.origin);
          if (
            url.origin !== "https://firebasestorage.googleapis.com" ||
            !url.pathname.startsWith("/v0/b/ux-pro.appspot.com/o/publicAbTests")
          ) return;
        } catch {
          return;
        }
      }

      if (hasStyle) {
        sanitizedStyle = sanitizeStyleObject(replacement.style);
        if (!sanitizedStyle || Object.keys(sanitizedStyle).length === 0) return;
      }

      if (hasPlaceholder) {
        if (typeof replacement.placeholder !== "string") return;
        if (!["input", "textarea"].includes(tag)) return;
      }

      if (hasText) {
        if (typeof replacement.textContent !== "string" && typeof replacement.textContent !== "number") return;
      }

      if (hasHtml) {
        if (typeof _ElementReplaceChildren === "function") {
          _ElementReplaceChildren.call(node);
        } else {
          while (node.firstChild) node.removeChild(node.firstChild);
        }
        _NodeAppendChild.call(node, _NodeCloneNode.call(sanitizedFrag, true));
      }

      if (hasStyle) Object.assign(node.style, sanitizedStyle);
      if (hasText) node.textContent = replacement.textContent;
      if (hasPlaceholder) node.placeholder = replacement.placeholder;
      if (hasSrc) node.src = replacement.src.trim();
    }

    const api = Object.freeze({
      inSegment,
      waitFor,
      applyVariation,
    });

    Object.defineProperty(window, "__LUMMMEN_AB__", {
      value: api,
      writable: false,
      configurable: false,
      enumerable: false,
    });
  })();

  const getLuxiCookie = n => ((v = `; ${document.cookie}`.split(`; ${n}=`)) && v.length === 2 ? v.pop().split(';').shift() : undefined);
  const setLuxiCookie = (n, v) => document.cookie = `${n}=${v};expires=${new Date(Date.now() + 365*24*60*60*1000).toUTCString()};path=/`;
  const inSample = (inputNum) => parseInt(inputNum, 10) <= parseInt(matomoLuxiSampleSize, 10);
  const luxiferAnalytics = "https://luxifer-analytics-cdn-fcbkengwhub0fdd9.z01.azurefd.net";
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') return;

  window.__LUMMMEN__.when("tests").then((data) => {
    try {
      ["preview", "permanent"].forEach(type => {
        const items = data?.[type];
        if (!items) return;
        (Array.isArray(items) ? items : [items]).forEach(t => {
          (t.replacements || []).forEach(r => {
            window.__LUMMMEN_AB__.waitFor(r.selector).then(node => {
              if (node) window.__LUMMMEN_AB__.applyVariation(node, r);
            });
          });
        });
      });
    } catch {
      if (typeof lummmenShowPage === "function") lummmenShowPage();
    }
  });

  window.__LUMMMEN__.ready.then((data) => {
    try {
      if (data?.tests?.ongoing) startAbTesting(data.tests.ongoing);
    } catch {
      if (typeof lummmenShowPage === "function") lummmenShowPage();
    }
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
    starTracking();
  }
})();
