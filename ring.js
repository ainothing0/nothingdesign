/* ============================================================
   Monolith — hero lattice

   The rotation itself is pure CSS (see styles.css). This file only handles
   the two things CSS can't: the one-shot wordmark entrance, and swapping one
   plate per loop so the ring never reads as a literal repeat.
   ============================================================ */

(function () {
  'use strict';

  var stage  = document.querySelector('.stage');
  var plates = Array.prototype.slice.call(document.querySelectorAll('.plate'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!stage || !plates.length) return;

  /* ---- wordmark entrance, once ----
     Armed before first paint so nothing flashes, and started only after the
     display face has loaded: if Archivo swaps in mid-animation the letters
     jump, and on a fast connection the whole sequence can finish before the
     page is even visible. */
  stage.classList.add('anim');

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.add('play'); });
    });
  });

  /* ---- plate pool ----
     Twelve plates are on the ring, four wait offstage. Once per loop one tile
     takes the next waiting plate and hands its old one back.

     The swap lands at t = 900ms: peak rotational velocity, tile at 0.752 scale.
     The eye can't track any single tile there, so the change is invisible.
     Doing it during a hold phase instead would read as a pop. */

  var POOL_WAITING = ['p13', 'p14', 'p15', 'p16'];
  var SWAP_AT      = 900;    // ms into the loop — peak velocity
  var LOOP         = 4000;   // must match --loop in styles.css

  var queue  = POOL_WAITING.slice();
  var cursor = 1;            // start at ring index 1, then walk forward

  function swap() {
    var plate    = plates[cursor % plates.length];
    var match    = plate.className.match(/\bp\d+\b/);
    if (!match) return;

    var outgoing = match[0];
    var incoming = queue.shift();
    queue.push(outgoing);
    cursor += 3;             // follow the same slot the ring advances each loop

    if (reduce.matches) {
      // Nothing is moving, so hide the change behind a cross-fade instead.
      plate.style.opacity = '0';
      setTimeout(function () {
        plate.classList.replace(outgoing, incoming);
        plate.style.opacity = '1';
      }, 600);
    } else {
      plate.classList.replace(outgoing, incoming);
    }
  }

  var timer = null;

  function startSwaps() {
    stopSwaps();
    timer = setTimeout(function () {
      swap();
      timer = setInterval(swap, LOOP);
    }, reduce.matches ? LOOP : SWAP_AT);
  }

  function stopSwaps() {
    clearTimeout(timer);
    clearInterval(timer);
    timer = null;
  }

  startSwaps();

  /* ---- pause toggle ---- */
  var btn = document.querySelector('.pause');
  if (btn) {
    btn.addEventListener('click', function () {
      var paused = stage.classList.toggle('paused');
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Resume the ring' : 'Pause the ring');
      btn.textContent = paused ? '▶' : '‖';
      if (paused) stopSwaps(); else startSwaps();
    });
  }

  /* Browsers keep CSS animations running in a hidden tab but throttle timers,
     so the swap clock drifts out of phase with the rotation. Re-anchor it
     whenever the page comes back. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopSwaps();
    else if (!stage.classList.contains('paused')) startSwaps();
  });
})();
