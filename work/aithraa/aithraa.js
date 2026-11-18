/* Aithraa Phase 1 case study: the cinematic and interactive pieces.
   1. Opening: matching by convenience vs matching on fit. Three startups and
      three courses; first the lines run through whichever professor knows
      the founder (and the needs don't match), then they re-route so goals,
      skills and timeline line up.
   2. Try it: match a startup brief to a course on fit (one option is the
      professor who knows the founder), then try to start the project and
      meet the IP wall, where Aithraa stopped.
   The diagrams build on scroll through the shared data-play (site.js).
   Plain script, works from file://. Reduced motion: final states, the
   interaction still works. Startups and courses are illustrative. */
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
  function whenSeen(node, fn, threshold) {
    if (reduce || !("IntersectionObserver" in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold: threshold || 0.35 });
    io.observe(node);
  }

  /* ---------------- 1. opening: convenience vs fit ---------------- */
  // Each startup needs three things; each course offers three. Matching keys: g (goal), s (skill), t (timeline).
  var STARTUPS = [
    { name: "Health-tech startup", needs: [["s", "UX research"], ["s", "Prototype"], ["t", "Fall"]] },
    { name: "Logistics startup", needs: [["s", "Data dashboard"], ["t", "Spring"]] },
    { name: "Retail startup", needs: [["s", "AR demo"], ["t", "Fall"]] }
  ];
  var COURSES = [
    { name: "HCI capstone", offers: [["s", "UX research"], ["s", "Prototype"], ["t", "Fall"]] },
    { name: "Data science capstone", offers: [["s", "Data dashboard"], ["t", "Spring"]] },
    { name: "Mixed-reality studio", offers: [["s", "AR demo"], ["t", "Fall"]] }
  ];
  var CONVENIENCE = [2, 0, 1];   // startup i -> course by whoever the professor knows
  var FIT = [0, 1, 2];

  function buildIntro(mount) {
    var fig = el("figure", { "class": "case-figure case-figure--wide ai-intro" });
    var box = el("div", { "class": "ai-stage" }, fig);
    var act = el("p", { "class": "ai-kicker", "aria-live": "polite" }, box);
    var W = 760, CW = 236, CH = 86, GAP = 22, TOP = 34, H = TOP + 3 * CH + 2 * GAP + 2;
    var svg = el("svg:svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Three startups and three university courses. Matched through whichever professor knows the founder, the needs and the courses don't line up; matched on goals, skills and timeline, each startup meets the course that fits." }, box);
    el("svg:text", { "class": "ai-col", x: 0, y: 14, text: "STARTUPS" }, svg);
    el("svg:text", { "class": "ai-col", x: W, y: 14, "text-anchor": "end", text: "COURSES (PROFESSOR + STUDENTS)" }, svg);
    var linkLayer = el("svg:g", {}, svg);

    function card(x, y, item, list, side) {
      var g = el("svg:g", { "class": "ai-card" }, svg);
      el("svg:rect", { "class": "ai-card__box", x: x, y: y, width: CW, height: CH, rx: 6 }, g);
      el("svg:text", { "class": "ai-card__name", x: x + 14, y: y + 26, text: item.name }, g);
      var cx = x + 14, chips = [];
      list.forEach(function (n) {
        var cg = el("svg:g", { "class": "ai-chip", "data-k": n[1] }, g);
        var r = el("svg:rect", { x: cx, y: y + 44, height: 24, rx: 4 }, cg);
        var t = el("svg:text", { x: cx + 8, y: y + 60, text: n[1] }, cg);
        var w = t.getComputedTextLength ? t.getComputedTextLength() + 16 : n[1].length * 7 + 16;
        r.setAttribute("width", w);
        cx += w + 6;
        chips.push(cg);
      });
      return { g: g, chips: chips, anchor: side === "l" ? [x + CW, y + CH / 2] : [x, y + CH / 2] };
    }

    mount.replaceWith(fig);   // in the page first, so text can be measured
    var L = STARTUPS.map(function (s, i) { return card(0, TOP + i * (CH + GAP), s, s.needs, "l"); });
    var R = COURSES.map(function (c, i) { return card(W - CW, TOP + i * (CH + GAP), c, c.offers, "r"); });

    function link(i, j, cls) {
      var a = L[i].anchor, b = R[j].anchor, mx = (a[0] + b[0]) / 2;
      var p = el("svg:path", { "class": "ai-link " + cls, d: "M" + a[0] + " " + a[1] + " C" + mx + " " + a[1] + " " + mx + " " + b[1] + " " + b[0] + " " + b[1], pathLength: 1 }, linkLayer);
      return p;
    }
    var bad = CONVENIENCE.map(function (j, i) { return link(i, j, "ai-link--bad"); });
    var good = FIT.map(function (j, i) { return link(i, j, "ai-link--good"); });
    var marks = CONVENIENCE.map(function (j, i) {
      var a = L[i].anchor, b = R[j].anchor;
      return el("svg:text", { "class": "ai-mark", x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 + 5, "text-anchor": "middle", text: "✕" }, svg);
    });

    var cap = el("figcaption", { "class": "ai-cap" }, fig);
    el("span", { text: "Matching by convenience, then matching on fit: the problem and Aithraa's pitch. Illustrative startups and courses." }, cap);
    var replay = el("button", { type: "button", "class": "ai-chip-btn", text: "Replay" }, cap);

    var timers = [];
    function setFit(on) {
      L.concat(R).forEach(function (c) { c.chips.forEach(function (ch) { ch.classList.toggle("is-match", on); }); });
    }
    function state(s) {
      fig.dataset.state = s;   // drawn: cards; bad: convenience lines; good: fit lines
    }
    function finish() {
      state("good"); setFit(true); act.textContent = "Aithraa · matched on goals, skills and timeline";
    }
    function play() {
      timers.forEach(clearTimeout); timers = [];
      if (reduce) { finish(); return; }
      setFit(false); state("cards"); act.textContent = "Today · matched through whoever the professor knows";
      timers.push(setTimeout(function () { state("bad"); }, 700));
      timers.push(setTimeout(function () { state("bad-marked"); }, 2200));
      timers.push(setTimeout(function () { state("clearing"); act.textContent = "Aithraa · matched on goals, skills and timeline"; }, 4300));
      timers.push(setTimeout(function () { state("good"); }, 4900));
      timers.push(setTimeout(function () { setFit(true); }, 6300));
    }
    replay.addEventListener("click", play);
    state("cards");
    whenSeen(fig, play, 0.4);
  }

  /* ---------------- 2. try it: match on fit, then start ---------------- */
  var BRIEF = { goal: "Test the idea with a cheap MVP", skills: "UX research, a clickable prototype", time: "One semester, starting in fall" };
  var OPTIONS = [
    { key: "data", name: "Data science capstone", who: "Professor A", skills: "Data analysis, dashboards", time: "Spring", fit: { goal: true, skills: false, time: false },
      says: "Real project, but the wrong skills and the wrong semester. The match fails before any work starts." },
    { key: "hci", name: "HCI capstone", who: "Professor B", skills: "UX research, prototyping", time: "Fall, one semester", fit: { goal: true, skills: true, time: true },
      says: "Matched on fit: goals, skills and timeline all line up. Now start the project." },
    { key: "xr", name: "Mixed-reality studio", who: "Professor C · knows the founder", skills: "AR, 3D", time: "Fall", fit: { goal: true, skills: false, time: true },
      says: "This is matching by convenience: the professor knows the founder, but the course teaches AR, not research and prototyping." }
  ];

  function buildTry(mount) {
    var fig = el("figure", { "class": "case-figure case-figure--wide ai-try" });
    var top = el("div", { "class": "ai-try__top" }, fig);
    el("p", { "class": "ai-kicker ai-kicker--ink", text: "Try it · match on fit, then start the project" }, top);
    var steps = el("ol", { "class": "ai-steps" }, top);
    var stepEls = ["Match", "Start"].map(function (t, i) { return el("li", { text: (i + 1) + " · " + t }, steps); });

    var stage = el("div", { "class": "ai-try__stage" }, fig);
    var brief = el("div", { "class": "ai-brief" }, stage);
    el("p", { "class": "ai-kicker", text: "Startup brief" }, brief);
    el("p", { "class": "ai-brief__name", text: "Health-tech startup" }, brief);
    var dl = el("dl", { "class": "ai-brief__list" }, brief);
    [["Goal", BRIEF.goal], ["Needs", BRIEF.skills], ["Timeline", BRIEF.time]].forEach(function (r) {
      var d = el("div", {}, dl); el("dt", { text: r[0] }, d); el("dd", { text: r[1] }, d);
    });

    var opts = el("div", { "class": "ai-opts", role: "radiogroup", "aria-label": "Choose a course" }, stage);
    el("p", { "class": "ai-kicker", text: "Pick a course" }, opts);
    var optEls = OPTIONS.map(function (o) {
      var b = el("button", { type: "button", role: "radio", "aria-checked": "false", "class": "ai-opt", "data-key": o.key }, opts);
      el("span", { "class": "ai-opt__name", text: o.name }, b);
      el("span", { "class": "ai-opt__who", text: o.who }, b);
      el("span", { "class": "ai-opt__meta", text: o.skills + " · " + o.time }, b);
      var fit = el("span", { "class": "ai-fit" }, b);
      [["goal", "Goals"], ["skills", "Skills"], ["time", "Timeline"]].forEach(function (f) {
        el("em", { "class": o.fit[f[0]] ? "is-yes" : "is-no", text: (o.fit[f[0]] ? "✓ " : "✕ ") + f[1] }, fit);
      });
      return b;
    });

    var startRow = el("div", { "class": "ai-start" }, fig);
    var startBtn = el("button", { type: "button", "class": "ai-btn ai-btn--ink", text: "Start the project", hidden: "" }, startRow);
    var wall = el("div", { "class": "ai-wall", hidden: "" }, fig);
    var u = el("div", { "class": "ai-wall__side" }, wall);
    el("p", { "class": "ai-kicker", text: "University" }, u);
    el("p", { "class": "ai-wall__claim", text: "Owns student work" }, u);
    el("p", { "class": "ai-wall__why", text: "By university policy" }, u);
    var mid = el("div", { "class": "ai-wall__mid", "aria-hidden": "true" }, wall);
    el("span", { text: "✕" }, mid);
    var st = el("div", { "class": "ai-wall__side" }, wall);
    el("p", { "class": "ai-kicker", text: "Startup" }, st);
    el("p", { "class": "ai-wall__claim", text: "Needs clean IP" }, st);
    el("p", { "class": "ai-wall__why", text: "It is paying for the work" }, st);

    var say = el("p", { "class": "ai-say", "aria-live": "polite" }, fig);
    var cap = el("figcaption", { "class": "ai-cap" }, fig);
    el("span", { text: "The matching as designed, then the wall it hit. Illustrative startup and courses; the IP positions are the real ones." }, cap);
    var again = el("button", { type: "button", "class": "ai-chip-btn", text: "Start over" }, cap);
    mount.replaceWith(fig);

    var picked = null;
    function setStep(n) { stepEls.forEach(function (li, i) { li.classList.toggle("is-current", i === n); li.classList.toggle("is-done", i < n); }); }
    function reset() {
      picked = null;
      optEls.forEach(function (b, i) { b.setAttribute("aria-checked", "false"); b.classList.remove("is-picked"); b.tabIndex = i === 0 ? 0 : -1; });   // one tab stop; arrows inside
      startBtn.hidden = true; wall.hidden = true; fig.classList.remove("is-walled");
      say.textContent = "A startup wants a cheap MVP to test its idea. Pick the course it should be matched with.";
      setStep(0);
    }
    function pick(key) {
      if (fig.classList.contains("is-walled")) return;
      var o = OPTIONS.filter(function (x) { return x.key === key; })[0];
      picked = o;
      optEls.forEach(function (b) {
        var on = b.dataset.key === key;
        b.setAttribute("aria-checked", on ? "true" : "false");
        b.classList.toggle("is-picked", on);
        b.tabIndex = on ? 0 : -1;
      });
      say.textContent = o.says;
      startBtn.hidden = !(o.fit.goal && o.fit.skills && o.fit.time);
    }
    optEls.forEach(function (b, i) {
      b.addEventListener("click", function () { pick(b.dataset.key); });
      b.addEventListener("keydown", function (e) {
        var j = e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : null;
        if (j === null) return;
        e.preventDefault(); j = (j + optEls.length) % optEls.length; optEls[j].focus(); pick(optEls[j].dataset.key);
      });
    });
    startBtn.addEventListener("click", function () {
      fig.classList.add("is-walled");
      startBtn.hidden = true;
      wall.hidden = false;
      if (!reduce) { wall.classList.remove("is-in"); requestAnimationFrame(function () { requestAnimationFrame(function () { wall.classList.add("is-in"); }); }); }
      else wall.classList.add("is-in");
      setStep(1);
      say.textContent = "This is where Aithraa stopped. Both positions were fixed. I looked for a way for students to transfer IP to the startup, but it needed buy-in from a key stakeholder that never came. No match ever ran.";
    });
    again.addEventListener("click", reset);
    reset();
  }

  function init() {
    var intro = document.getElementById("ai-intro");
    if (intro) buildIntro(intro);
    var t = document.getElementById("ai-try");
    if (t) buildTry(t);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
