(function () {
  var WIDGET_ID = "payment-widget";
  var API_URL = "/mock-api/config.json";

  var FALLBACK = {
    monthly: 50,
    installments: 4,
    provider: "FlexPay",
  };

  function renderSkeleton(container) {
    container.innerHTML = [
      '<div style="',
        "display:inline-flex;",
        "align-items:center;",
        "gap:8px;",
        "font-family:sans-serif;",
        "font-size:14px;",
        "background:#f0f0f0;",
        "border:1px solid #e0e0e0;",
        "border-radius:8px;",
        "padding:10px 16px;",
        "animation:flexpay-pulse 1.2s ease-in-out infinite;",
      '">',
        '<div style="width:20px;height:20px;border-radius:4px;background:#ddd;"></div>',
        '<div style="width:180px;height:14px;border-radius:4px;background:#ddd;"></div>',
      "</div>",
      "<style>",
        "@keyframes flexpay-pulse {",
          "0%,100%{opacity:1}",
          "50%{opacity:0.4}",
        "}",
      "</style>",
    ].join("");
  }

  function renderWidget(container, data) {
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
  }

  function renderFallback(container) {
    container.innerHTML = [
      '<div style="',
        "display:inline-flex;",
        "align-items:center;",
        "gap:8px;",
        "font-family:sans-serif;",
        "font-size:14px;",
        "color:#666;",
        "background:#fafafa;",
        "border:1px solid #e0e0e0;",
        "border-radius:8px;",
        "padding:10px 16px;",
      '">',
        '<span style="font-size:20px;">💳</span>',
        "<span>Flexible payment options available at checkout</span>",
      "</div>",
    ].join("");
  }

  function init() {
    var container = document.getElementById(WIDGET_ID);
    if (!container) {
      console.warn("[FlexPay SDK] No element found with id=" + WIDGET_ID);
      return;
    }

    performance.mark("flexpay-start");
    renderSkeleton(container);

    fetch(API_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        renderWidget(container, data);
        performance.mark("flexpay-end");
        performance.measure("flexpay-total", "flexpay-start", "flexpay-end");
        var duration = performance.getEntriesByName("flexpay-total")[0].duration.toFixed(2);
        console.log("[FlexPay SDK] Ready in " + duration + "ms", data);
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
