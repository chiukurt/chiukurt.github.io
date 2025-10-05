
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


// TESTING =============================================================================================================

const LummmenAnalyticsBus = (() => {
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

    return JSON.stringify({ ...header, ...out });
  }

  function flush() {
    window._paq = window._paq || [];
    var _paq = window._paq;

    _paq.push([function () {
      try {
        if (flushing) return;
        flushing = true;
        const pageViewId = this.getPageViewId();
        const visitorId = this.getVisitorId();
        const url = this.getCurrentUrl();
        if (!visitorId || !url) return;

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

        const payload = serializeOnce(header);
        if (!payload) return;

        // navigator.sendBeacon("/endpoint", data);
        console.log(payload);
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

  addEventListener("beforeunload", () => {
    try { flush(); } catch (_) {}
  });
  
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "hidden") return;
    try { flush(); } catch (_) {}
  });

  return { push, flush, size };
})();

// TESTING =============================================================================================================

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
    LummmenAnalyticsBus.push("moves", [rx, ry]);
    lastLummmenMove = [rx, ry];
  }
}, 250);
