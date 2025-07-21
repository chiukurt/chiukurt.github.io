
// =====================================================================================================================
var matomoLuxiSiteId = "5";
var matomoLuxiSampleSize = "100";
var _mtm = window._mtm = window._mtm || [];
var _paq = window._paq = window._paq || [];
var shouldLuxiAbTest = true;
document.documentElement.classList.add('luxi-ab-test-loading');
document.head.innerHTML += '<style>html.luxi-ab-test-loading{opacity:0}</style>';
var removeLuxiLoadingClass = () => document.documentElement.classList.remove("luxi-ab-test-loading");
var luxiAutoTimeout = setTimeout(() => {
  removeLuxiLoadingClass();
  if (!new URLSearchParams(window.location.search).has('pk_ab_test')) shouldLuxiAbTest = false;
}, 500); 
(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/gh/chiukurt/LuxiferData@1.3.01/abtest.min.js";
  script.integrity = "sha384-+bUq7ecXBASRJS4Zn1KW1G67ehvfDo2by/ckama+veKn+g/zVPAmim+/bqa75ixv";
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

// =====================================================================================================================


function sendLuxiferCtData(event) {
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

  function getOrSetLuxiCtId(){
    function getLuxiCookie(name) {
      const parts = `; ${document.cookie}`.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setLuxiCookie(name, value) {
      const d = new Date();
      d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    }

    let luxiCtId = getLuxiCookie("luxiCtId");
    if (!luxiCtId) {
      luxiCtId = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      setLuxiCookie("luxiCtId", luxiCtId);
      window._paq = window._paq || [];
      var _paq = window._paq;
      // _paq.push(["trackEvent", "dataBridge", "registerCtId", luxiCtId]); 
    }

    return luxiCtId;
  }

  if (typeof matomoLuxiSiteId === 'undefined') return;
  const LUXI_URL = "https://europe-west1-ux-pro.cloudfunctions.net/processLuxiferDataEU";
  const el = getLuxiInteractiveElement(event.target);
  const now = Date.now();
  const prevHoverTime = luxiferCtData.lastHoverTime || false;
  const prevClickTime = luxiferCtData.lastClickTime || false;
  const didClickElement = luxiferCtData.lastClickElement === el
  var activity;

  if (event.type === "click") {
    luxiferCtData.lastClickTime = now;
    luxiferCtData.lastClickElement = el;
    if (didClickElement && (prevClickTime & (now - prevClickTime < 3000))) activity = "frustration";
  } else if (event.type === "mouseout") {
    luxiferCtData.lastHoverTime = now;
    activity = "hesitation";
    if (didClickElement || (!prevHoverTime || (now - prevHoverTime < 500))) return;
  } else return;
  
  window._paq = window._paq || [];
  var _paq = window._paq;
  _paq.push([function() {
    const luxiCtId = getOrSetLuxiCtId();
    const visitorId = this.getVisitorId();
    const url = this.getCurrentUrl();
    if (!visitorId || !url || !el) return;

    try {
      console.log(activity ?? "click");
      // navigator.sendBeacon(
      //   LUXI_URL,
      //   JSON.stringify({
      //     visitorId: visitorId,
      //     timestamp: now,
      //     url: url, 
      //     element: getLuxiElementDetails(el),
      //     siteId: matomoLuxiSiteId,
      //     ctId: luxiCtId,
      //     type: activity ?? "click",
      //   }),
      // );
    } catch (e) {}
  }]);
}

const luxiferCtData = {};
document.addEventListener("click", sendLuxiferCtData);
document.addEventListener("mouseout", sendLuxiferCtData);
  