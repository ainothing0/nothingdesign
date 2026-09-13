# Monolith — hero lattice

A hero section built on a 4×4 ring of tiles that rotates 90° clockwise on a
loop, behind a giant wordmark drawn on a difference-blend layer.

```
hero-lattice/
├── index.html    markup — ring order, wordmark, chrome
├── styles.css    all layout, the three transforms, the keyframes
├── ring.js       wordmark entrance + one plate swap per loop
└── README.md
```

No build step and no dependencies. Open `index.html` in a browser, or serve the
folder (`python3 -m http.server`) if you'd rather avoid `file://`.

---

## The mechanic

Three layers stack in the hero:

| z | layer | behaviour |
|---|---|---|
| 6 | chrome — brand, menu, corner chips, CTA | static |
| 3 | wordmark, full-bleed, vertically centred | static, drawn **over** the tiles |
| 2 | the ring | animated |
| — | page ground `#e7e7e7` | static |

The ring is a 4×4 grid **with the inner 2×2 cells empty** → 12 tiles forming a
hollow square. The hollow is deliberate: it's the gap the middle of the
wordmark reads through.

```
┌────┬────┬────┬────┐     ring index, clockwise from top-left
│ 0  │ 1  │ 2  │ 3  │
├────┼────┼────┼────┤       0   1   2   3
│ 11 │         │ 4  │       11  ·   ·   4
├────┤  empty  ├────┤       10  ·   ·   5
│ 10 │         │ 5  │       9   8   7   6
├────┼────┼────┼────┤
│ 9  │ 8  │ 7  │ 6  │
└────┴────┴────┴────┘
```

The whole ring rotates **90° clockwise** about the grid centre. Each tile
simultaneously counter-rotates **−90°**, so no plate is ever tilted at any
frame. Because a square ring is 4-fold symmetric, a quarter turn maps every
cell onto another cell — so one loop advances every image **3 positions
clockwise** (`newIndex = (i + 3) % 12`) and lands on a layout identical to
where it started. That's the whole trick.

At 45° through the turn the ring reads as a diamond. That's the payoff, and
the reason it doesn't just look like a carousel.

### Three transforms, one job each

Nesting matters. Collapsing any two of these onto one element breaks it.

| element | transform | why |
|---|---|---|
| `.ring` | `rotate()` | turns the square about its centre |
| `.tile` | `rotate()` — negative | keeps plates upright and axis-aligned |
| `.plate` | `scale()` | shrinks inside a **fixed** cell → opens the gutters |

The scale has to live one level below the counter-rotation, because `.plate`
is what carries `overflow: hidden`. Put the scale on `.tile` and the clipping
box rotates with it.

`transform-origin: 50% 50%` is required on both `.ring` and `.tile`, or the
counter-rotation won't cancel and the plates will visibly tilt.

---

## Geometry

Measured at a 1492 × 796 viewport:

| property | value | note |
|---|---|---|
| grid box | 720 × 720 | `min(90.5vh, 760px)`, centred both axes |
| cell pitch | 180px | **never changes** |
| plate at rest | 180px (100% of cell) | gutter = 0 |
| plate while spinning | 135px (75.2% of cell) | gutter = 45px total |
| orbit radius, corner tiles | 382px | constant — the ring does not bloom outward |

Sizing is **height-driven**, not width-driven. On a short wide window the grid
stays proportionally small; on a tall narrow one it exceeds the width during
the 45° pass. Below 900px the grid drops to ~85vw and the diagonal is clipped
by `overflow: hidden` on `.stage` — which is also what stops the 45° pass from
triggering a horizontal scrollbar.

---

## Timeline

One loop is **4.0s**. `t = 0` is the start of the rotation.

| t | duration | what |
|---|---|---|
| 0.00 → 0.85s | 850ms | every plate scales `1.0 → 0.752` |
| 0.00 → 1.65s | 1650ms | ring rotates `0 → +90°`, tiles counter-rotate `0 → −90°` |
| 1.65 → 2.32s | 670ms | **hold** — ring at rest, plates still small, gutters open |
| 2.32 → 2.72s | 400ms | plates scale `0.752 → 1.0`, mosaic goes flush |
| 2.72 → 4.00s | 1280ms | **hold** — flush, gapless |

