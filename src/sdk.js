(function () {
  var VERSION = "1.0.0";
  var WIDGET_ID = "payment-widget";

  var FALLBACK = {
    monthly: 50,
    installments: 4,
    provider: "FlexPay",
  };

  function getScriptConfig() {
    var script = document.currentScript ||
      document.querySelector('script[src*="sdk"]');
    return {
      apiUrl: script && script.dataset.apiUrl || "/mock-api/config.json",
      provider: script && script.dataset.provider || null,
      installments: script && script.dataset.installments || null,
      amount: script && script.dataset.amount || null,
    };
  }

  var styles = {
    base: [
      "display:inline-flex",
      "align-items:center",
      "gap:10px",
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      "font-size:14px",
      "border-radius:10px",
      "padding:11px 16px",
      "line-height:1",
    ].join(";"),
    widget: "color:#0a2540;background:#eef4ff;border:1.5px solid #b3d1ff",
    fallback: "color:#6b7280;background:#f9fafb;border:1.5px solid #e5e7eb",
    skeleton: "background:#f3f4f6;border:1.5px solid #e5e7eb;animation:fp-pulse 1.4s ease-in-out infinite",
  };

  function renderSkeleton(container) {
    container.innerHTML =
      "<style>@keyframes fp-pulse{0%,100%{opacity:1}50%{opacity:.4}}</style>" +
      '<div style="' + styles.base + ";" + styles.skeleton + '">' +
        '<div style="width:22px;height:22px;border-radius:6px;background:#e5e7eb"></div>' +
        '<div style="width:190px;height:13px;border-radius:4px;background:#e5e7eb"></div>' +
      "</div>";
  }

  function renderWidget(container, data) {
    var monthly = "$" + data.monthly + "/mo";
    var installments = data.installments;
    var provider = data.provider;

    container.innerHTML =
      '<div style="' + styles.base + ";" + styles.widget + '">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0057ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="1" y="4" width="22" height="16" rx="2"/>' +
          '<line x1="1" y1="10" x2="23" y2="10"/>' +
        "</svg>" +
        "<span>" +
          "Pay <strong>" + monthly + "</strong>" +
          " &times;" + installments +
          " with <strong>" + provider + "</strong>" +
        "</span>" +
        '<span style="font-size:11px;color:#0057ff;cursor:pointer;text-decoration:underline;text-underline-offset:2px">Learn more</span>' +
      "</div>";
  }

  function renderFallback(container) {
    container.innerHTML =
      '<div style="' + styles.base + ";" + styles.fallback + '">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="1" y="4" width="22" height="16" rx="2"/>' +
          '<line x1="1" y1="10" x2="23" y2="10"/>' +
        "</svg>" +
        "<span>Flexible payment options available at checkout</span>" +
      "</div>";
  }

  function init() {
    var container = document.getElementById(WIDGET_ID);
    if (!container) {
      console.warn("[FlexPay SDK v" + VERSION + "] No element found with id=" + WIDGET_ID);
      return;
    }

    var config = getScriptConfig();
    performance.mark("flexpay-start");
    renderSkeleton(container);

    fetch(config.apiUrl)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        // data-* attributes on the script tag override API values
        if (config.amount) data.monthly = Math.ceil(config.amount / (data.installments || 4));
        if (config.provider) data.provider = config.provider;
        if (config.installments) data.installments = config.installments;

        renderWidget(container, data);

        performance.mark("flexpay-end");
        performance.measure("flexpay-total", "flexpay-start", "flexpay-end");
        var ms = performance.getEntriesByName("flexpay-total")[0].duration.toFixed(2);
        console.log("[FlexPay SDK v" + VERSION + "] Ready in " + ms + "ms");
      })
      .catch(function (err) {
        console.error("[FlexPay SDK v" + VERSION + "] Fetch failed:", err.message);
        renderFallback(container);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
