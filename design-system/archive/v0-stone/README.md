# Portfolio design system

Shared visual foundation for every page in this portfolio. One file,
`tokens.css`, holds the primitives; each page's own stylesheet holds
whatever is specific to that page (layout, animation timing, one-off
textures) and reaches for these tokens for anything visual.

## Using it in a new page

```html
<link rel="stylesheet" href="../design-system/tokens.css">
<link rel="stylesheet" href="styles.css">
```

Load `tokens.css` first so page styles can override or extend it if a
page genuinely needs to.

## What's in it, and why

- **Color — one neutral (stone) scale, no accent.** `--ground` through
  `--stone-4` to `--ink`, plus `--paper` and a `--hair` line color.
  Hierarchy comes from contrast and motion, not color. Don't add an
  accent color speculatively — add it when a real page needs one, and
  reconsider whether the no-accent rule still holds.
- **Type — one face, three roles.** Everything is Plus Jakarta Sans.
  `--font-display` (headlines, weight 800), `--font-sans` (UI and body)
  and `--font-mono` (labels, chips, utility text, uppercase and
  letter-spaced) all resolve to it, so a role can get its own face later
  without touching pages. Pages set their own font-size/weight/tracking.
- **Motion — `--ease`.** The default curve for UI micro-interactions
  (hovers, toggles, small transitions). A page with its own large-scale
  choreography — a hero animation, a page transition — defines
  additional easing curves locally rather than overloading this one.
- **Spacing — `--pad`.** Fluid page-edge inset. If a page needs more
  than one spacing step, extend with `--pad-sm` / `--pad-lg` here
  rather than inventing ad-hoc values in the page stylesheet.
- **Shape — `--radius-pill`.** The one recurring radius (chips, CTAs).

## What stays out of this file

Anything true of only one page — hero geometry, loop/rotation timing,
a specific texture, a specific gradient — lives in that page's own
stylesheet, not here. `tokens.css` is a foundation, not a dumping
ground; it should only grow when a *second* page needs something a
first page already has.

## Current pages

| page | uses |
|---|---|
| [`nothingdesign/`](../nothingdesign/) | full token set (defined locally in `styles.css`) — hero (interactive Three.js sphere tracing the design process) plus an in-page `#work` section (card grid) below it |
| [`nothingdesign/work/aithraa/`](../nothingdesign/work/aithraa/) | `shared.css` + `../article.css`, no page-specific CSS |
| [`nothingdesign/work/estbuild/`](../nothingdesign/work/estbuild/) | `shared.css` + `../article.css`, no page-specific CSS |
| [`nothingdesign/work/pinnacle-ai/`](../nothingdesign/work/pinnacle-ai/) | `shared.css` + `../article.css`, no page-specific CSS |

The works list lives inline on the home page (`#work`), not as a separate page — only individual case studies get their own URL under `work/<slug>/`. `work/article.css` holds the hero/body/stat-grid/table language every case study shares — it started as `estbuild.css` before Pinnacle AI needed the identical layout, at which point it was renamed and generalized rather than duplicated. A new case study should link it directly and only add its own stylesheet if it genuinely needs something the shared layout doesn't cover.

Aithraa and Estbuild are phases of the same venture (Phase 1: a 3-sided marketplace, shut down over an IP-rights conflict; Phase 2: the pivot to demolition cost estimating) and link to each other inline where the prose naturally mentions the other phase.

**Why no page actually links this file.** Every page under `nothingdesign/` inlines its own copy of the tokens instead of linking `tokens.css` directly. Chrome (and other browsers) block a `file://` page from loading a stylesheet outside the directory tree of the file you opened — `design-system/` is a sibling of `nothingdesign/`, not a descendant, so a cross-directory link 404s silently for anyone who opens a page straight from disk instead of through a server, while looking fine when served over `http://`. Since this site's whole premise is "no build step, open the file," `tokens.css` stays the documented *reference* copy — update it first when a token changes, then hand-sync the inlined block in `nothingdesign/styles.css` and `nothingdesign/work/shared.css`.