The asymmetry is the rhythm: the shrink is slow (850ms) and happens *with* the
spin; the re-expand is snappy (400ms) and happens *after* a beat of stillness.
Collapsing these into one symmetric transition kills the effect.

### Easing

| track | curve | CSS |
|---|---|---|
| rotation | ~easeInOutExpo | `cubic-bezier(.85, 0, .15, 1)` |
| scale down | easeInOutCubic | `cubic-bezier(.65, 0, .35, 1)` |
| scale up | easeOutCubic | `cubic-bezier(.33, 1, .68, 1)` |

The rotation curve is extreme on purpose — it creeps for the first third,
snaps through the middle in ~0.3s, then asymptotes into place over a long
tail. Per-segment easing is declared *on the keyframes* via
`animation-timing-function`, with `linear` across the holds.

**No motion blur.** The plates stay sharp at every intermediate frame.

---

## Why the rotation track is 16s, not 4s

This is the one non-obvious decision in the file.

The naive version animates `0° → 90°` over one 4s loop and repeats. It breaks:
at the end of the iteration the ring sits at +90° and the tiles at −90°, and
both snap back to 0 at once — every image visibly jumps back 3 slots.

So the rotation runs a **16s track covering four quarter-turns** (4 × 90° =
360°), with the holds built into the keyframes. After 360° the state is
genuinely identical to 0°, so the restart is invisible. The scale runs on its
own 4s track; 16 divides evenly by 4, so the two stay locked forever with no
drift.

The alternative — incrementing a rotation counter in JS and letting a CSS
transition interpolate — also works, but it needs a JS timer as the clock and
the angle grows without bound. Pure CSS has neither problem.

---

## Plate swapping

The ring holds 12 plates; the pool has 16. Once per loop, one tile takes the
next waiting plate and hands its old one back, so the loop never reads as a
literal repeat.

The swap fires at **t ≈ 900ms** — peak rotational velocity, plate at 0.752
scale — where the eye can't track any single tile. A swap during a hold phase
reads as a pop.

`ring.js` re-anchors the swap clock on `visibilitychange`: browsers keep CSS
animations running in a hidden tab but throttle `setInterval`, so the two drift
out of phase otherwise.

---

## Swapping in real photography

The plates are CSS-drawn gradients (`.p1`–`.p16` in `styles.css`) so the folder
stays self-contained. To use real images instead:

1. Put an `<img>` inside each `.plate` — `width:100%; height:100%;
   object-fit:cover`. Leave the transforms exactly where they are.
2. **Preload the whole pool.** A tile swapping to an unloaded source mid-spin
   flashes the background colour.
3. Rework `swap()` in `ring.js` to set `img.src` rather than juggle classes.
4. Square sources only — anything else will letterbox inside the cell.

---

## Typography

| role | face | note |
|---|---|---|
| display | **Archivo** `wdth 112 / wght 900` | wide grotesque; loaded from Google Fonts |
| UI | Plus Jakarta Sans | brand, nav |
| utility | DM Mono | chips, CTA label, © |

The wordmark is `display:flex` + `justify-content:space-between`, so the
letters spread edge to edge at any viewport rather than relying on fixed
tracking. If you change the word, check it still fits — `white-space:nowrap`
means a long one will overflow rather than wrap; drop the `font-size` clamp.

---

## Accessibility

- **`prefers-reduced-motion`** is a full stop, not a slowdown. A 90° turn of a
  full-field element is exactly the kind of large-field motion that triggers
  vestibular problems. The mosaic holds flush and the plates cross-fade in
  place every 4s instead.
- The plates are decorative: the ring is `aria-hidden="true"` and nothing
  inside it is focusable. **If these become real portfolio links**, they each
  need an accessible name and a visible focus ring — and focus must pause the
  loop. That isn't wired up yet.
- The `‖` chip pauses and resumes the loop for anyone who wants it still.

---

## Known gaps

- The wordmark's `mix-blend-mode: difference` needs `.stage` to keep
  `isolation: isolate`. Remove it and the blend escapes to the page ground.
- Single-theme by design — the light ground is painted explicitly, so it holds
  on a dark host, but there's no dark palette.
- `--loop` in `styles.css` and `LOOP` in `ring.js` are the same number written
  twice. If you change the tempo, change both.
