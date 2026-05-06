(function () {
  var WIDGET_ID = "payment-widget";
  var API_URL = "/mock-api/config.json";

  var FALLBACK = {
    monthly: 50,
    installments: 4,
    provider: "FlexPay",
  };

  function render(container, data) {
    var startTime = performance.now();

    container.innerHTML = [
      '<div style="',
        "display:inline-flex;",
        "align-items:center;",
        "gap:8px;",
        "font-family:sans-serif;",
        "font-size:14px;",
        "color:#1a1a1a;",
        "background:#f0f7ff;",
        "border:1px solid #cce0ff;",
        "border-radius:8px;",
        "padding:10px 16px;",
      '">',
        '<span style="font-size:20px;">💳</span>',
        "<span>",
          "Pay <strong>$" + data.monthly + "/month</strong>",
          " x" + data.installments + " with",
          " <strong>" + data.provider + "</strong>",
        "</span>",
      "</div>",
    ].join("");

    var elapsed = (performance.now() - startTime).toFixed(2);
    console.log("[FlexPay SDK] Rendered in " + elapsed + "ms", data);
  }

  function renderFallback(container) {
    console.warn("[FlexPay SDK] Using fallback data");
    render(container, FALLBACK);
  }

  function init() {
    var container = document.getElementById(WIDGET_ID);
    if (!container) {
      console.warn("[FlexPay SDK] No element found with id=" + WIDGET_ID);
      return;
    }

    fetch(API_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        render(container, data);
      })
      .catch(function (err) {
        console.error("[FlexPay SDK] Fetch failed:", err.message);
        renderFallback(container);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
