(function () {
  "use strict";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var href = a.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start"
    });
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", href);
    }
  });

  var header = document.querySelector("[data-header]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-nav-menu]");
  var yearEl = document.querySelector("[data-year]");
  var reveals = document.querySelectorAll("[data-reveal]");
  var form = document.getElementById("contact-form");
  var formStatus = document.querySelector("[data-form-status]");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setHeaderScrolled() {
    if (!header) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("is-scrolled", y > 12);
  }

  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });

  if (navToggle && navMenu) {
    function setNavOpen(isOpen) {
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navMenu.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
    }

    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!isOpen);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("click", function (e) {
      if (!navMenu.classList.contains("is-open")) return;
      if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
      setNavOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) setNavOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && navMenu.classList.contains("is-open")) setNavOpen(false);
    });
  }

  if (!prefersReducedMotion()) {
    if ("IntersectionObserver" in window && reveals.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var delay = el.getAttribute("data-reveal-delay");
              if (delay != null && delay !== "") {
                el.style.setProperty("--reveal-delay", delay + "ms");
              }
              el.classList.add("is-visible");
              io.unobserve(el);
            }
          });
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (form && formStatus) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formStatus.classList.remove("is-success", "is-error");

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");
      var ok = true;

      if (!name || !name.value.trim()) ok = false;
      if (!email || !email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) ok = false;
      if (!message || !message.value.trim()) ok = false;

      if (!ok) {
        formStatus.textContent = "Please add your name, a valid email, and a message.";
        formStatus.classList.add("is-error");
        return;
      }

      formStatus.textContent = "Thanks — your message is ready to send. Connect this form to your backend or email service.";
      formStatus.classList.add("is-success");
      form.reset();
    });
  }
})();
