# Changelog

## Unreleased — 0.1.0-alpha.1

Experimental SDR — Sistem de Design Românesc, an independent proposal. Packages are prepared locally; npm publication has not occurred. Documentation has a GitHub Pages deployment workflow.

- React components and shared core styles, tokens and DOM controllers.
- Exactly two portable runtime files: `sdr.css` and `sdr.js`, with embedded Inter and SVG motif masks.
- Four themes, two densities, shared spacing and canonical `sdr-u-*` utilities.
- Romanian/English documentation with React/HTML snippets, interactive previews and source-derived API tables.
- Component variants and pattern scenarios under canonical parent pages. Removed the 64 compatibility URLs and duplicate `sdr-!-*` utility aliases; use parent-page anchors and `sdr-u-*`.
- Generated inventories remove obsolete documentation pages, duplicate examples and old build assets after successful publication.
- Error, disabled and native read-only form states; fixed-value examples for controls without native readonly support. Each state has a stable anchor and a nested sidebar link.
- Radio error outlines retain their circular shape; native switch controls remain square and errors stay inside control bounds. Error rails start at the first text line’s capital height.
- Stable fieldset error rails, associated messages and preserved answers during validation updates.
- Shared semantic error/destructive-action palette, with theme-specific contrast adaptations.
- Documentation-only i18next and JSON-backed catalogue, variants, scenarios and form-state definitions. Applications own library labels, translations and formatters.
- Optional application-provided institutional emblems; separate experimental identity-study boards in the docs.
- Vitest component/controller coverage, installed-package checks and Playwright native/browser/catalogue verification.
- Staged documentation builds preserve served pages until a successful build is published locally.

All APIs remain experimental. Manual assistive-technology evaluation and user research are pending. No government affiliation or accessibility certification is claimed.
