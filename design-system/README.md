# nothingdesign design system — v1 (in progress)

Started 2026-11-16. The previous system (neutral stone scale, no accent, Plus
Jakarta Sans, pill radius) is retired and kept only for reference in
`archive/v0-stone/`. Nothing in it is a constraint on v1.

Everything currently on the site (copy, layout, hero, components) is a
**skeleton**: it says what the system has to hold, not how it should look.

## Status

The comparison pages used to choose type, color, the wordmark and the Work
layout (`specimens/*.html`) were moved out of the site on 2026-11-17 to
`portfolio/design-references/removed-from-site-2026-11-17/design-system/specimens/`. They no longer open
correctly from there (they link `tokens.css` and `site.css` by relative path)
and are kept as a record only.

Build order: (1) shared chrome, (2) case-study pages, (3) home page and hero,
(4) About and Book a call.

- **Step 1 done 2026-11-16.** Every page links `design-system/tokens.css`,
  `site.css` (base, wordmark, top bar, page foot, button) and `site.js` (theme
  switch, phone menu). `work/shared.css` is deleted.
- **Step 2 done 2026-11-16.** `work/article.css` is rewritten on v1 tokens, so
  Pinnacle AI, Estbuild and Aithraa all use the new case-study layout in both
  themes. No page markup or copy changed.
- **Step 3, Work section done 2026-11-16.** Wide cards (option C in
  `portfolio/design-references/removed-from-site-2026-11-17/design-system/specimens/work.html`): one full-width card per written-up project with a date
  label, name, role, link and one headline result on the left, a screen on the
  right. Three projects have full cards (Pinnacle AI, Estbuild, Aithraa); PacAR, not yet written, is a small card below. Images are the
  illustrative mockups from the case studies and should be replaced with final
  ones.
