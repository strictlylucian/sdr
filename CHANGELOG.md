# Changelog

## 0.1.0-alpha.1

Experimental SDR — Sistem de Design Românesc, an independent proposal. First alpha release of the core and React packages. Documentation has a GitHub Pages deployment workflow.

- React components and shared core styles, tokens and DOM controllers.
- npm packages use the namespace: `@strictlylucian/sdr-core` and `@strictlylucian/sdr-react`.
- Exactly two portable runtime files: `sdr.css` and `sdr.js`, with embedded Inter and SVG motif masks.
- Four themes, two densities, shared spacing and canonical `sdr-u-*` utilities.
- Romanian/English documentation with React/HTML snippets, interactive previews and source-derived API tables.
- Component variants and pattern scenarios under canonical parent pages. Removed the 64 compatibility URLs and duplicate `sdr-!-*` utility aliases; use parent-page anchors and `sdr-u-*`.
- Generated inventories remove obsolete documentation pages, duplicate examples and old build assets after successful publication.
- Error, disabled and native read-only form states; fixed-value examples for controls without native readonly support.
- Stable fieldset error rails, associated messages and preserved answers during validation updates.
- React 18.3 and 19 compatibility checks cover isolated installed packages, matching types, full-catalogue SSR and native-browser hydration in Strict Mode. Native reset buttons refresh conditional fields and character counts after the reset completes.
- Motif provenance stays in the maintainer source record; consumer documentation and npm archives omit reference-attribution warnings.
- Optional conditional children for radios and checkboxes, shared across React and portable HTML. Inactive fields retain values while excluded from native validation, focus and submission; docs include bilingual nested-error examples.
- Choice controls align with the first label line, with hints below and spacing between containers. Error rails end at visible row content; horizontal radios have no enclosing frame, and error rings preserve native control geometry across browser engines.
- Shared semantic error/destructive-action palette, with theme-specific contrast adaptations.
- Documentation-only i18next and JSON-backed catalogue, variants, scenarios and form-state definitions. Applications own library labels, translations and formatters.
- Optional application-provided institutional emblems; separate experimental identity-study boards in the docs.
- Vitest component/controller coverage, installed-package checks and Playwright native/browser/catalogue verification.
- Staged documentation builds preserve served pages until a successful build is published locally.

All APIs remain experimental. Manual assistive-technology evaluation and user research are pending. No government affiliation or accessibility certification is claimed.
