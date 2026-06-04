var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
// (async function () {
//   document.documentElement.classList.add('lummmen-ab-test-loading');
//   document.head.innerHTML += '<style>html.lummmen-ab-test-loading{opacity:0 !important;}</style>';
//   const lummmenAbSource = "https://getabtestseu-573194387152.europe-west1.run.app";
//   const lummmenShowPage = () => {
//     window.__LUMMMEN_TOO_LATE__ = true;
//     document.documentElement.classList.remove("lummmen-ab-test-loading");
//   };
//   const REQUIRED = new Set(["tests", "analytics"]), store = {}, loaded = new Set(), resolvers = {}, keyPromises = {};
//   REQUIRED.forEach(k => keyPromises[k] = new Promise(resolve => resolvers[k] = resolve));
//   let resolveAll;
//   const allReady = new Promise(resolve => resolveAll = resolve);
//   const markReady = (k, v) => {
//     if (!REQUIRED.has(k) || loaded.has(k)) return;
//     store[k] = v; loaded.add(k); resolvers[k](v);
//     if (loaded.size === REQUIRED.size) resolveAll(store);
//   };
//   window.__LUMMMEN__ = { markReady, ready: allReady, when: k => keyPromises[k], get: k => store[k] };
//   (async () => {
//       const previewId = new URLSearchParams(location.search).get("lummmen-ab-preview");
//       const cacheKey = "lummmen-ab-tests";
//       let tests;
//       if (previewId) {
//         tests = await fetch(lummmenAbSource, {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idSite: matomoLuxiSiteId, previewId })
//         }).then(r => r.json(), () => []);
//         sessionStorage.setItem(cacheKey, JSON.stringify(tests));
//       } else {
//         const cached = sessionStorage.getItem(cacheKey);
//         if (cached) {
//           tests = JSON.parse(cached);
//         } else {
//           tests = await fetch(lummmenAbSource, {
//             method: "POST", headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ idSite: matomoLuxiSiteId })
//           }).then(r => r.json(), () => []);
//           sessionStorage.setItem(cacheKey, JSON.stringify(tests));
//         }
//       }
//       window.__LUMMMEN__.markReady("tests", tests);
//   })();
//   setTimeout(lummmenShowPage, 400);
//   (function() {
//     var script = document.createElement('script');
//     script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.5.00/abtest.min.js";
//     script.integrity = "sha384-PBYjGClXI08Pgco2+fhMGu1MxCitOXCvxQFjhbZ9pJi99tzIJNUWBgoD9Gvvg/rp";
//     script.crossOrigin = "anonymous";
//     script.async = true;
//     document.head.appendChild(script);
//   })();
// })();

// DEFAULT =============================================================================================================
// var _mtm = window._mtm = window._mtm || [];
// var _paq = window._paq = window._paq || [];
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
//   g.async=true; g.src='https://analytics.luxifer.app/js/container_t9d5lGU5.js?d=' + todayParam(); s.parentNode.insertBefore(g, s);
// })();

// FAKE DEFAULT =============================================================================================================

(function(){
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') {
    return;
  }

  _paq.push(['requireConsent']);
  (function () {
    _paq.push(["setTrackerUrl", "https://analytics.luxifer.app/matomo.php"]);
    _paq.push(['setSiteId', matomoLuxiSiteId]);
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true; g.src = 'https://analytics.luxifer.app/matomo.js'; s.parentNode.insertBefore(g, s);
  })();

  function startMTM(){
    return;
  }

  function startTracking(){
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    console.log(_paq);
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

// FAKE DEFAULT =============================================================================================================

const LummmenAnalyticsBus = (() => {
  console.log("init bus");
  const buffers = new Map();
  let flushing = false;
  let timer = null;

  const MAX_BEACON_BYTES = 32 * 1024;
  const FLUSH_INTERVAL_MS = 60000;
  const PAYLOAD_ENDPOINT = "https://europe-west1-ux-pro.cloudfunctions.net/processLuxiferDataEU";

  const encoder = new TextEncoder();

  function push(stream, evt) {
    let q = buffers.get(stream);
    if (!q) buffers.set(stream, q = []);
    q.push(evt);
    schedule();
  }

  function serializeOnce(header = {}) {
    const headerStr = JSON.stringify(header);
    let bytes = encoder.encode(headerStr).byteLength + 9;

    const out = {}; 

    for (const [stream, q] of buffers) {
      if (!out[stream]) out[stream] = [];
      while (q.length) {
        const event = q[0];
        const eventStr = JSON.stringify(event);
        const sz = encoder.encode(eventStr).byteLength + 3;
        if (bytes + sz > MAX_BEACON_BYTES) {
          return JSON.stringify({ h: header, d: out });
        }
        out[stream].push(event);
        bytes += sz;
        q.shift();
      }
      if (q.length === 0) buffers.delete(stream);
    }

    return { ...header, ...out };
  }

  function testReturn(input) {
    console.log(input);
  }

  function flush() {
    console.log("Flush attempt");
    window._paq = window._paq || [];
    var _paq = window._paq;

    _paq.push([function () {
      try {
        if (flushing) return testReturn("Already flushing");
        flushing = true;
        const pageViewId = this.getPageViewId();
        const visitorId = this.getVisitorId();
        const url = this.getCurrentUrl();
        if (!visitorId || !url) return testReturn("Missing visitorId or url");

        const screen = {
          w: document.documentElement.scrollWidth,
          h: document.documentElement.scrollHeight,
        };

        const header = {
          siteId: matomoLuxiSiteId,
          visitorId,
          pageViewId,
          url,
          screen,
          timestamp: Date.now(),
        };

        const p = serializeOnce(header);
        if (!p) return testReturn("No data to flush");
        if (!p.click && !p.move && !p.hesitation && !p.frustration && !p.deadClick && !p.scroll) return testReturn("No events to send");

        // navigator.sendBeacon(PAYLOAD_ENDPOINT, JSON.stringify(p));
        console.log("Flushing Luxi data:", p);
      } catch (_) { } finally {
        flushing = false;
      }
    }]);
  }

  function schedule() {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      flush();
      if (size() > 2000) schedule();
    }, FLUSH_INTERVAL_MS);
  }

  function size() {
    let n = 0;
    for (const q of buffers.values()) n += q.length;
    return n;
  }

  const send = () => { try { flush(); } catch {} };
  const isWebKit = (!!window.safari) || (/AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium/.test(navigator.userAgent));
  const opts = { capture: true, once: true };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') send();
  }, opts);

  addEventListener('pagehide', () => { send(); }, opts);
  addEventListener('freeze', () => { send(); }, opts);
  if (isWebKit) addEventListener('beforeunload', () => { send(); }, opts);

  return { push, flush, size };
})();

