# Design tokens

Read `README.md` for design rationale and `tokens.css` for reference values.
Some README paths describe the former directory layout; the current directory
is inside the site repository. Follow actual imports and the rules below.

The current home page and case studies do not import `tokens.css` directly.
For a shared token change:

1. Update `tokens.css`.
2. Synchronize the corresponding `:root` values in `../styles.css` and
   `../work/shared.css`.
3. Inspect the home page and all case studies for visual regressions, including
   desktop/phone widths and direct file opening.

Keep the neutral stone palette, light theme, and Plus Jakarta Sans. Display,
body, and utility font roles remain separate variables even when they resolve to
the same face. Reuse `--ease`, `--pad`, and `--radius-pill` for their shared roles.

Add shared tokens when a second page needs the value. Keep page-specific hero
geometry, choreography, and textures in their owning stylesheet or script.
Do not change how stylesheets are loaded as a side effect of editing tokens.
