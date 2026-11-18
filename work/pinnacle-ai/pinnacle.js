/* Pinnacle AI case study: the cinematic and interactive pieces.
   1. Opening: "~10 messages to 3". A thread plays the old flow (one
      question at a time, a counter ticking to 10), clears, then the new one
      (the agent proposes a whole week, the employee adjusts, the agent
      confirms: 3 messages) while a week schedule fills in.
   2. Try it: who decides? A week of events run under the three policies
      from decision 4, with counters for manager interruptions and for
      decisions made with no one's judgment; in "ask only when it's new" the
      busy-morning correction can be saved as a rule (decision 5).
   The diagrams build on scroll through the shared data-play (site.js).
   Plain script, works from file://. Reduced motion: final states, the
   interaction still works. Names and messages are illustrative. */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, parent) {
    var n = document.createElement(tag);
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

  /* ---------------- 1. opening: ~10 messages to 3 ---------------- */
  var BEFORE = [
    ["a", "Hi Maya, can you work Monday next week?"], ["e", "Yes, mornings"],
    ["a", "And Tuesday?"], ["e", "Not Tuesday"],
    ["a", "Wednesday?"], ["e", "After 2pm"],
    ["a", "Thursday?"], ["e", "Morning only"],
    ["a", "Friday?"], ["e", "Yes, morning"]
  ];
  var AFTER = [
    ["a", "Hi Maya, here's next week: Mon morning, Wed afternoon, Thu morning, Fri morning. Does that work?", ["Mon AM", "Wed PM", "Thu AM", "Fri AM"]],
    ["e", "All good, but can I swap Wednesday for Thursday afternoon?"],
    ["a", "Done. Mon morning, Thu morning and afternoon, Fri morning. You're confirmed.", ["Mon AM", "Thu AM", "Thu PM", "Fri AM"]]
  ];
  var DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function buildIntro(mount) {
    var fig = el("figure", { "class": "case-figure case-figure--wide pa-intro" });
    var stage = el("div", { "class": "pa-stage" }, fig);

    var left = el("div", { "class": "pa-thread-box" }, stage);
    var act = el("p", { "class": "pa-kicker", "aria-live": "polite" }, left);
    var thread = el("div", { "class": "pa-thread", "aria-hidden": "true" }, left);

    var side = el("div", { "class": "pa-side" }, stage);
    el("p", { "class": "pa-kicker", text: "Messages to settle one person's week" }, side);
    var count = el("p", { "class": "pa-count", text: "0" }, side);
    el("p", { "class": "pa-kicker pa-kicker--gap", text: "Maya's week" }, side);
    var week = el("div", { "class": "pa-week", "aria-hidden": "true" }, side);
    var cells = {};
    el("span", {}, week);
    DAYS.forEach(function (d) { el("span", { "class": "pa-week__day", text: d }, week); });
    ["AM", "PM"].forEach(function (h) {
      el("span", { "class": "pa-week__h", text: h }, week);
      DAYS.forEach(function (d) { cells[d + " " + h] = el("span", { "class": "pa-week__cell" }, week); });
    });

    var cap = el("figcaption", { "class": "pa-cap" }, fig);
    el("span", { text: "Decision 3: propose a schedule instead of asking questions. Illustrative conversation; no model change was needed." }, cap);
    var replay = el("button", { type: "button", "class": "pa-chip", text: "Replay" }, cap);
    mount.replaceWith(fig);

    var timers = [];
    function later(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function bubble(m) {
      var b = el("div", { "class": "pa-msg pa-msg--" + (m[0] === "a" ? "agent" : "person") }, thread);
      el("span", { text: m[1] }, b);
      if (m[2]) {
        var chips = el("span", { "class": "pa-msg__chips" }, b);
        m[2].forEach(function (c) { el("em", { text: c }, chips); });
      }
      if (!reduce) requestAnimationFrame(function () { b.classList.add("is-in"); }); else b.classList.add("is-in");
      return b;
    }
    function setWeek(list) {
      for (var k in cells) cells[k].classList.toggle("is-on", list.indexOf(k) > -1);
    }
    function showAfterFinal() {
      thread.innerHTML = "";
      act.textContent = "After · propose, then confirm";
      AFTER.forEach(bubble);
      count.textContent = "3";
      setWeek(AFTER[2][2]);
      fig.classList.add("is-after");
    }
    function play() {
      timers.forEach(clearTimeout); timers = [];
      if (reduce) { showAfterFinal(); return; }
      thread.innerHTML = ""; setWeek([]); count.textContent = "0"; fig.classList.remove("is-after", "is-clearing");
      act.textContent = "Before · one question at a time";
      var t = 300;
      BEFORE.forEach(function (m, i) {
        later(t, function () { bubble(m); count.textContent = String(i + 1); });
        t += m[0] === "a" ? 420 : 300;
      });
      t += 1100;
      later(t, function () { fig.classList.add("is-clearing"); });
      t += 500;
      later(t, function () {
        thread.innerHTML = ""; fig.classList.remove("is-clearing"); fig.classList.add("is-after");
        act.textContent = "After · propose, then confirm";
        count.textContent = "0";
      });
      t += 400;
      AFTER.forEach(function (m, i) {
        later(t, function () { bubble(m); count.textContent = String(i + 1); if (i === 0) setWeek(m[2]); if (i === 2) setWeek(m[2]); });
        t += i === 0 ? 1900 : 1300;
      });
    }
    replay.addEventListener("click", play);
    whenSeen(fig, play, 0.4);
  }

  /* ---------------- 2. try it: who decides? ---------------- */
  // kind: routine | silence | new | busy (busy can be covered by the saved rule)
  var EVENTS = [
    { day: "Mon", text: "Jordan can't do Tuesday evening, can do Wednesday", kind: "routine" },
    { day: "Mon", text: "Priya confirms her availability for next week", kind: "routine" },
    { day: "Tue", text: "Alex hasn't replied to the check-in", kind: "silence" },
    { day: "Wed", text: "Sam's flight is delayed: two morning shifts, and nobody at the store can cover", kind: "new" },
    { day: "Thu", text: "Chris drops Saturday; Taylor already offered to cover", kind: "routine" },
    { day: "Fri", text: "Busy morning: the schedule has three experienced people and a new hire", kind: "busy", first: true },
    { day: "Sat", text: "Festival nearby: another busy morning", kind: "busy" },
    { day: "Sun", text: "Two baristas swap shifts with each other", kind: "routine" }
  ];
  var MODES = [
    { key: "all", name: "Ask about everything", says: "Safe, but the manager still does the job." },
    { key: "new", name: "Ask only when it's new", says: "Routine work runs itself; the manager is interrupted only when their judgment matters." },
    { key: "never", name: "Never ask", says: "Fastest, but new situations get decided without anyone's judgment." }
  ];
  // what happens to an event: { who: agent | manager | alone, note }
  function outcome(ev, mode, rule) {
    if (mode === "all") return { who: "manager", note: "Sent to the manager" };
    if (ev.kind === "routine") return { who: "agent", note: "Handled by the agent" };
    if (ev.kind === "busy" && rule && !(mode === "new" && ev.first)) return { who: "agent", note: "Handled with the saved rule" };
    if (mode === "new") {
      if (ev.kind === "silence") return { who: "manager", note: "Followed up after 6 h, then to the manager" };
      if (ev.kind === "new") return { who: "manager", note: "Found cover at a nearby store; manager approves" };
      if (ev.first && rule) return { who: "manager", note: "Manager corrected it; saved as a rule" };
      return { who: "manager", note: "Sent to the manager", canRule: ev.first };
    }
    // never ask
    if (ev.kind === "silence") return { who: "alone", note: "Followed up, still silent: shift left unconfirmed" };
    if (ev.kind === "new") return { who: "alone", note: "Moved someone from another store without asking" };
    return { who: "alone", note: "Decided alone: three experienced and a new hire" };
  }

  function buildTry(mount) {
    var fig = el("figure", { "class": "case-figure case-figure--wide pa-try" });
    var top = el("div", { "class": "pa-try__top" }, fig);
    el("p", { "class": "pa-kicker pa-kicker--ink", text: "Try it · who decides?" }, top);
    var seg = el("div", { "class": "pa-seg", role: "radiogroup", "aria-label": "When the agent asks the manager" }, top);
    var segBtns = MODES.map(function (m) {
      var b = el("button", { type: "button", role: "radio", "aria-checked": "false", "data-mode": m.key, text: m.name }, seg);
      return b;
    });

    var stage = el("div", { "class": "pa-try__stage" }, fig);
    var list = el("ol", { "class": "pa-events", "aria-label": "A week of scheduling events" }, stage);
    var rows = EVENTS.map(function (ev) {
      var li = el("li", { "class": "pa-ev" }, list);
      el("span", { "class": "pa-ev__day", text: ev.day }, li);
      el("span", { "class": "pa-ev__text", text: ev.text }, li);
      var res = el("span", { "class": "pa-ev__res" }, li);
      var badge = el("span", { "class": "pa-badge" }, res);
      var btn = null;
      if (ev.first) {
        btn = el("button", { type: "button", "class": "pa-chip pa-chip--ink", text: "Save as a rule", hidden: "" }, res);
      }
      return { li: li, badge: badge, btn: btn, ev: ev };
    });

    var side = el("div", { "class": "pa-tally" }, stage);
    var tallies = {};
    [["manager", "Manager interruptions"], ["agent", "Handled by the agent"], ["alone", "Decided with no one's judgment"]].forEach(function (t) {
      var box = el("div", { "class": "pa-tally__item pa-tally__item--" + t[0] }, side);
      tallies[t[0]] = el("span", { "class": "pa-tally__n", text: "0" }, box);
      el("span", { "class": "pa-tally__label", text: t[1] }, box);
    });
    var rules = el("div", { "class": "pa-rules" }, side);
    el("p", { "class": "pa-kicker", text: "Saved rules" }, rules);
    var ruleText = el("p", { "class": "pa-rules__text", text: "None yet." }, rules);

    var say = el("p", { "class": "pa-say", "aria-live": "polite" }, fig);
    var cap = el("figcaption", { "class": "pa-cap" }, fig);
    el("span", { text: "Decisions 4 and 5, run on an illustrative week. The delayed flight is the real case; one case doesn't prove every exception works." }, cap);
    var reset = el("button", { type: "button", "class": "pa-chip", text: "Start over" }, cap);
    mount.replaceWith(fig);

    var mode = "new", rule = false, shown = {};
    function animateNumber(node, to) {
      var from = +node.textContent || 0;
      if (reduce || from === to) { node.textContent = to; return; }
      var t0 = performance.now();
      (function step(now) {
        var k = Math.min(1, (now - t0) / 400);
        node.textContent = Math.round(from + (to - from) * k);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }
    function render() {
      var n = { manager: 0, agent: 0, alone: 0 };
      rows.forEach(function (r) {
        var o = outcome(r.ev, mode, rule);
        n[o.who]++;
        r.li.dataset.who = o.who;
        if (r.badge.textContent !== o.note) {
          r.badge.textContent = o.note;
          if (!reduce) { r.badge.classList.remove("is-new"); void r.badge.offsetWidth; r.badge.classList.add("is-new"); }
        }
        if (r.btn) r.btn.hidden = !o.canRule;
      });
      for (var k in n) animateNumber(tallies[k], n[k]);
      tallies.alone.parentNode.classList.toggle("is-some", n.alone > 0);
      segBtns.forEach(function (b) {   // one tab stop for the group; arrows move inside it
        var on = b.dataset.mode === mode;
        b.setAttribute("aria-checked", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
      });
      ruleText.textContent = rule ? "On busy days (Fridays, good weather, festivals, school events), mornings need people with six months or more." : "None yet.";
      rules.classList.toggle("has-rule", rule);
      var m = MODES.filter(function (x) { return x.key === mode; })[0];
      say.textContent = m.says + (mode === "new" && !rule ? " Try saving Friday's correction as a rule." : "");
    }
    segBtns.forEach(function (b) {
      b.addEventListener("click", function () { mode = b.dataset.mode; render(); });
      b.addEventListener("keydown", function (e) {   // arrow keys move through the radio group
        var i = segBtns.indexOf(b), j = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : -9;
        if (j === -9) return;
        e.preventDefault(); j = (j + segBtns.length) % segBtns.length;
        segBtns[j].focus(); mode = segBtns[j].dataset.mode; render();
      });
    });
    rows.forEach(function (r) {
      if (!r.btn) return;
      r.btn.addEventListener("click", function () {
        rule = true; render();
        say.textContent = "Saved. The manager corrected it once, in their own words; the next busy morning is handled with the rule. (Whether the agent applies rules consistently is still being evaluated.)";
      });
    });
    reset.addEventListener("click", function () { mode = "new"; rule = false; render(); });

    render();
    if (!reduce) {
      fig.classList.add("is-waiting");
      whenSeen(fig, function () { fig.classList.remove("is-waiting"); }, 0.3);
    }
  }

  function init() {
    var intro = document.getElementById("pa-intro");
    if (intro) buildIntro(intro);
    var t = document.getElementById("pa-try");
    if (t) buildTry(t);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
