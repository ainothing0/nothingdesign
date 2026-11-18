# Case studies

These are published views of wiki case studies. Read the source and the wiki's
`AGENTS.md` and `CLAUDE.md` before changing the story. From this directory the
wiki is at `../../../wiki/`.

| Site page | Source relative to `wiki/` |
| --- | --- |
| `pinnacle-ai/index.html` | `01-Projects/Pinnacle AI/Pinnacle AI Case Study.md` |
| `estbuild/index.html` | `01-Projects/Estbuild/Estbuild Case Study (Aithraa Phase 2).md` |
| `aithraa/index.html` | `01-Projects/Aithraa/Aithraa Phase 1 Case Study.md` |

- Change the wiki source first, synchronize the site, then append to
  `wiki/log.md`. Preserve numbers, qualifications, source distinctions, and
  illustrative-mockup captions. Do not invent quotes or fill factual gaps.
- Use first-person prose with role, dates, team, results, and the reasoning
  behind decisions, following the source page's narrative.
- All current pages load `../../design-system/tokens.css`, `../../site.css`,
  `../../site.js` and `../article.css`. Reuse these;
  introduce page-specific CSS only when the shared layout cannot cover the need.
- Keep Aithraa and Estbuild's inline cross-links: they are two phases of the same
  venture. Check relative paths from each `<slug>/` directory.
- The Work grid lives in the site's `index.html`. A case-study file existing
  does not mean its card is published: Aithraa and PacAR are currently marked
  Coming soon. Preserve that state unless the task changes it.
- After shared CSS edits, check all three pages at desktop and phone widths,
  including navigation, diagrams, tables, images, captions, and focus styles.
- Tokens live only in `../design-system/tokens.css`. Follow
  `../design-system/README.md` when changing them.