function pushLummmenCtData(event) {
  function getLuxiElementDetails(element) {
    const identifier = {};
    if (element.id) {
        identifier.id = element.id;
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (label) identifier.label = label.textContent.trim();
    }
    if (element.className) identifier.className = element.className;
    if (element.tagName) identifier.tagName = element.tagName.toLowerCase();
    if (element.textContent?.trim()) identifier.textContent = element.textContent.trim();
    if (element.getAttribute("data-key")) identifier.dataKey = element.getAttribute("data-key");
    if (element.getAttribute("aria-label")) identifier.ariaLabel = element.getAttribute("aria-label");
    ["name", "role", "href", "onclick", "placeholder", "type"].forEach(attr => {
      const val = element.getAttribute(attr);
      if (val) identifier[attr] = val;
    });
    return identifier;
  }

  function getLuxiInteractiveElement(element) {
    if (!element) return null;

    const interactiveRoles = new Set(["button", "link", "menuitem", "checkbox", "radio", "switch"]);
    const interactiveTags = new Set(["button", "a", "input", "textarea", "select", "label", "option"]);

    function checkElement(el) {
      if (!el) return false;

      const tagName = el.tagName?.toLowerCase();
      const role = el.getAttribute?.("role");
      const hasTabIndex = el.hasAttribute?.("tabindex") && parseInt(el.getAttribute("tabindex")) >= 0;
      
      if (
        interactiveTags.has(tagName) || interactiveRoles.has(role) ||
        el.hasAttribute?.("onclick") || el.hasAttribute?.("onkeypress") ||
        typeof el.onclick === 'function' || hasTabIndex
      ) {
          return el;
      } else if (getComputedStyle(el).cursor === "pointer") {
          return checkElement(el.parentElement);
      }

      return null;
    }

    return checkElement(element);
  }

  if (typeof matomoLuxiSiteId === 'undefined') return;
  const el = getLuxiInteractiveElement(event.target);
  if (!LummmenAnalyticsBus) return;
  const now = Date.now();
  const prevHoverTime = LummmenCtData.lastHoverTime || false;
  const prevClickTime = LummmenCtData.lastClickTime || false;
  const didClickElement = LummmenCtData.lastClickElement === el
  const isRapidClick = (prevClickTime & (now - prevClickTime < 3000));
  const isShortHover = (!prevHoverTime || (now - prevHoverTime < 500));
  var activity = "click";

  if (event.type === "click") {
    LummmenCtData.lastClickTime = now;
    LummmenCtData.lastClickElement = el;
    if (didClickElement && isRapidClick) activity = "frustration";
  } else if (event.type === "mouseout") {
    LummmenCtData.lastHoverTime = now;
    activity = "hesitation";
    if (didClickElement || isShortHover) return;
  } else return;
  
  const x = event.pageX;
  const y = event.pageY;
  
  if (el) {
    LummmenAnalyticsBus.push(activity, {
      element: getLuxiElementDetails(el),
      timestamp: now,
      x,
      y,
    });
  } else {
    LummmenAnalyticsBus.push("deadClick", [x,y]);
  }
}

const LummmenCtData = {};
document.addEventListener("click", pushLummmenCtData);
document.addEventListener("mouseout", pushLummmenCtData);

let latestLummmenMove = null;
let lastLummmenMove = null;

document.addEventListener("pointermove", e => {
  latestLummmenMove = {
    x: e.clientX + window.scrollX,
    y: e.clientY + window.scrollY
  };
}, { passive: true });

window.addEventListener("scroll", () => {
  if (latestLummmenMove) {
    latestLummmenMove.x = latestLummmenMove.x + (window.scrollX - (latestLummmenMove.scrollX || 0));
    latestLummmenMove.y = latestLummmenMove.y + (window.scrollY - (latestLummmenMove.scrollY || 0));
  } else {
    latestLummmenMove = { x: window.scrollX, y: window.scrollY };
  }
  latestLummmenMove.scrollX = window.scrollX;
  latestLummmenMove.scrollY = window.scrollY;
}, { passive: true });

setInterval(() => {
  if (!latestLummmenMove) return;
  const rx = Math.round(latestLummmenMove.x);
  const ry = Math.round(latestLummmenMove.y);
  if (!lastLummmenMove || rx !== lastLummmenMove[0] || ry !== lastLummmenMove[1]) {
    LummmenAnalyticsBus.push("move", [rx, ry]);
    lastLummmenMove = [rx, ry];
  }
}, 250);
