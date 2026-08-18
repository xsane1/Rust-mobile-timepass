/* ============================================================
   Rust Mobile Fun Analyzer — script.js
   Vanilla JavaScript only (no external libraries)
   Production-ready, mobile friendly, well-commented.
   ============================================================ */

(function () {
  "use strict";

  /* -----------------------------
     Utilities
  ------------------------------ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // Safe localStorage wrapper
  const storage = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        if (v === null || v === undefined) return fallback;
        return JSON.parse(v);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Ignore storage failures (e.g., blocked storage)
      }
    }
  };

  // Toast system
  let toastTimer = null;
  function showToast(message, { duration = 2600 } = {}) {
    // Create toast element if missing
    let toastEl = $("#toast");
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "toast";
      // Minimal inline style so it works even without CSS expectations
      toastEl.style.position = "fixed";
      toastEl.style.left = "50%";
      toastEl.style.bottom = "18px";
      toastEl.style.transform = "translateX(-50%)";
      toastEl.style.zIndex = "99999";
      toastEl.style.padding = "12px 14px";
      toastEl.style.borderRadius = "999px";
      toastEl.style.background = "rgba(0,0,0,0.85)";
      toastEl.style.color = "#fff";
      toastEl.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
      toastEl.style.fontSize = "14px";
      toastEl.style.maxWidth = "92vw";
      toastEl.style.textAlign = "center";
      toastEl.style.boxShadow = "0 8px 20px rgba(0,0,0,0.35)";
      toastEl.style.opacity = "0";
      toastEl.style.transition = "opacity 180ms ease, transform 180ms ease";
      toastEl.style.pointerEvents = "none";
      document.body.appendChild(toastEl);
    }

    toastEl.textContent = message;

    // Animate in
    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateX(-50%) translateY(-2px)";

    // Clear old timer
    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastEl.style.opacity = "0";
      toastEl.style.transform = "translateX(-50%) translateY(4px)";
    }, duration);
  }

  // Winner popup / modal helper
  function createModal({
    title = "Result",
    message = "",
    primaryText = "OK",
    onPrimary = null,
    secondaryText = "Close",
    onSecondary = null
  } = {}) {
    // Ensure modal doesn't exist
    const existing = $("#winnerModal");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "winnerModalOverlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.55)";
    overlay.style.zIndex = "100000";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "18px";

    const modal = document.createElement("div");
    modal.id = "winnerModal";
    modal.style.width = "min(520px, 92vw)";
    modal.style.background = "#111";
    modal.style.color = "#fff";
    modal.style.borderRadius = "16px";
    modal.style.overflow = "hidden";
    modal.style.boxShadow = "0 18px 50px rgba(0,0,0,0.55)";
    modal.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

    const header = document.createElement("div");
    header.style.padding = "16px 16px 10px 16px";
    header.style.borderBottom = "1px solid rgba(255,255,255,0.12)";

    const h = document.createElement("div");
    h.textContent = title;
    h.style.fontWeight = "800";
    h.style.fontSize = "18px";
    h.style.lineHeight = "1.3";

    const body = document.createElement("div");
    body.style.padding = "14px 16px 2px 16px";
    body.style.fontSize = "14px";
    body.style.color = "rgba(255,255,255,0.92)";
    body.style.whiteSpace = "pre-wrap";
    body.textContent = message;

    const footer = document.createElement("div");
    footer.style.padding = "14px 16px 16px 16px";
    footer.style.display = "flex";
    footer.style.gap = "10px";
    footer.style.justifyContent = "flex-end";

    const btnSecondary = document.createElement("button");
    btnSecondary.textContent = secondaryText;
    btnSecondary.type = "button";
    btnSecondary.style.background = "rgba(255,255,255,0.08)";
    btnSecondary.style.color = "#fff";
    btnSecondary.style.border = "1px solid rgba(255,255,255,0.18)";
    btnSecondary.style.padding = "10px 12px";
    btnSecondary.style.borderRadius = "12px";
    btnSecondary.style.fontWeight = "700";
    btnSecondary.style.cursor = "pointer";

    const btnPrimary = document.createElement("button");
    btnPrimary.textContent = primaryText;
    btnPrimary.type = "button";
    btnPrimary.style.background = "#28a745";
    btnPrimary.style.color = "#fff";
    btnPrimary.style.border = "1px solid rgba(0,0,0,0.2)";
    btnPrimary.style.padding = "10px 12px";
    btnPrimary.style.borderRadius = "12px";
    btnPrimary.style.fontWeight = "800";
    btnPrimary.style.cursor = "pointer";

    // Append
    header.appendChild(h);
    modal.appendChild(header);
    modal.appendChild(body);
    footer.appendChild(btnSecondary);
    footer.appendChild(btnPrimary);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close handlers
    function close() {
      overlay.remove();
    }

    btnSecondary.addEventListener("click", () => {
      if (typeof onSecondary === "function") onSecondary();
      close();
    });

    btnPrimary.addEventListener("click", () => {
      if (typeof onPrimary === "function") onPrimary();
      close();
    });

    // Click outside to close
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    // Escape to close
    document.addEventListener(
      "keydown",
      function escHandler(e) {
        if (e.key === "Escape") {
          document.removeEventListener("keydown", escHandler);
          close();
        }
      },
      { once: true }
    );

    // Focus primary for accessibility
    btnPrimary.focus();
  }

  // Make an element's text selectable without selecting everything
  function getShareText() {
    const resText = $("#resultText");
    if (resText && resText.textContent) {
      return resText.textContent.trim();
    }
    // Fallback: use a compact wheel result if available
    const lastRes = storage.get("wheelLastResult", null);
    if (lastRes && lastRes.text) return String(lastRes.text).trim();
    return "Rust Mobile Fun Analyzer — Result: (no result stored)";
  }

  /* -----------------------------
     Loading Screen
     ------------------------------ */

  function setupLoadingScreen() {
    const loader = $("#loadingScreen");
    if (!loader) {
      // Try common alternative ids/classes if any exist
      const alt = $(".loading-screen") || $("#loading");
      if (!alt) return;
    }

    const loaderEl = loader || $(".loading-screen") || $("#loading");

    // Hide when DOM is ready (and a tiny delay for perceived smoothness)
    const done = () => {
      // Prefer adding a class to let CSS do the animation if present
      loaderEl.classList.add("is-hidden");
      loaderEl.style.opacity = "0";
      loaderEl.style.pointerEvents = "none";
      loaderEl.style.transition = loaderEl.style.transition || "opacity 240ms ease";
      // Remove after transition
      setTimeout(() => {
        if (loaderEl && loaderEl.parentNode) loaderEl.parentNode.removeChild(loaderEl);
      }, 300);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setTimeout(done, 250));
    } else {
      setTimeout(done, 250);
    }

    // Also hide on window load to catch any late resources
    window.addEventListener("load", () => setTimeout(done, 0), { once: true });
  }

  /* -----------------------------
     Mobile Menu Toggle
     ------------------------------ */

  function setupMobileMenuToggle() {
    // Common selectors (index.html controls actual IDs/classes)
    const menuToggle =
      $("#menuToggle") ||
      $("#mobileMenuToggle") ||
      $('[data-menu-toggle="true"]') ||
      $(".menu-toggle");

    const mobileMenu =
      $("#mobileMenu") ||
      $("#menu") ||
      $(".mobile-menu") ||
      $('[data-mobile-menu="true"]');

    if (!menuToggle || !mobileMenu) return;

    const isOpenClass = "is-open";

    const setOpen = (open) => {
      if (open) {
        mobileMenu.classList.add(isOpenClass);
        menuToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
      } else {
        mobileMenu.classList.remove(isOpenClass);
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    };

    // Init ARIA state
    if (!menuToggle.hasAttribute("aria-expanded")) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    setOpen(mobileMenu.classList.contains(isOpenClass));

    menuToggle.addEventListener("click", () => {
      const open = !mobileMenu.classList.contains(isOpenClass);
      setOpen(open);
    });

    // Close on link click (mobile)
    $$("a", mobileMenu).forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    // Close on clicking outside
    document.addEventListener("click", (e) => {
      const isOpen = mobileMenu.classList.contains(isOpenClass);
      if (!isOpen) return;

      const clickedInsideMenu = mobileMenu.contains(e.target);
      const clickedToggle = menuToggle.contains(e.target);
      if (!clickedInsideMenu && !clickedToggle) setOpen(false);
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
    });
  }

  /* -----------------------------
     Smooth Scrolling
     ------------------------------ */

  function setupSmoothScrolling() {
    // Ensure anchor links scroll smoothly
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();
      // Mobile-friendly: use scrolling into view
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash without jump
      if (history.replaceState) history.replaceState(null, "", href);
      else location.hash = href;
    }, { passive: true });

    // Also set default behavior for focus jumps if keyboard nav uses hash
    window.addEventListener("hashchange", () => {
      const target = $(location.hash);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* -----------------------------
     Back To Top Button
     ------------------------------ */

  function setupBackToTop() {
    const btn =
      $("#backToTop") ||
      $("#toTop") ||
      $('[data-back-to-top="true"]') ||
      $(".back-to-top");

    if (!btn) return;

    const showAt = 300;

    const setVisible = (visible) => {
      btn.classList.toggle("is-visible", visible);
      btn.style.opacity = visible ? "1" : "0";
      btn.style.pointerEvents = visible ? "auto" : "none";
    };

    setVisible(window.scrollY > showAt);

    window.addEventListener("scroll", () => {
      setVisible(window.scrollY > showAt);
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -----------------------------
     Offline Raid Checker
     ------------------------------ */

  function setupOfflineRaidChecker() {
    const trigger =
      $("#raidCheckBtn") ||
      $("#offlineRaidBtn") ||
      $("#raidBtn") ||
      $('[data-raid-check="true"]') ||
      $(".raid-check");

    const resultRisk = $("#raidRisk") || $("#riskLevel") || $("#raidRiskLevel");
    const resultChance = $("#raidChance") || $("#raidPercent") || $("#raidChanceText");
    const resultComment = $("#raidComment") || $("#raidFunnyComment") || $("#raidCommentText");

    if (!trigger && (!resultRisk || !resultChance || !resultComment)) return;

    const raidComments = [
      "Buckle up. Your base is about to get *tested* like it’s in a Rust lab.",
      "Somebody’s about to discover your loot… and your lack of upkeep.",
      "Tonight’s agenda: door math, cupboard drama, and questionable decisions.",
      "Your sleeping cam has been rated 1/10 by the Roombas of Fate.",
      "Hope you like random door skins. The raiders do.",
      "May your bags be near—but your loot be closer.",
      "If you hear footsteps, pretend you’re the wall. It’s safer.",
      "Your offline raid is queued like a long-waiting recycler."
    ];

    const riskLabels = [
      { min: 0, max: 19, label: "Low", vibe: "Probably just vibes." },
      { min: 20, max: 49, label: "Medium", vibe: "Expect some attention." },
      { min: 50, max: 79, label: "High", vibe: "Bring the headache." },
      { min: 80, max: 100, label: "Insane", vibe: "You’re being audited." }
    ];

    function compute() {
      // Random raid chance percentage
      const chance = Math.floor(Math.random() * 101); // 0..100
      // Risk level derived from chance, but we can add some variance
      const skew = Math.floor((Math.random() - 0.5) * 20); // -10..+9
      const adjusted = clamp(chance + skew, 0, 100);

      const risk = riskLabels.find((r) => adjusted >= r.min && adjusted <= r.max) || riskLabels[0];
      const comment = raidComments[Math.floor(Math.random() * raidComments.length)];
      return { chance, adjusted, riskLabel: risk.label, vibe: risk.vibe, comment };
    }

    const setText = (el, text) => {
      if (!el) return;
      el.textContent = text;
    };

    trigger?.addEventListener("click", () => {
      const { chance, adjusted, riskLabel, vibe, comment } = compute();

      setText(resultChance, `${chance}% raid chance`);
      setText(resultRisk, `Risk: ${riskLabel} (${adjusted}% threat)`);
      setText(resultComment, comment + " " + vibe);

      // Update shared result text for copy/share features
      const combined = `Offline Raid Check:\n- Raid chance: ${chance}%\n- Risk level: ${riskLabel} (${adjusted}% threat)\n- Funny comment: ${comment}`;
      const rt = $("#resultText");
      if (rt) rt.textContent = combined;

      storage.set("lastOfflineRaid", {
        chance,
        adjusted,
        riskLabel,
        comment,
        text: combined,
        at: Date.now()
      });

      showToast("Raid checked. Your base is judging you.");
    });

    // Optional: Enter key activation for accessibility
    trigger?.setAttribute?.("role", "button");
  }

  /* -----------------------------
     What Kind Of Player Are You
     ------------------------------ */

  function setupPlayerTypeGenerator() {
    const trigger =
      $("#playerTypeBtn") ||
      $("#whoAreYouBtn") ||
      $("#playerTypeGeneratorBtn") ||
      $('[data-player-type="true"]') ||
      $(".player-type-check");

    const titleEl = $("#playerTypeTitle") || $("#playerType") || $("#typeTitle");
    const descEl = $("#playerTypeDescription") || $("#playerTypeDesc") || $("#typeDescription");
    const badgeEl = $("#playerTypeBadge") || $("#typeBadge") || $("#badge");
    const commentEl = $("#playerTypeFunnyComment") || $("#playerTypeComment") || $("#typeComment");

    if (!trigger && (!titleEl || !descEl || !badgeEl || !commentEl)) return;

    const results = [
      {
        title: "Sulfur Farmer",
        description: "You know the way of the grind. Efficiency is your love language.",
        badge: "🟡 Sulfur Approved",
        comment: "If it’s not sulfur, it’s just… practice."
      },
      {
        title: "Chad PvPer",
        description: "You don’t avoid fights—you pick them like a buffet.",
        badge: "🔴 PvP Chosen",
        comment: "Your compound is a playlist of regrets."
      },
      {
        title: "Base Builder",
        description: "You craft aesthetics and security like it’s an art exhibit.",
        badge: "🧱 Fortress Mode",
        comment: "Your walls have walls. Respect."
      },
      {
        title: "Loot Goblin",
        description: "You loot like a raccoon with a schedule.",
        badge: "🟢 Minimum Risk, Maximum Loot",
        comment: "If it shines, it’s yours. Legally? Ask later."
      },
      {
        title: "Roof Camper",
        description: "You’ve mastered the art of being inconveniently high.",
        badge: "🧤 Elevation Expert",
        comment: "The clouds pay rent for your attention."
      },
      {
        title: "Door Camper",
        description: "You turn simple doors into emotional roller coasters.",
        badge: "🚪 Door Discipline",
        comment: "They open the door… you open the trauma."
      },
      {
        title: "Offline Raider",
        description: "You believe timing is a weapon.",
        badge: "💣 Timed Justice",
        comment: "Your silence is scarier than your rockets."
      },
      {
        title: "Solo Warrior",
        description: "No squad, no problem—just pure stubborn momentum.",
        badge: "⚔️ One-Man Ops",
        comment: "If teamwork was real, you wouldn’t be here."
      },
      {
        title: "Professional Grub",
        description: "You don’t just survive—you *specialize* in chaos.",
        badge: "🥩 Certified Menace",
        comment: "Your diet is pure RNG."
      }
    ];

    function randomResult() {
      const pick = results[Math.floor(Math.random() * results.length)];
      return pick;
    }

    const setText = (el, text) => {
      if (el) el.textContent = text;
    };

    trigger?.addEventListener("click", () => {
      const r = randomResult();
      setText(titleEl, r.title);
      setText(descEl, r.description);
      setText(badgeEl, r.badge);
      setText(commentEl, r.comment);

      const combined = `Player Type:\n- Title: ${r.title}\n- Description: ${r.description}\n- Badge: ${r.badge}\n- Funny comment: ${r.comment}`;
      const rt = $("#resultText");
      if (rt) rt.textContent = combined;

      storage.set("lastPlayerType", { ...r, text: combined, at: Date.now() });
      showToast("Identity confirmed. Your enemies will understand soon.");
    });
  }

  /* -----------------------------
     Spin The Wheel
     ------------------------------ */

  function setupSpinTheWheel() {
    const wheelEl =
      $("#wheel") ||
      $("#spinWheel") ||
      $(".wheel") ||
      $('[data-wheel="true"]');

    const spinBtn =
      $("#spinBtn") ||
      $("#spinTheWheelBtn") ||
      $('[data-spin="true"]') ||
      $(".spin-button");

    const winnerTitleEl = $("#wheelWinnerTitle") || $("#winnerTitle") || $("#wheelWinner");
    const winnerDescEl = $("#wheelWinnerDesc") || $("#winnerDesc");

    // Last 10 spins history
    const historyEl = $("#spinHistory") || $("#wheelHistory") || $("#historyList");

    const wheelRotationInput = wheelEl; // The element to rotate

    if (!wheelEl || !spinBtn) return;

    const wheelOptions = [
      "Find AK Today",
      "Offline Raid Incoming",
      "Trust No One",
      "Lucky Day",
      "Door Camper Energy",
      "Airfield Adventure",
      "Sulfur Jackpot",
      "Start Naked",
      "Roof Camper",
      "Base Destroyed",
      "Rare Loot",
      "Nothing Happens"
    ];
     
