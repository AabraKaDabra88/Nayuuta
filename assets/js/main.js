/* Nayuuta — site scripts (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var DESKTOP_MQ = window.matchMedia("(min-width: 75em)");
  var REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Sticky header: solid background after scroll ---------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.querySelector(".visually-hidden").textContent = open ? "Close menu" : "Open menu";
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (!open) closeAllDropdowns();
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });
    DESKTOP_MQ.addEventListener("change", function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Dropdowns (click/keyboard; hover handled in CSS on desktop) ---------- */
  var dropdownItems = Array.prototype.slice.call(document.querySelectorAll(".has-dropdown"));

  function setDropdown(item, open) {
    var btn = item.querySelector(".dropdown-toggle");
    item.classList.toggle("is-open", open);
    if (btn) btn.setAttribute("aria-expanded", String(open));
  }
  function closeAllDropdowns(except) {
    dropdownItems.forEach(function (item) {
      if (item !== except) setDropdown(item, false);
    });
  }

  dropdownItems.forEach(function (item) {
    var btn = item.querySelector(".dropdown-toggle");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !item.classList.contains("is-open");
      closeAllDropdowns(item);
      setDropdown(item, open);
    });

    // Close a desktop dropdown when keyboard focus leaves it
    item.addEventListener("focusout", function (e) {
      if (DESKTOP_MQ.matches && !item.contains(e.relatedTarget)) setDropdown(item, false);
    });
  });

  document.addEventListener("click", function (e) {
    if (DESKTOP_MQ.matches && !e.target.closest(".has-dropdown")) closeAllDropdowns();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openItem = document.querySelector(".has-dropdown.is-open");
    if (openItem) {
      setDropdown(openItem, false);
      openItem.querySelector(".dropdown-toggle").focus();
    } else if (nav && nav.classList.contains("is-open")) {
      setMenu(false);
      navToggle.focus();
    }
  });

  /* ---------- Footer year ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Hero slider ---------- */
  var slider = document.querySelector("[data-slider]");
  if (slider) initSlider(slider);

  function initSlider(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var controls = root.querySelector(".hero-controls");
    var dotsWrap = root.querySelector(".slider-dots");
    var prevBtn = root.querySelector("[data-slider-prev]");
    var nextBtn = root.querySelector("[data-slider-next]");
    var pauseBtn = root.querySelector("[data-slider-pause]");
    var liveRegion = root.querySelector(".hero-slides");
    var interval = parseInt(root.getAttribute("data-interval"), 10) || 6000;
    var current = 0;
    var timer = null;
    var userPaused = REDUCED_MOTION.matches; // no autoplay for reduced-motion users
    var hovering = false;
    var focusInside = false;
    var dots = [];

    if (slides.length < 2) return;
    controls.hidden = false;

    slides.forEach(function (slide, i) {
      var li = document.createElement("li");
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", function () { goTo(i, true); });
      li.appendChild(dot);
      dotsWrap.appendChild(li);
      dots.push(dot);
    });

    function goTo(index, fromUser) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var active = i === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
        if (active) slide.removeAttribute("inert");
        else slide.setAttribute("inert", "");
      });
      dots.forEach(function (dot, i) {
        if (i === current) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      // Announce slide changes only when the user triggered them
      liveRegion.setAttribute("aria-live", fromUser ? "polite" : "off");
      if (fromUser) restart();
    }

    function start() {
      stop();
      if (userPaused || hovering || focusInside || document.hidden) return;
      timer = window.setInterval(function () { goTo(current + 1, false); }, interval);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }
    function restart() { start(); }

    function setUserPaused(paused) {
      userPaused = paused;
      pauseBtn.setAttribute("aria-pressed", String(paused));
      pauseBtn.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
      start();
    }

    prevBtn.addEventListener("click", function () { goTo(current - 1, true); });
    nextBtn.addEventListener("click", function () { goTo(current + 1, true); });
    pauseBtn.addEventListener("click", function () { setUserPaused(!userPaused); });

    // Pause on hover and while keyboard focus is inside the slider
    root.addEventListener("mouseenter", function () { hovering = true; stop(); });
    root.addEventListener("mouseleave", function () { hovering = false; start(); });
    root.addEventListener("focusin", function () { focusInside = true; stop(); });
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) { focusInside = false; start(); }
    });

    // Arrow keys when focus is within the slider
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1, true); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1, true); }
    });

    // Pause when tab is hidden
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    setUserPaused(userPaused);
    goTo(0, false);
  }

  /* ---------- Contact form validation ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) initForm(form);

  function initForm(formEl) {
    var status = formEl.querySelector(".form-status");
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_RE = /^[+()\d\s.-]{7,20}$/;

    var rules = {
      name: function (v) { return v.length >= 2 ? "" : "Please enter your name."; },
      email: function (v) {
        if (!v) return "Please enter your email address.";
        return EMAIL_RE.test(v) ? "" : "Please enter a valid email address, like name@company.com.";
      },
      company: function () { return ""; },
      phone: function (v) {
        if (!v) return "";
        return PHONE_RE.test(v) ? "" : "Please enter a valid phone number, including country code.";
      },
      message: function (v) { return v.length >= 10 ? "" : "Please enter a message of at least 10 characters."; }
    };

    function validateField(field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var msg = rule(field.value.trim());
      var err = document.getElementById(field.id + "-error");
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) {
        err.textContent = msg;
        err.classList.toggle("is-visible", !!msg);
      }
      return !msg;
    }

    Array.prototype.forEach.call(formEl.elements, function (field) {
      if (!rules[field.name]) return;
      field.addEventListener("blur", function () {
        if (field.value.trim() !== "" || field.getAttribute("aria-invalid") === "true") validateField(field);
      });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      // Honeypot: bots fill hidden fields
      if (formEl.elements.website && formEl.elements.website.value) return;

      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        var field = formEl.elements[name];
        if (field && !validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        status.classList.add("is-error");
        status.textContent = "Please fix the highlighted fields and try again.";
        firstInvalid.focus();
        return;
      }

      var data = {
        name: formEl.elements.name.value.trim(),
        email: formEl.elements.email.value.trim(),
        company: formEl.elements.company.value.trim(),
        phone: formEl.elements.phone.value.trim(),
        message: formEl.elements.message.value.trim()
      };

      submitForm(data).then(function () {
        formEl.reset();
        Array.prototype.forEach.call(formEl.querySelectorAll("[aria-invalid]"), function (f) {
          f.removeAttribute("aria-invalid");
        });
        status.classList.add("is-success");
        status.textContent = "Thank you, " + data.name + ". Your message has been received. We'll get back to you shortly.";
        status.focus();
      }).catch(function () {
        status.classList.add("is-error");
        status.textContent = "Sorry, something went wrong. Please try again, or call us directly.";
      });
    });
  }

  /**
   * TODO: Connect a form service.
   * Replace the body of this function with a real request, for example:
   *
   *   return fetch("https://formspree.io/f/YOUR_FORM_ID", {
   *     method: "POST",
   *     headers: { "Content-Type": "application/json", "Accept": "application/json" },
   *     body: JSON.stringify(data)
   *   }).then(function (res) { if (!res.ok) throw new Error("Request failed"); });
   *
   * Must return a Promise that resolves on success and rejects on failure.
   */
  function submitForm(data) {
    // eslint-disable-next-line no-console
    console.info("[Nayuuta] Form submit handler not connected yet. Data:", data);
    return Promise.resolve();
  }
})();
