/* nothingdesign — theme switch, and the case-study section index.
   Loaded in <head> without defer so the saved theme applies before
   first paint. A page with <html data-theme-lock> keeps its own theme. */
(function () {
  var root = document.documentElement;
  var locked = root.hasAttribute("data-theme-lock");
  root.classList.add("js");

  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (!locked && (saved === "light" || saved === "dark")) root.dataset.theme = saved;

  function current() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function label(button) {
    var next = current() === "dark" ? "light" : "dark";
    button.dataset.next = next;   // the icon shows the theme it switches to
    button.setAttribute("aria-label", "Switch to " + next + " theme");
  }

  /* Case studies: the section index sticks to the top and marks the
     section being read. */
  function sectionIndex() {
    var nav = document.querySelector(".case-index");
    if (!nav) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
    var strip = nav.querySelector(".case-index__scroll") || nav;
    function clipped() {   // fade the strip's end only while there is more to scroll to
      strip.classList.toggle("is-clipped", strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 2);
    }
    strip.addEventListener("scroll", clipped, { passive: true });
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
    var current = -1, ticking = false;
    function update() {
      ticking = false;
      nav.classList.toggle("is-stuck", nav.getBoundingClientRect().top <= 0.5);
      var line = nav.offsetHeight + 40, found = -1;
      targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= line) found = i; });
      if (found === current) return;
      current = found;
      links.forEach(function (a, i) {
        if (i === found) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
      if (found > -1 && strip.scrollWidth > strip.clientWidth) {
        var a = links[found];
        strip.scrollLeft = a.offsetLeft - strip.offsetLeft - (strip.clientWidth - a.offsetWidth) / 2;
      }
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", function () { update(); clipped(); });
    update();
    clipped();
  }

  /* Home: mark Work in the dock while the Work section is on screen. */
  function workSpy() {
    var section = document.getElementById("work");
    var link = document.querySelector(".site-nav__work[href='#work']");
    if (!section || !link) return;
    var ticking = false;
    function update() {
      ticking = false;
      var r = section.getBoundingClientRect(), on = r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
      if (on) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* Case studies: diagrams marked data-play build as they come into view
     (styles in work/article.css). Each shape gets its order in --i; lines
     marked d-line draw themselves. Reduced motion: shown as they are. */
  function scrollPlays() {
    var figs = document.querySelectorAll("[data-play]");
    if (!figs.length) return;
    var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    Array.prototype.forEach.call(figs, function (fig) {
      var i = 0;
      Array.prototype.forEach.call(fig.querySelectorAll("svg rect, svg text, svg line, svg circle, svg polyline, svg path"), function (n) {
        n.style.setProperty("--i", i++);
        if (n.matches(".d-line")) n.setAttribute("pathLength", "1");
      });
      if (still || !("IntersectionObserver" in window)) return;
      fig.classList.add("is-waiting");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.disconnect();
          fig.classList.add("is-playing");
          requestAnimationFrame(function () { requestAnimationFrame(function () { fig.classList.remove("is-waiting"); }); });
        });
      }, { threshold: 0.45 });
      io.observe(fig);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    sectionIndex();
    scrollPlays();
    workSpy();
    Array.prototype.forEach.call(document.querySelectorAll(".theme-toggle"), function (button) {
      label(button);
      button.addEventListener("click", function () {
        var next = current() === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch (e) {}
        Array.prototype.forEach.call(document.querySelectorAll(".theme-toggle"), label);
      });
    });
  });
})();
