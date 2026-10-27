# Changelog

## Unreleased

- Step indicators centre labels against numbered circles, use heading leading and provide wider horizontal gaps. Study documentation displays all complete page examples together, in order, with the appropriate step selected and per-answer Change links. Four additional service studies cover infrastructure reporting, border-water fishing approval and two municipal clearance dossiers, with explicit checks for existing digital routes.

- Theme-aware altiță colours: dark uses flag-red and off-white stitches on a near-black ground, with dedicated motif roles; the existing SVG geometry, repeats and size variants are unchanged.

- Shared responsive typography: headings, legends, lead text, utilities and documentation use one small/large-screen scale at 40rem; body text remains 19px at every width. Size-specific heading rhythm accounts for existing layout gaps and preserves explicit overrides. Exported typographySmall accompanies the large-screen typography tokens.

- Responsive question spacing: 24px on small screens and 32px on desktop, with 16px/24px in compact density. Shared layouts place the gap between complete field groups while preserving label spacing, compound controls, explicit overrides and error-rail geometry.
- Bilingual digitisation/pilot studies and redesigns of existing official web forms, with source captures, field mapping and answer review. Case studies are visual baselines without validation or error states. Online examples cover immigration petitions and provisional-authorisation payment details, including attachments, email confirmation and a local demonstration total.
- Heading size utilities now share the complete heading typography. Fieldset legends use the same weight, leading and wrapping rules as headings.

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
