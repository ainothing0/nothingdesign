# nothingdesign site

This folder is the portfolio's Git repository. The parent `../AGENTS.md` covers
contributor conventions, and `../CLAUDE.md` documents the full site architecture
and working rules; read both when available. Paths below are relative to this
repository, not the parent portfolio workspace.

## Architecture

- `index.html`: home page, Work grid, and inline Three.js sphere implementation.
- `styles.css`: home page styling and an inline copy of the design tokens.
- `work/<slug>/index.html`: case-study pages; see `work/AGENTS.md`.
- `site.css` + `site.js`: site-wide base, wordmark, nav dock, page foot, theme
  switch (every page). `pages.css`: layout for `about/` and `book/`. `work/article.css`:
  shared article layout.
- `design-system/README.md`: v1 design-system brief (in progress). The old
  system is retired in `design-system/archive/v0-stone/`.
- `assets/`: the hero's centre-figure image (`human-conductor-aura.png`). Case-study screens go in project subfolders when they exist.

## Development

Keep plain HTML, CSS, and JavaScript. There is no package install, build, lint,
or automated test command. Preserve direct file opening and relative links.
Three.js and Google Fonts load over the network.

From this directory:

```sh
python3 -m http.server 8000
git status --short
git diff --check
```

The site is then at `http://localhost:8000/`. For the existing port-8743 server,
run `node .claude/server.js` from the parent `portfolio/` folder; its URL is
`http://localhost:8743/nothingdesign/`.

Match surrounding two-space formatting. Reuse shared CSS; keep visible keyboard focus, accessible control
labels, and reduced-motion support. Do not introduce a framework or dependencies
without an explicit task requiring that change.

## Content and verification

Brand the site `nothingdesign`. Case-study facts come from `../../wiki/` in this
workspace; read its guidance and source page before editing published copy. If
working from an isolated checkout without the wiki, obtain the relevant source
before changing factual claims. Do not infer results from archived drafts.

For visual or interaction changes, check desktop and phone widths, navigation,
images, case-study links, keyboard access, reduced motion, and console errors.
Check HTTP serving and direct file opening. Shared stylesheet changes require
checking every affected page. Do not commit, push, or change branches unless asked.