- **Step 3, hero layout final 2026-11-16 (owner's option C).** Headline alone at
  the top left; the sphere centred; the design process as one horizontal row
  under it, marking the stage nearest the viewer; the nav dock at the bottom
  centre. No hero button (Work is in the dock). Headline is still "A conductor
  who designs what agents show, and directs the rest."; the owner will trim it
  later and wants it to keep both "conductor" and "design". The centre figure
  uses the original image's own tones (inverted on a dark page).
- **Sphere rebuilt 2026-11-17 (owner asked for all six ideas).** New card face
  (stage number and name, progress dots, icon, tool or method in Instrument
  Serif; review with `index.html?cards`). The centre figure is the **original
  image, unchanged** (a generated point cloud was tried and rejected by the owner
  as inaccurate). **Opening (owner's choice):** dots scattered across the whole
  hero fly in and gather into the figure, then cross-fade to the image; the dots
  exist only for the opening. From `file://` the image is a plain `<img>` that
  fades in. Cards are smaller, lean toward the
  sphere's surface, go soft on the far side and turn translucent in front of the
  figure. A pulse runs each ring from Problem to Ship and drives the process
  row. Opening sequence and hover lift. Reduced motion: all still. Hovering a card (not
  the empty space around or between cards) eases the rotation to a stop and brings
  that card fully forward (owner's rule, checked 2026-11-17). Not yet runtime-tested: reduced motion.
- **Step 4 done 2026-11-17.** `about/index.html` (headline, bio, placeholder name
  and photo, path, education) and `book/index.html` (one Calendly button), both on
  `pages.css`. Copy lives in the wiki's `01-Projects/Design portfolio site.md`.
  The dock now has Work, About, the theme switch and Book a call; every "Book a
  call" on the site goes to the book page, which holds the only Calendly link.
  On small phones the theme switch moves from the dock to the page foot.
- **Case studies tightened 2026-11-17 (Estbuild, Pinnacle AI, Aithraa).** Same
  facts, less prose, more carried by visuals. Shared blocks in `work/article.css`:
  `timeline` (six-step strip, `timeline--4` for a flow), `case-index` (section
  links that stick to the top and mark the current section; logic in `site.js`),
  `team-strip`, `callouts` under annotated screens, `result-grid` (each result
  with its limit) and `shows` ("What this project shows"). Screens are
  placeholder wireframes (`.case-diagram.is-placeholder`) for the owner to
  replace. Earlier versions are archived in the wiki's `06-Archive/`.
- **Hero is live as "the console" (2026-11-17).** The owner chose lab version v3
  with the mirrored aura figure (`assets/human-conductor-aura.png`); it now runs
  in `index.html`. The two lab pages and the unused figure images were moved to
  `portfolio/design-references/removed-from-site-2026-11-17/` (`hero-labs/`,
  `assets/`). The notes below record how it got there.
  Later the same day the owner chose **visionOS-style glass cards**, now live:
  each pane frosts what is behind it (the scene rendered once without cards at
  half size, sampled with a large blur), with a tint, a top sheen and a lit rim;
  in light mode a fine darker edge defines it. A site icon (`favicon.svg`, the
  wordmark condensed to "nd") is linked from every page. A lab page,
  `hero-icons.html`, tried **three icons per stage** (one per ring, matched to
  that card's tool); the owner approved it and it is now live. The lab page is
  archived with the others in `design-references/.../hero-labs/`.
  A larger centre figure (`CENTER_H` 1.32 R) was tried; the owner preferred the
  original size, so it stays at 1.02 R.
- **Hero headline 2026-11-17.** After a round of options ("writes the score",
  "plays the melody", "composing experiences"…) the line is "*A conductor* who
  composes the experience, and cues when agents act.", set on three lines on
  desktop (`.hl-line`). It runs at the smaller size, option B
  (`h1.is-smaller`, max 32px); option A is the same line at full size (drop
  the class). Screenshots of both: `portfolio/design-references/headline-option-A.png`
  and `-B.png`. The temporary switcher is removed.
- **Nav refined 2026-11-17.** Fixed a bug: on the home page the dock sat inside
  the hero (`.stage`, which isolates its layers), so the Work screens scrolled
  over it; it is now outside the hero. The dock is frosted glass (same idea as
  the hero cards, no shadow). Work leads it: medium weight, a small ink count
  of case studies, and a filled state while the Work section is on screen
  (`workSpy` in `site.js`) or on a case study. The theme switch left the dock
  and the page foot: it is a 44px moon/sun icon fixed at the top right of every
  page (`.theme-switch`); the case-study index leaves room for it. Under 400px
  "Book a call" shortens to "Book".
- **Card icons revised 2026-11-17.** The clearest icon of each stage now sits on
  the centre ring (target, connected steps, screen with pointer, people, cycle,
  rocket), with its tool moved along so icon and tool still match. New icons:
  compass (Problem, top; a funnel was tried first), clipboard check (Test, top),
  pencil (Fix, top), spiral (Fix, centre; cycle arrows were tried first), paper
  plane and rocket (Ship, replacing the share arrow and the box).
- **Page foot after cobloc.archi (2026-11-17).** No footer block: two boxed
  fields (`.foot-chip`, 240×36, text left, icon right) in the bottom corners,
  "2026 nothingdesign ©" and "LINKEDIN ↳". From 1080px wide they sit on the
  same line as the nav dock at the end of the page. Other social links and the
  footer's Book a call button were dropped.
  The same box (thin border, 60% surface tint, light blur, 6px corners) now
  also draws the theme switch (36×36, top right, on the page edge) and the nav
  dock (46px tall, 36px items with 4px corners; each item keeps a 44px tap area
  through a transparent `::after`). Boxes were 32px at first; an accessibility
  check against the earlier 44px glass style (v1) found both pass AA, and the
  owner settled on 36px. The LinkedIn field's icon is a ↗ arrow.
  **Final 2026-11-17.** The case-study section index uses the same box: 36px
  links (6px corners, 60% surface tint, 44px tap area), the current section
  filled in ink, on a lightly frosted sticky bar whose links sit level with
  the theme switch. The links scroll inside `.case-index__scroll`, which stops
  short of the switch and fades its end while there is more to scroll.
- **Bigger nav and headline, and an opening that includes them (2026-11-17).**
  Nav dock items 40px with 16px text (wordmark 18px; dock 50px tall; the page
  foot fields stay 36px and still share its centre line). Headline at
  `clamp(28px, 2.9vw, 42px)` (option A's size and up; `.is-smaller` removed).
  Opening: while the dots gather, the role label and then each headline line
  rise in (0.25s, then 0.6s + 0.42s per line); as the rings swing in, the
  caption types "The design process" and the six stages land one by one
  (from 3.5s, 0.24s apart), each lit as it lands; at START_AT the process
  clock takes over. `introTick` in `index.html`, `.stage.is-intro` in
  `styles.css`. With reduced motion or without WebGL it does not run.
- **Headline first, with loading (2026-11-17).** On arrival the headline stands
  alone, centred (up to 1.5× on wide screens; on phones only centred
  vertically), the role and each line rising in. Nav and theme switch wait.
  Loading is shown only if it takes more than 0.7s: a quiet "LOADING" label
  and 120px hairline at the bottom centre, away from the headline, no numbers.
  It is accurate: the page script downloads the figure (about 1.9 MB, most of
  the bytes) itself and counts the bytes as they arrive (80% of the bar), then
  fonts (5%), the 3D library (10%) and the scene warm-up (5%); the hero script
  reuses that download (`window.heroFigure`). When the headline has been up
  3.2s AND everything is ready (or after 8s, or on any input) the line fades,
  the headline glides to its corner (1.2s) and the nav fades in; then the
  sphere starts (`window.heroGo`). Once per visit; skipped with reduced motion.
  Smoothness: `transform-origin` stays fixed through the glide, the sphere
  waits for the glide to end, and `prewarm()` builds every shader and uploads
  every buffer offscreen during the loading (no frame over 60ms measured).
  Headline 32px max on desktop. Test slow loading with
  `SLOW=400000 node .claude/server.js 8744` (bytes per second).
- **Estbuild: cinematic and interactive (2026-11-17).** Three pieces in
  `work/estbuild/estbuild.{css,js}`, plain SVG/HTML, no library: an opening
  (the case hero rises in; a schematic plan draws itself, an accent scan reads
  it, each found item lights in accent and drops into the estimate, the total
  settles; Replay), "Try it: the missing-wall test" (click the plan; items the
  AI found are accent with dashed "AI" tags, the missing wall flags with
  marching dashes, Customize offers the prepared correction, the added line is
  ink with a solid "Added by you" tag, matching the line-states decision; the
  closing note states the test's limit), and scroll plays for the 20-bids and
  accuracy diagrams. Accent = what the AI found; ink = what a person added.
  Reduced motion: final states, interaction intact. No JS: static diagrams.
- **Pinnacle AI: cinematic and interactive (2026-11-17).** `work/pinnacle-ai/
  pinnacle.{css,js}`: an opening that plays decision 3 as a thread (the old
  flow ticks a large counter to 10, clears, then propose → adjust → confirm in
  3 while "Maya's week" fills in accent), and "Try it: who decides?" (a
  segmented control for the three decision-4 policies over an illustrative
  week; badges: accent dashed = agent, ink = manager, `--failed` = decided
  with no one's judgment; counters for each; in "ask only when it's new" the
  Friday correction can be saved as a rule, after which Saturday is handled
  with it). Shared now in `article.css` + `site.js`: the case-hero entrance and
  `data-play` scroll plays (transitions run only while `.is-playing`, so the
  hidden state applies instantly; `d-line` draws itself). Estbuild moved onto
  the shared plays.
- **QA pass (2026-11-17).** All six pages at 1512, 768 and 390px, light and
  dark: no console errors, no horizontal scroll, no broken internal links or
  anchors, no duplicate ids, every control named, one h1 and no heading skips,
  text contrast AA everywhere except the wordmark's grey "nothing" (a logo,
  exempt). Fixed in this pass: Estbuild step labels and the loader label
  raised from --ink-3 to --ink-2; the policy switch is one tab stop (arrows
  inside); the file:// fallback figure was pushed right by its mirror flip
  (`scale` applied after the centring) and is centred again; short pages keep
  the page foot at the bottom (`body` is a column, `main` grows); link-preview
  tags (Open Graph) on every page, image and URL to add at deploy. Checked:
  reduced motion (no headline hold or loader; openings in final state;
  diagrams shown), keyboard use of both interactive pieces, file:// for every
  page, theme carried across pages.
  Hero figure: the owner keeps the full-quality PNG (about 1.9 MB) rather than
  WebP; the loading screen covers its download. Don't recompress it.
- **Aithraa: cinematic and interactive (2026-11-17).** `work/aithraa/
  aithraa.{css,js}`: an opening with three startups and three courses, first
  joined through whoever the professor knows (grey lines turning --failed with
  ✕ marks), then re-routed on fit (accent lines; matching tags light in
  accent); and "Try it: match on fit, then start the project" (a brief, three
  course options as one radio group, one of them the professor who knows the
  founder; per-option fit tags; the good match unlocks Start, which raises the
  IP wall with the real positions and the real ending). All three case
  studies now share the pattern: hero entrance, a cinematic opening, one
  interactive piece on the key decision, scroll-played diagrams.
- **Opening flash fixed (2026-11-17).** The process row used to show on load,
  fade out when the hero script arrived, then fade in again (every visit).
  Now `.stage` carries `is-intro` in the markup, so the row is hidden from the
  first paint (only with JS and motion allowed); the hero script takes it over
  (`window.heroIntroOwned`), and if it never runs the page shows the row after
  12s. The headline-first phase (`hl-first`) is likewise decided in `<head>`,
  before the first paint, so the headline can't flash on a slow load.
- **Hero v2 is a trial in `hero-v2.html` (2026-11-17), not live.** Unlinked lab
  page; `index.html` is unchanged. It has redesigned cards (the stage is the
  card's name; tool and its category below), three rings, a tilted orbit, depth
  of field, a choreographed turn that brings each stage to the front-left of the
  figure with the next stage front-right, threads that draw themselves, a caption
  with each stage's one-line definition, a light behind the figure, a camera
  push-in and pointer parallax, ambient dust, and a fade as you scroll away.
  If approved: move its script into `index.html`, its few CSS rules into
  `styles.css`, add the caption element, then delete the lab page. Stage
  definitions and some tool categories are draft wording for the owner to check.
- **Hero v3, "the console", is a second trial in `hero-v3.html` (2026-11-17).**
  Built on v2, opens in dark: glass panels with viewfinder corners, the rings
  drawn as fine instrument arcs with tick marks, a cursor meridian through the
  stage in focus, lines from the figure's left hand to that panel and from his
  right hand to the next, the panel in focus filled solid, and a caption that
  types itself out. A general holographic-console style, deliberately in the
  site's own black-and-white system. Only one of v2 and v3 should go live.
  **Owner chose v3 (2026-11-17)**, with three changes made: the hands send
  particle streams instead of straight lines; each transition draws along the
  orbit ring itself (no second line beside it); and the stage in focus sits
  front-right, held by the right hand, with the previous stage front-left.
  Later the same day: the hand particle streams were removed (owner didn't like
  them); a faint globe was added (an outline facing the viewer, four latitude
  lines and six meridians) so the whole reads as a sphere again with three card
  rings; and the opening now runs figure first, then every line draws itself on,
  then the cards arrive (about six seconds before the process starts).
  Then: the figure cues each stage with a **downbeat**, a thin ring (with a
  fainter echo) that ripples out from the figure; the stage's panel lights and
  pulses as the wave reaches it. The opening's dots now start anywhere on the
  screen, including behind the nav, because the canvas fills the whole hero
  and the sphere is framed above the bottom band with a view offset. The dark-
  mode haze behind the figure (its near-white ground, and the glow) is fixed,
  also on the live home page.
  Then: dragging sideways **scrubs the process** (one step of turn = one stage),
  so the panel in focus, the drawn path, the caption and the row always agree;
  on release it settles on the nearest stage and the clock carries on from
  there. Dragging up or down only tilts, and eases back. The opening uses about
  160,000 dots on desktop (60,000 on phones) spread over the full screen.
  Two new figure images from the owner (2026-11-17), generated from the prompt
  in this session: `assets/human-conductor.png` (conductor pose) and
  `assets/human-conductor-aura.png` (same pose with soft particle wisps; the chosen one). Both
  1024 × 1536 on near-white (254), so they cut out cleanly. The lab page has a
  switcher (`?figure=conductor|aura|original`, plus `&mirror`); mirroring puts
  the raised hand on the right, toward the stage in focus.
- **Nav is a floating dock** (owner, 2026-11-16): wordmark, Work, theme switch and
  Book a call in one bar fixed at the bottom centre of the window, on every page.
  The top of each page is empty. There is no phone menu; the dock fits as is.
- The temporary token bridge in `site.css` is gone; no stylesheet uses the
  retired names any more.
- Placeholders to replace, all marked `TODO(owner)` in the HTML: the Calendly
  link (`calendly.com/REPLACE-ME`, in `book/index.html` only), the social links
  in every page foot, and the name and photo on the About page.

## Who it's for (from the resume)

A product designer who "identifies the right problem, then solves it through
agentic interface design" and currently designs AI agents in production.
Background: design engineer → HCI research (MS) → founder → AI fellowship →
production agents. Research-led, candid about what failed, can build.

## Decisions to make, in order

1. **Audience and the one impression** — decided 2026-11-16: "I find the right
   problem, then design agents people trust." Two halves, both required:
   - *Right problem*: research-led and editorial. Calm reading, evidence,
     numbers and candid caveats up front.
   - *Agents people trust*: the site's own UI behaves like a well-made AI
     product (clear states, status, autonomy and trust patterns).
   Reader: a hiring manager on an AI product team, about 30 seconds.
2. Personality / aesthetic direction
3. Color (ground, ink, accent or none, semantic roles)
4. Type (faces, scale, roles)
5. Space and layout grid
6. Shape, borders, elevation
7. Motion
8. Components (below)
9. How tokens are loaded (inline per page vs. one linked file)

## Requirements (collecting before any visuals)

Status key: **known** = taken from the resume, wiki or site; **decided** =
answered by the owner; **open** = still to ask.

### A. Strategy
| # | Detail | Status |
|---|---|---|
| A1 | Primary reader and the one impression | decided (see decision 1) |
| A2 | Personality traits | decided: **quiet, precise, confident**. Must never feel: generic, overcrowded, or like showing off. Skill should be evident without being announced. Current in its design language, and unique in overall structure |
| A3 | References | decided: see "References" below |
| A4 | Roles targeted | decided: product designer at **AI labs and AI startups**, anywhere the role owns a product and solves a larger problem |
| A5 | What success looks like (interview requests, a specific application deadline) | open |

### B. Brand
| # | Detail | Status |
|---|---|---|
| B1 | Name: nothingdesign (same as resume heading) | known |
| B2 | Wordmark | **decided 2026-11-16: option B.** One word in Geist medium, tight tracking, lowercase: "nothing" in Ink 3 (grey), "design" in Ink. Chosen because the nav must not draw attention. Option C ("nothing" cut out of a solid block) was liked but is too heavy for the nav; it stays available for places that want a stronger mark (favicon, footer, about). See `portfolio/design-references/removed-from-site-2026-11-17/design-system/specimens/wordmark-nav.html` |
| B3 | Personal identity | decided: brand only (nothingdesign). Name and photo are **placeholders** on the about page for now |
| B4 | Voice: first person, candid about what failed, research-led | known |
| B5 | Tagline / hero line ("Designing something people need." is a placeholder) | open |

### C. Content the system must hold
| # | Detail | Status |
|---|---|---|
| C1 | Launch pages | decided: **Home, Work (Pinnacle AI + Estbuild case studies), About / bio, Book a call** (calendar link; URL still needed). Aithraa stays unlinked at launch |
| C2 | After launch | resume page, Aithraa, PacAR, Perplexity, Codexive case studies; the working agent (E2) |
| C3 | Case-study content types: facts strip, stats, quotes, decisions, diagrams, tables, figures, prototype embed | known (see skeleton) |
| C4 | Home hero | decided: keep the 3D process-sphere idea, restyle it in v1 |
| C5 | Links | decided: Book a call uses a **Calendly placeholder** the owner will replace. Social links: still placeholders |

### D. Visual foundations
| # | Detail | Status |
|---|---|---|
| D1 | Themes | decided: light and dark (follow system setting, with a toggle) |
| D2 | Color | decided: neutral black and white, plus **one accent** (blue as a placeholder; final hue later). Status colors: approved, agent components only |
| D3 | Type | decided: paid fonts allowed; owner plans to make their **own handwriting into a font**. Final mix (paid + handwriting, paid only, or handwriting only) chosen at the type step. Handwriting font does not exist yet |
| D4 | Density and layout: reading width, grid, breakpoints | open |
| D5 | Shape and depth | decided: **rounded corners, one consistent rule** (not square). Exact values proposed below |
| D6 | Imagery | decided: **Pinnacle AI = redrawn mockups; Estbuild = real screens and diagrams**. The system needs a frame for real screenshots, a mockup style, and one diagram style. Icons: open |
| D7 | Motion | decided: **purposeful**. State transitions plus a few meaningful moments (a diagram that builds, a status that updates). No scroll-driven reveals everywhere |

### E. Agent-UI language (the "agents people trust" half)
| # | Detail | Status |
|---|---|---|
| E1 | Which trust patterns the site itself should show (status, autonomy level, confidence, undo, source) | open |
| E2 | How agent-like the site is | decided: a **working agent** on the site, but **after launch**. v1 ships static; the system must already include the agent-UI components (conversation, status, sources) so the agent slots in later. It will need a backend, so the static rule gets revisited then |

### F. Delivery
| # | Detail | Status |
|---|---|---|
| F1 | Static HTML/CSS/JS, no build, opens from `file://` | known |
| F2 | Where the system lives | decided: code only (CSS tokens + components, documented here). No Figma library, no public page |
| F3 | Accessibility target (WCAG 2.1 AA assumed until told otherwise) | open |
| F4 | Later React port: still intended? | open |
| F5 | Deadline | decided: live **within a week (by 2026-11-23)**. Deploy target: decided after the site is finished. Scope v1 tightly; a custom handwriting font is unlikely to fit and can follow launch |

## References (2026-11-16)

Measured from the live sites. Cobloc's main view is a WebGL canvas that did not
render in the headless browser, so only its type, color and chrome are recorded;
the owner likes its **nav bar, menu, socials and Contact us treatment** (as inspiration, not to copy). Screenshots of those from the owner would help when the nav is designed.

| Site | Verdict | What it does |
|---|---|---|
| cobloc.archi (favorite) | like | White ground, black ink. Serif display (Ivory LL, regular weight) with a plain sans (Funnel Sans) and uppercase mono labels (DM Mono). **Zero border radius.** Logo built from primitive shapes. Almost no chrome: menu, language, contact. Slow, deliberate intro. |
| apollo.io | like | White content panel on a warm grey frame. Serif-ish display (72px, tight tracking) over a grotesque body. Black primary button, one acid-yellow accent, small radii (6 to 16px). Mono used for agent status ("VERIFYING"). |
| cursor.com | like | Warm off-white (#f7f7f4) with warm near-black ink (#26251e). One custom grotesque at regular weight; headline is small (26px), left-aligned, unshouted. Pill buttons. The product UI itself is the hero image. |
| louispaquet.com | like | Grey ground, one typeface at one size (Inter 18px, semibold). Structure comes only from a 3-column grid, hairline rules and arrows. Work is a plain list, not cards. No radius. |
| spacesheep.dev | dislike | Rounded-rectangle trend applied without a system: 12 different radii, 5 typefaces (including a script), several accent colors, badges and cards competing. Parts do not relate to each other. |

Added later by the owner (type reference): **instinct.com**. White page, one serif ("Aime", regular and semibold) set at only 24px for whole statements, GT America for small UI text, a hand-drawn ink figure as the mark, almost nothing else. The owner liked its Aime serif, but it could not be tested without the font files (see Foundations).

**What the liked sites share**
- Near-monochrome, with at most one accent.
- Very few typefaces, each with one job; regular weights, hierarchy from size and position rather than boldness.
- One shape rule applied everywhere (all square, or all one radius family).
- Sparse chrome and generous empty space; the work or the product is the visual.
- Mono or small caps used for labels and status.
- Structure from grid and hairlines rather than boxes and shadows.

**What to avoid (from the disliked site)**
- Many radii, many fonts, many accents.
- Decorative badges and script flourishes.
- Components that look designed separately.

## Foundations (approved by the owner 2026-11-16)

Approved in principle, including the serif display role. Exact values and typefaces are still to be set; none are in the site yet.

**Negative space (owner, 2026-11-16).** Empty space is a tool the system may use wherever it suits: generous margins, isolated elements, and shapes or marks formed by what is left out. It also fits the name.

**Attention (owner, 2026-11-16).** The nav stays quiet. On the home page all attention belongs to the hero; chrome never competes with it.

**Principle.** Two voices, one system. The *editorial* voice (serif display,
generous reading column) carries "I find the right problem". The *instrument*
voice (small uppercase labels, status, hairlines) carries "agents people trust".

| Foundation | Proposal |
|---|---|
| Color | **Approved by the owner 2026-11-16.** Values in `tokens.css`, shown in both themes in `portfolio/design-references/removed-from-site-2026-11-17/design-system/specimens/color.html`. **Pure neutral black and white** (the first proposal was warm-tinted; the owner asked for neutral): ground, surface, sunk, then three ink steps. Body and secondary text pass WCAG AA on every ground in both themes; Ink 3 is for borders and icons only. **One accent, blue as a placeholder "for now"** (`#2347d6` light, `#8fa8ff` dark; final hue still to be chosen), for links, focus and one highlighted action per view. **Four status colors approved** (working, done, needs review, failed), reserved for agent components; "needs review" is violet so it does not read as the accent |
| Type roles | **Decided 2026-11-16: two families, Instrument Serif and Geist.** **Instrument Serif**: large page headlines, section headings, stat values, pull quotes. **Geist**: cards, buttons, facts, diagrams, captions, navigation, and labels (small uppercase, no mono); confirmed. **Paragraphs: Geist for now**; the owner may revisit a serif (Newsreader, or Aime if its files are ever licensed). **Note** (after launch): the owner's handwriting, for annotations only |
| Type faces | Both free. `portfolio/design-references/removed-from-site-2026-11-17/design-system/specimens/type.html` opens on the chosen pairing and keeps one control, paragraphs in Geist or Newsreader, for the open question. Aime (the serif on instinct.com) was wanted but never tested: no font files or licence, foundry unconfirmed. Set aside: quiet statements, Funnel Sans, Hanken Grotesk, mono labels, Newsreader for cards and labels |
| Type scale | Body 17 to 18px, reading column about 68 characters, 6 sizes on one ratio. Hierarchy from size and position, weights stay regular/medium |
| Space | 4px base. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. 12-column grid, fluid page inset |
| Shape | One rule, one radius family: **containers and buttons are 12px; anything nested inside a container (chips, inner fields, thumbnails) is 6px**. No pills. **Corners are smoothed** (owner, 2026-11-16: Figma corner smoothing 60%): `corner-shape: squircle` where the browser supports it, with radii stepped up to 16px / 8px there so the visual size matches; other browsers keep plain 12px / 6px. Hairline borders, no shadows; depth comes from ground tone |
| Motion | Three durations (120, 240, 480ms), one easing curve. Used for state changes and a few built moments. All of it off under reduced motion |
| Accessibility | WCAG 2.1 AA in both themes; visible focus ring; 44px touch targets |
| Loading | One linked `design-system/tokens.css` (v1 draft exists; specimens use it, the site does not yet), replacing the copies inlined in each page |

## Skeleton: what the system has to cover

Inventory taken from the current site. Names are the existing class names.

| Area | Pieces |
|---|---|
| Home chrome (v0 names; now `site-header` dock, `wordmark`, `site-nav`, `site-footer`) | `topbar`, `brand` (wordmark + dot), `site-nav`, `bottombar`, `chip`, `cta` |
| Home hero | `stage`, `hero-copy`, `hero-actions`, sphere canvas (process: Problem → Flow → Prototype → Test → Fix → Ship) |
| Work section | `work-intro`, `work-grid`, `work-card` (title, role, meta, summary, status, cta), placeholder state |
| Case study | `case-hero` (eyebrow, dek, meta, status, tldr), `case-facts`, `case-body`, `stat-grid` / `stat`, `pull-quote`, `decision` (label, options), `case-figure` (+ empty slot), `case-diagram`, `table-scroll`, `tbd`, `case-footer` |
| Shared | `site-header`, `site-footer`, `btn` (primary, soft), focus states |
| Not built yet | contact section, bio / intro, prototype embed slot |

## Fixed constraints (not design decisions)

- Static HTML/CSS/JS, no build step, opens from `file://`.
- Works at desktop and phone widths.
- Respects `prefers-reduced-motion`; visible keyboard focus; labelled icon controls.
- Case-study facts come from the wiki, not from here.
