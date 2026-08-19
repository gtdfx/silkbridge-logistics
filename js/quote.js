/* ============================================================
   KERAJ TRADING — Quote form interactions
   ============================================================ */

(function () {
  "use strict";

  /* --- Service type button selection via event delegation --- */
  var serviceTypeEl = document.getElementById("serviceType");
  if (serviceTypeEl) {
    serviceTypeEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".seg-btn");
      if (!btn) return;
      var group = btn.dataset.group;
      if (!group) return;
      var container = document.getElementById(group);
      if (!container) return;
      container.querySelectorAll(".seg-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      updateInquirySummary();
    });
  }

  /* --- Live inquiry summary --- */
  function updateInquirySummary() {
    var active = document.querySelector("#serviceType .seg-btn.active");
    var service = active ? active.dataset.val || "" : "";
    var category = (document.getElementById("productCategory") || {}).value || "";
    var desc = (document.getElementById("productDesc") || {}).value || "";
    var qty = (document.getElementById("quantity") || {}).value || "";
    var dest = (document.getElementById("destination") || {}).value || "";
    var name = (document.getElementById("contactName") || {}).value || "";
    var summary = document.getElementById("inquirySummary");
    if (!summary) return;

    var serviceLabels = {
      sourcing: "Supplier Sourcing",
      audit: "Factory Audit",
      qc: "Quality Control",
      "private-label": "Private Label",
      logistics: "Full Sourcing + Logistics",
    };
    var catLabels = {
      electronics: "Electronics",
      construction: "Construction",
      machinery: "Machinery",
      medical: "Medical",
      textiles: "Textiles",
      auto: "Auto Parts",
      home: "Home & Garden",
      consumer: "Consumer Goods",
      other: "Other",
    };
    var destLabels = {
      africa: "Africa",
      "middle-east": "Middle East",
      europe: "Europe",
      "north-america": "North America",
      "south-america": "South America",
      asia: "Asia-Pacific",
      other: "Other",
    };

    var html = '<div class="breakdown">';
    if (service)
      html +=
        '<div class="break-row"><span>Service</span><b>' +
        (serviceLabels[service] || service) +
        "</b></div>";
    if (category)
      html +=
        '<div class="break-row"><span>Category</span><b>' +
        (catLabels[category] || category) +
        "</b></div>";
    if (desc)
      html +=
        '<div class="break-row"><span>Product</span><b style="font-weight:400;color:var(--text)">' +
        desc.substring(0, 80) +
        (desc.length > 80 ? "..." : "") +
        "</b></div>";
    if (qty)
      html +=
        '<div class="break-row"><span>Quantity</span><b>' +
        qty +
        "</b></div>";
    if (dest)
      html +=
        '<div class="break-row"><span>Delivery to</span><b>' +
        (destLabels[dest] || dest) +
        "</b></div>";
    if (name)
      html +=
        '<div class="break-row"><span>Contact</span><b>' +
        name +
        "</b></div>";
    html += "</div>";

    if (!service && !category && !desc) {
      html =
        '<div style="text-align:center;padding:40px 20px;color:var(--muted);font-size:14px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:48px;height:48px;margin:0 auto 16px;opacity:0.4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><p>Fill in the form to see your inquiry summary here.</p></div>';
    }
    summary.innerHTML = html;
  }

  /* --- Attach input listeners --- */
  [
    "productCategory",
    "productDesc",
    "quantity",
    "targetPrice",
    "destination",
    "contactName",
    "companyName",
    "contactEmail",
    "contactPhone",
  ].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", updateInquirySummary);
  });

  /* --- Form submission --- */
  var form = document.getElementById("sourcingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      document.getElementById("inquirySummary").style.display = "none";
      document.getElementById("inquiryResult").style.display = "block";
      if (typeof showToast === "function")
        showToast("Inquiry submitted! We'll respond within 24 hours.");
      return false;
    });
  }
})();
