/* ============================================================
   SILKBRIDGE LOGISTICS — shared interactions
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("siteHeader");
  const progress = document.getElementById("scrollProgress");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
      })
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const fmt = (v, d) => {
    if (d === "suffix") return v.toLocaleString("en-US");
    return v.toLocaleString("en-US", { maximumFractionDigits: 1 });
  };
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const dec = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
          const dur = 1600;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toLocaleString("en-US", {
              minimumFractionDigits: dec,
              maximumFractionDigits: dec,
            });
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.dataset.count));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      // close others in same list
      const list = item.closest(".faq-list");
      if (list) {
        list.querySelectorAll(".faq-item.open").forEach((other) => {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
        });
      }
      if (!open) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Card cursor spotlight ---------- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- Cursor glow (desktop only) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy, visible = false;
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!visible) { glow.classList.add("show"); visible = true; }
    }, { passive: true });
    document.addEventListener("mouseleave", () => {
      glow.classList.remove("show"); visible = false;
    });
    const loop = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx - 240}px, ${gy - 240}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Toast ---------- */
  window.showToast = function (msg) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector("span").textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("show"), 4200);
  };

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Newsletter form ---------- */
  document.querySelectorAll(".news-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      if (!input.value.trim() || !input.value.includes("@")) {
        showToast("Please enter a valid email address.");
        return;
      }
      showToast("Subscribed! Freight rates & route updates are on the way.");
      input.value = "";
    });
  });

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("#fName").value.trim();
      const email = contactForm.querySelector("#fEmail").value.trim();
      const msg = contactForm.querySelector("#fMsg").value.trim();
      if (!name || !email || !msg) {
        showToast("Please fill in your name, email and message.");
        return;
      }
      if (!email.includes("@")) {
        showToast("Please enter a valid email address.");
        return;
      }
      contactForm.reset();
      showToast("Message sent! Our Addis Ababa team replies within 4 business hours.");
    });
  }

  /* ============================================================
     QUOTE CALCULATOR
     ============================================================ */
  const calc = {
    mode: "sea",
    weight: 500,
    origin: "shanghai",
    destination: "addis",
    insurance: false,
    pickup: false,
    customs: true,
  };

  const RATES = {
    sea: { base: 2.6, min: 150, days: "38 – 44", label: "Sea Freight (LCL)" },
    fcl20: { base: 3200, min: 3200, days: "38 – 44", label: "Sea Freight 20ft FCL" },
    fcl40: { base: 4850, min: 4850, days: "38 – 44", label: "Sea Freight 40ft FCL" },
    rail: { base: 4.4, min: 260, days: "18 – 24", label: "Rail Freight" },
    air: { base: 6.9, min: 320, days: "4 – 6", label: "Air Freight" },
    express: { base: 9.8, min: 400, days: "5 – 8", label: "Door-to-Door Express" },
  };

  const ORIGIN_MULT = {
    shanghai: 1.0,
    shenzhen: 1.06,
    guangzhou: 1.05,
    ningbo: 0.98,
    yiwu: 1.02,
    qingdao: 1.0,
  };

  const DEST_MULT = {
    addis: 1.0,
    modjo: 1.0,
    dire: 1.18,
    hawas: 1.12,
    bahir: 1.24,
  };

  const EXCHANGE = 118.5; // sample USD -> ETB

  function fmtUSD(v) {
    return "$" + Math.round(v).toLocaleString("en-US");
  }

  function updateCalc() {
    const mode = calc.mode;
    const rate = RATES[mode];
    if (!rate) return;
    const om = ORIGIN_MULT[calc.origin] || 1;
    const dm = DEST_MULT[calc.destination] || 1;

    let freight;
    if (mode === "fcl20" || mode === "fcl40") {
      freight = rate.base;
    } else {
      freight = Math.max(rate.min, calc.weight * rate.base);
    }
    freight *= om * dm;

    const customs = calc.customs ? Math.max(120, freight * 0.06) : 0;
    const insurance = calc.insurance ? Math.max(40, freight * 0.012) : 0;
    const pickup = calc.pickup ? (calc.weight > 300 ? 380 : 260) : 0;
    const total = freight + customs + insurance + pickup;
    const etb = Math.round(total * EXCHANGE);

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set("calcFreight", fmtUSD(freight));
    set("calcCustoms", customs ? fmtUSD(customs) : "Included");
    set("calcInsurance", insurance ? fmtUSD(insurance) : "Not selected");
    set("calcPickup", pickup ? fmtUSD(pickup) : "Not selected");
    set("calcTotal", fmtUSD(total));
    set("calcEtb", etb.toLocaleString("en-US") + " ETB");
    set("calcDays", rate.days);
    set("calcMode", rate.label);
    set("calcWeight", calc.weight + " kg");
    const dep = document.getElementById("calcDep");
    if (dep) dep.textContent = nextDeparture(mode);
    const perKg = document.getElementById("calcPerKg");
    if (perKg) perKg.textContent = fmtUSD(mode === "fcl20" || mode === "fcl40" ? total : total / calc.weight) + " / kg";
  }

  function nextDeparture(mode) {
    const now = new Date();
    const base = mode === "sea" || mode === "fcl20" || mode === "fcl40" ? 5 : mode === "rail" ? 3 : 1;
    const d = new Date(now);
    d.setDate(d.getDate() + base);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  const calcPanel = document.getElementById("quoteCalc");
  if (calcPanel) {
    calcPanel.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        calcPanel.querySelectorAll("[data-mode]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        calc.mode = btn.dataset.mode;
        updateCalc();
      });
    });

    const weightRange = document.getElementById("weightRange");
    const weightVal = document.getElementById("weightVal");
    if (weightRange) {
      weightRange.addEventListener("input", () => {
        calc.weight = parseInt(weightRange.value, 10);
        weightVal.textContent = calc.weight + " kg";
        weightRange.style.setProperty("--fill", ((calc.weight - 10) / (5000 - 10)) * 100 + "%");
        updateCalc();
      });
    }

    const bind = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => { calc[key] = el.value; updateCalc(); });
    };
    bind("calcOrigin", "origin");
    bind("calcDest", "destination");

    const toggles = {
      insuranceToggle: "insurance",
      pickupToggle: "pickup",
      customsToggle: "customs",
    };
    Object.entries(toggles).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => { calc[key] = el.checked; updateCalc(); });
    });

    updateCalc();
  }

  /* ============================================================
     TRACKING DEMO
     ============================================================ */
  const trackForm = document.getElementById("trackForm");
  const trackInput = document.getElementById("trackInput");
  const trackResult = document.getElementById("trackResult");

  const STATUS = {
    label: "In Transit · On the Sea",
    step: 3, // index of the current event in the timeline
    phase: 1, // index of the current phase in the progress steps (0 PickedUp, 1 InTransit, 2 Customs, 3 Delivered)
    events: [
      { t: "Jul 12, 09:14", b: "Shipment created", s: "Booking confirmed. Container number MSCU-8842137 issued.", done: true },
      { t: "Jul 14, 16:40", b: "Picked up — Yiwu Warehouse", s: "Cargo loaded: 128 cartons, 2,340 kg. Awaiting export customs.", done: true },
      { t: "Jul 16, 11:05", b: "Departed Ningbo Port", s: "Vessel MSC ALESSIA V.117E sailed from Ningbo to Djibouti.", done: true },
      { t: "Jul 22, 08:30", b: "Transit — Strait of Malacca", s: "Vessel on schedule. ETA Djibouti: Aug 16.", done: true },
      { t: "Aug 16, 14:00", b: "Arrived Djibouti Port", s: "Container discharged. Onward to Modjo Dry Port by rail.", done: false },
      { t: "Aug 18, 10:00", b: "Customs clearance — Modjo", s: "Document processing. Duties estimated: $412.", done: false },
      { t: "Aug 20, 09:00", b: "Out for delivery — Addis Ababa", s: "Truck dispatched to your warehouse in Bole Lemi.", done: false },
      { t: "Aug 20, 16:00", b: "Delivered", s: "Signed by consignee. POD available on request.", done: false },
    ],
  };

  const SAMPLES = [
    { id: "SB-88421-CN-ET", status: "In Transit · On the Sea", eta: "ETA Aug 20" },
    { id: "SB-90377-CN-ET", status: "Customs Clearance", eta: "ETA Aug 18" },
    { id: "SB-81256-CN-ET", status: "Delivered Jul 28", eta: "POD ready" },
  ];

  function renderTracking(id) {
    if (!trackResult) return;
    const idEl = trackResult.querySelector("[data-t-id]");
    const pillEl = trackResult.querySelector("[data-t-status]");
    if (idEl) idEl.textContent = id;
    if (pillEl) pillEl.textContent = STATUS.label;

    // progress steps
    const steps = trackResult.querySelectorAll(".tstep");
    const titles = ["Picked Up", "In Transit", "Customs", "Delivered"];
    steps.forEach((s, i) => {
      s.querySelector(".tl").textContent = titles[i];
      const done = i < STATUS.phase;
      const active = i === STATUS.phase;
      s.classList.toggle("done", done);
      s.classList.toggle("active", active);
      s.querySelector(".ts").textContent = active ? "Now" : "";
    });

    // timeline
    const tl = trackResult.querySelector(".track-timeline");
    tl.innerHTML = "";
    STATUS.events.forEach((ev, i) => {
      const row = document.createElement("div");
      row.className = "tl-row" + (ev.done ? " done" : "") + (i === STATUS.step ? " current" : "");
      row.innerHTML =
        '<div class="tl-time">' + ev.t + "</div>" +
        '<div class="tl-event"><div class="tl-dot">' +
        (ev.done
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>') +
        "</div><p><b>" + ev.b + "</b>" + ev.s + "</p></div>";
      tl.appendChild(row);
    });

    trackResult.classList.add("show");
    trackResult.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (trackForm && trackInput && trackResult) {
    trackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = trackInput.value.trim();
      if (!id) {
        showToast("Enter a tracking number (e.g. SB-88421-CN-ET).");
        return;
      }
      renderTracking(id);
    });
    document.querySelectorAll("[data-sample]").forEach((el) => {
      el.addEventListener("click", () => {
        trackInput.value = el.dataset.sample;
        renderTracking(el.dataset.sample);
      });
    });
  }
})();
