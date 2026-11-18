/* Estbuild case study: the cinematic and interactive pieces.
   1. Opening: a plan draws itself, an AI scan finds the work, and the
      estimate fills in line by line ("upload a plan, get an estimate").
   2. Try it: the missing-wall test. The visitor finds the wall the estimate
      left out, opens customization and adds it.
   (The 20-bids and accuracy diagrams build on scroll through the shared
   data-play in site.js and article.css.)
   Plain script, no build, works from file://. Without JavaScript the page
   keeps its static diagrams. With reduced motion everything is shown in its
   final state, and the interactive piece still works. Plan and figures are
   illustrative; the case study says so under each piece. */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SVGNS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, parent) {
    var n = tag.indexOf("svg:") === 0 ? document.createElementNS(SVGNS, tag.slice(4)) : document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function whenSeen(node, fn, threshold) {
    if (reduce || !("IntersectionObserver" in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold: threshold || 0.35 });
    io.observe(node);
  }

  /* ---------------- the plan, shared by the opening and the test ----------------
     A schematic floor plan (viewBox 400 x 300). Each piece of work has the line
     it becomes in the estimate. Quantities and prices are illustrative. */
  var ITEMS = [
    { key: "floor", name: "Flooring removal", qty: "1,040 SF", cost: 3120, scanX: 70 },
    { key: "long",  name: "Longest wall",     qty: "38 LF",    cost: 2280, scanX: 150 },
    { key: "wallA", name: "Interior wall A",  qty: "14 LF",    cost: 840,  scanX: 200 },
    { key: "door",  name: "Door",             qty: "1 EA",     cost: 150,  scanX: 222 },
    { key: "wallB", name: "Interior wall B",  qty: "14 LF",    cost: 840,  scanX: 270 },
    { key: "sink",  name: "Sink and fixtures", qty: "1 EA",    cost: 220,  scanX: 340 }
  ];
  function item(key) { for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].key === key) return ITEMS[i]; }

  var planCount = 0;
  function drawPlan(svg, drawable) {
    // drawable: strokes get pathLength=1 so the opening can draw them on
    var g = {}, id = "eb-room-" + (++planCount), L = drawable ? { pathLength: 1 } : {};
    function a(o) { for (var k in L) o[k] = L[k]; return o; }
    // flooring: a faint hatch in the lower-left room, clipped to the room
    var defs = el("svg:defs", {}, svg);
    var clip = el("svg:clipPath", { id: id }, defs);
    el("svg:rect", { x: 12, y: 152, width: 256, height: 136 }, clip);
    var floor = el("svg:g", { "class": "eb-part eb-floor", "data-key": "floor" }, svg);
    el("svg:rect", { "class": "eb-zone", x: 12, y: 152, width: 256, height: 136 }, floor);
    var hatch = el("svg:g", { "clip-path": "url(#" + id + ")" }, floor);
    for (var x = 30; x < 268 + 136; x += 18) {
      el("svg:line", { "class": "eb-hatch", x1: x, y1: 152, x2: x - 136, y2: 288 }, hatch);
    }
    g.floor = floor;
    // outer walls
    el("svg:rect", a({ "class": "eb-wall eb-outer", x: 10, y: 10, width: 380, height: 280 }), svg);
    // the longest wall, right across the plan
    var long = el("svg:g", { "class": "eb-part", "data-key": "long" }, svg);
    el("svg:line", { "class": "eb-hit", x1: 10, y1: 150, x2: 390, y2: 150 }, long);
    el("svg:line", a({ "class": "eb-wall", x1: 10, y1: 150, x2: 390, y2: 150 }), long);
    g.long = long;
    // wall A (upper), with a door opening near its foot
    var wallA = el("svg:g", { "class": "eb-part", "data-key": "wallA" }, svg);
    el("svg:line", { "class": "eb-hit", x1: 200, y1: 10, x2: 200, y2: 100 }, wallA);
    el("svg:line", a({ "class": "eb-wall", x1: 200, y1: 10, x2: 200, y2: 100 }), wallA);
    g.wallA = wallA;
    var door = el("svg:g", { "class": "eb-part", "data-key": "door" }, svg);
    el("svg:path", { "class": "eb-hit", d: "M200 100 L240 100 A40 40 0 0 1 200 140" }, door);
    el("svg:path", a({ "class": "eb-door", d: "M200 100 L240 100 M240 100 A40 40 0 0 1 200 140" }), door);
    g.door = door;
    // wall B (lower)
    var wallB = el("svg:g", { "class": "eb-part", "data-key": "wallB" }, svg);
    el("svg:line", { "class": "eb-hit", x1: 270, y1: 150, x2: 270, y2: 290 }, wallB);
    el("svg:line", a({ "class": "eb-wall", x1: 270, y1: 150, x2: 270, y2: 290 }), wallB);
    g.wallB = wallB;
    // sink in the upper-right room
    var sink = el("svg:g", { "class": "eb-part", "data-key": "sink" }, svg);
    el("svg:rect", { "class": "eb-hit", x: 314, y: 22, width: 56, height: 40 }, sink);
    el("svg:rect", a({ "class": "eb-fixture", x: 318, y: 26, width: 48, height: 32 }), sink);
    el("svg:circle", a({ "class": "eb-fixture", cx: 342, cy: 42, r: 8 }), sink);
    g.sink = sink;
    // room letters
    el("svg:text", { "class": "eb-tag", x: 208, y: 30, text: "A" }, svg);
    el("svg:text", { "class": "eb-tag", x: 278, y: 172, text: "B" }, svg);
    return g;
  }

  /* ---------------- 1. opening: plan to estimate ---------------- */
  function buildIntro(mount) {
    var fig = el("figure", { "class": "case-figure case-figure--wide eb-intro" });
    var stage = el("div", { "class": "eb-stage" }, fig);
    var planBox = el("div", { "class": "eb-plan" }, stage);
    el("p", { "class": "eb-kicker", text: "Plan" }, planBox);
    var svg = el("svg:svg", { viewBox: "0 0 400 300", role: "img", "aria-label": "A floor plan being read: walls, a door, flooring and a sink are found one by one and added to the estimate." }, planBox);
    var parts = drawPlan(svg, true);
    var scan = el("svg:line", { "class": "eb-scan", x1: 0, y1: 0, x2: 0, y2: 300 }, svg);

    var est = el("div", { "class": "eb-est" }, stage);
    el("p", { "class": "eb-kicker", text: "Estimate" }, est);
    var table = el("div", { "class": "eb-table", role: "table", "aria-label": "Generated estimate" }, est);
    var head = el("div", { "class": "eb-row eb-row--head", role: "row" }, table);
    ["Line item", "Qty", "Cost"].forEach(function (t) { el("span", { role: "columnheader", text: t }, head); });
    var rows = {};
    ITEMS.forEach(function (it) {
      var r = el("div", { "class": "eb-row", role: "row" }, table);
      el("span", { role: "cell", text: it.name }, r);
      el("span", { role: "cell", text: it.qty }, r);
      el("span", { role: "cell", text: money(it.cost) }, r);
      rows[it.key] = r;
    });
    var totalRow = el("div", { "class": "eb-row eb-row--total", role: "row" }, table);
    el("span", { role: "cell", text: "Total" }, totalRow);
    el("span", { role: "cell" }, totalRow);
    var totalEl = el("span", { role: "cell", text: money(0) }, totalRow);

    var foot = el("figcaption", { "class": "eb-cap" }, fig);
    el("span", { text: "Upload a plan, get an estimate: what Estbuild set out to do. Illustrative plan and figures." }, foot);
    var replay = el("button", { type: "button", "class": "eb-chip", text: "Replay" }, foot);

    mount.replaceWith(fig);

    var raf = 0;
    function reset() {
      cancelAnimationFrame(raf);
      fig.classList.remove("is-drawn", "is-done");
      ITEMS.forEach(function (it) { parts[it.key].classList.remove("is-found"); rows[it.key].classList.remove("is-on"); });
      totalEl.textContent = money(0);
      scan.style.opacity = 0;
    }
    function finish() {
      fig.classList.add("is-drawn", "is-done");
      ITEMS.forEach(function (it) { parts[it.key].classList.add("is-found"); rows[it.key].classList.add("is-on"); });
      totalEl.textContent = money(ITEMS.reduce(function (s, it) { return s + it.cost; }, 0));
      scan.style.opacity = 0;
    }
    function play() {
      if (reduce) { finish(); return; }
      reset();
      // 1) the plan draws itself (CSS, 1.4s), 2) the scan reads it, 3) the total settles
      requestAnimationFrame(function () { fig.classList.add("is-drawn"); });
      var t0 = performance.now(), DRAW = 1500, SCAN = 2400, total = 0, shownTotal = 0;
      (function frame(now) {
        var t = now - t0;
        if (t > DRAW) {
          var k = Math.min(1, (t - DRAW) / SCAN), x = 10 + k * 380;
          scan.setAttribute("x1", x); scan.setAttribute("x2", x);
          scan.style.opacity = k < 1 ? 1 : 0;
          ITEMS.forEach(function (it) {
            if (x >= it.scanX && !rows[it.key].classList.contains("is-on")) {
              parts[it.key].classList.add("is-found");
              rows[it.key].classList.add("is-on");
              total += it.cost;
            }
          });
        }
        shownTotal += (total - shownTotal) * 0.12;
        if (Math.abs(total - shownTotal) < 1) shownTotal = total;
        totalEl.textContent = money(shownTotal);
        if (t < DRAW + SCAN + 900) raf = requestAnimationFrame(frame);
        else fig.classList.add("is-done");
      })(t0);
    }
    replay.addEventListener("click", play);
    whenSeen(fig, play, 0.4);
  }

  /* ---------------- 2. try it: the missing-wall test ---------------- */
  function buildTry(mount, staticFig) {
    var inEstimate = ["floor", "wallA", "door", "wallB", "sink"];   // the longest wall was left out on purpose
    var fig = el("figure", { "class": "case-figure case-figure--wide eb-try" });
    var top = el("div", { "class": "eb-try__top" }, fig);
    el("p", { "class": "eb-kicker", text: "Try it · the missing-wall test" }, top);
    var steps = el("ol", { "class": "eb-steps" }, top);
    var stepEls = ["Find what's missing", "Customize", "Added"].map(function (t, i) {
      return el("li", { text: (i + 1) + " · " + t }, steps);
    });

    var stage = el("div", { "class": "eb-stage" }, fig);
    var planBox = el("div", { "class": "eb-plan" }, stage);
    el("p", { "class": "eb-kicker", text: "Plan · click what you see" }, planBox);
    var svg = el("svg:svg", { viewBox: "0 0 400 300", "aria-label": "Floor plan. Each wall, the door, the flooring and the sink can be selected." }, planBox);
    var parts = drawPlan(svg);
    ITEMS.forEach(function (it) {
      var p = parts[it.key];
      p.setAttribute("tabindex", "0");
      p.setAttribute("role", "button");
      p.setAttribute("aria-label", it.name);
      if (inEstimate.indexOf(it.key) > -1) p.classList.add("is-found");
    });

    var est = el("div", { "class": "eb-est" }, stage);
    el("p", { "class": "eb-kicker", text: "Estimate · generated by AI" }, est);
    var table = el("div", { "class": "eb-table", role: "table", "aria-label": "Generated estimate" }, est);
    var head = el("div", { "class": "eb-row eb-row--head", role: "row" }, table);
    ["Line item", "Qty", "Cost"].forEach(function (t) { el("span", { role: "columnheader", text: t }, head); });
    var rows = {};
    function addRow(it, mine) {
      var r = el("div", { "class": "eb-row is-on" + (mine ? " is-mine" : ""), role: "row" });
      var name = el("span", { role: "cell" }, r);
      name.appendChild(document.createTextNode(it.name + " "));
      el("em", { "class": mine ? "eb-state eb-state--mine" : "eb-state", text: mine ? "Added by you" : "AI" }, name);
      el("span", { role: "cell", text: it.qty }, r);
      el("span", { role: "cell", text: money(it.cost) }, r);
      rows[it.key] = r;
      return r;
    }
    inEstimate.forEach(function (k) { table.appendChild(addRow(item(k))); });
    var totalRow = el("div", { "class": "eb-row eb-row--total", role: "row" }, table);
    el("span", { role: "cell", text: "Total" }, totalRow);
    el("span", { role: "cell" }, totalRow);
    var totalEl = el("span", { role: "cell" }, totalRow);

    var actions = el("div", { "class": "eb-actions" }, est);
    var customize = el("button", { type: "button", "class": "eb-btn", text: "Customize" }, actions);
    var hint = el("button", { type: "button", "class": "eb-chip", text: "Hint" }, actions);
    var panel = el("div", { "class": "eb-panel", hidden: "" }, est);
    el("p", { "class": "eb-kicker", text: "Add a line" }, panel);
    var suggestion = el("div", { "class": "eb-row eb-row--suggest" }, panel);
    el("span", { text: "Longest wall" }, suggestion);
    el("span", { text: item("long").qty }, suggestion);
    el("span", { text: money(item("long").cost) }, suggestion);
    el("p", { "class": "eb-note", text: "The prepared correction, as in the test." }, panel);
    var add = el("button", { type: "button", "class": "eb-btn eb-btn--ink", text: "Add to estimate" }, panel);

    var say = el("p", { "class": "eb-say", "aria-live": "polite" }, fig);
    var cap = el("figcaption", { "class": "eb-cap" }, fig);
    el("span", { text: "A reconstruction of the test, not the shipped product. Illustrative plan and figures." }, cap);
    var again = el("button", { type: "button", "class": "eb-chip", text: "Start over" }, cap);

    mount.replaceWith(fig);
    if (staticFig) staticFig.hidden = true;

    var state;
    function total() { var s = 0; for (var k in rows) s += item(k).cost; return s; }
    function setStep(n) { stepEls.forEach(function (li, i) { li.classList.toggle("is-current", i === n); li.classList.toggle("is-done", i < n); }); }
    function start() {
      state = "find";
      if (rows.long) { rows.long.remove(); delete rows.long; }
      parts.long.classList.remove("is-found", "is-flag", "is-mine");
      panel.hidden = true;
      customize.classList.remove("eb-btn--ink");
      totalEl.textContent = money(total());
      say.textContent = "The AI has generated this estimate from the plan. Something on the plan didn't make it in. Can you find it?";
      setStep(0);
    }
    function flash(row) { row.classList.remove("is-flash"); void row.offsetWidth; row.classList.add("is-flash"); }
    function pick(key) {
      if (state === "done") return;
      if (key === "long") {
        if (state === "find") {
          state = "found";
          parts.long.classList.add("is-flag");
          customize.classList.add("eb-btn--ink");
          say.textContent = "Found it: the longest wall is on the plan but not in the estimate. Open Customize to add it.";
          setStep(1);
        }
        return;
      }
      flash(rows[key]);
      say.textContent = item(key).name + " is already in the estimate. Keep looking.";
    }
    ITEMS.forEach(function (it) {
      var p = parts[it.key];
      p.addEventListener("click", function () { pick(it.key); });
      p.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(it.key); } });
    });
    customize.addEventListener("click", function () {
      if (state === "done") return;
      if (state === "find") { say.textContent = "Customize is how an estimator corrects the AI. First, find what's missing on the plan."; return; }
      panel.hidden = false;
      say.textContent = "Here is the correction the test prepared. Add it.";
    });
    add.addEventListener("click", function () {
      state = "done";
      panel.hidden = true;
      customize.classList.remove("eb-btn--ink");
      var r = addRow(item("long"), true);
      table.insertBefore(r, totalRow);
      if (!reduce) { r.classList.remove("is-on"); requestAnimationFrame(function () { r.classList.add("is-on"); }); }
      parts.long.classList.remove("is-flag");
      parts.long.classList.add("is-found", "is-mine");
      // a fresh line: some browsers keep painting the old dash pattern after the animation stops
      var w = parts.long.querySelector(".eb-wall"); w.parentNode.replaceChild(w.cloneNode(false), w);
      var from = total() - item("long").cost, to = total(), t0 = performance.now();
      (function count(now) {
        var k = reduce ? 1 : Math.min(1, (now - t0) / 700);
        totalEl.textContent = money(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(count);
      })(t0);
      say.textContent = "That is the test. Participants spotted gaps like this and corrected them. It showed people can recognize missing work, not that they would catch every error.";
      setStep(2);
    });
    hint.addEventListener("click", function () {
      if (state === "find") say.textContent = "Compare the two sides: one wall on the plan has no line in the estimate. It runs right across the plan.";
      else if (state === "found") say.textContent = "Open Customize, under the estimate.";
      else say.textContent = "You've done it. Start over to try again.";
    });
    again.addEventListener("click", start);
    start();
  }

  function init() {
    var intro = document.getElementById("eb-intro");
    if (intro) buildIntro(intro);
    var tryMount = document.getElementById("eb-try");
    if (tryMount) buildTry(tryMount, document.getElementById("eb-try-static"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
