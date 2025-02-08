// var matomoLuxiSiteId = "5";
// var matomoLuxiSampleSize = "100";
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

// function todayParam() {
//   const pad = (number) => (number < 10 ? '0' : '') + number;
//   const today = new Date();
//   return `${today.getUTCFullYear()}-${pad(today.getUTCMonth() + 1)}-${pad(today.getUTCDate())}`;
// }
// var _mtm = window._mtm = window._mtm || [];
// _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
// (function() {
//   var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
//   g.async=true; g.src='https://analytics.luxifer.app/js/container_1jnfkkvV.js?d=' + todayParam(); s.parentNode.insertBefore(g, s);
// })();
let luxiMoves = JSON.parse(sessionStorage.getItem("luxiMoves")) || [];
var luxiLastCaptureTime = 0;
var scrollDebounceTimeout;

function captureEvent(eventType, x, y) {
  var currentTime = Date.now();
  if (currentTime - luxiLastCaptureTime >= 250) {
    luxiMoves.push([eventType, x, y]);
    luxiLastCaptureTime = currentTime;
    sessionStorage.setItem("luxiMoves", JSON.stringify(luxiMoves));
    window.dispatchEvent(new Event("luxiMovesUpdated"));
  }
}

document.addEventListener("mousemove", function (event) {
  captureEvent("mousemove", event.pageX, event.pageY);
});

function debounceScrollCapture() {
  clearTimeout(scrollDebounceTimeout);
  scrollDebounceTimeout = setTimeout(() => {
    captureEvent("scroll", window.scrollX, window.scrollY);
  }, 250);
}

document.addEventListener("scroll", debounceScrollCapture);

function drawCanvas() {
    const canvas = document.getElementById("luxiCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (luxiMoves.length > 1) {
      ctx.beginPath();
      ctx.moveTo(luxiMoves[0][1], luxiMoves[0][2]);

      for (let i = 1; i < luxiMoves.length; i++) {
        if (luxiMoves[i][0] === "mousemove") {
          ctx.lineTo(luxiMoves[i][1], luxiMoves[i][2]);
        }
      }

      ctx.stroke();
    }
}
// Listen for custom event to update the canvas
window.addEventListener("luxiMovesUpdated", drawCanvas);

// Initial draw
drawCanvas();

// Redraw canvas on window resize
window.addEventListener("resize", drawCanvas);
