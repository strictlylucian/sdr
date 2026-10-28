# Changelog

## Unreleased

- Fix React PasswordInput returning to masked mode after editing a revealed password. React now owns visibility, input type and the toggle state together. Clarify that Toast renders in normal flow and applications own viewport placement.

- Expand the bilingual institutional identity study into seven related identities, with shared Wikimedia-derived vector artwork, inherited family colours, fixed proportions and service/header applications. This is documentation-only exploration, separate from the npm packages.

## 0.1.0-alpha.2 — 2026-10-27

### Library

- Add a shared responsive typography scale at 40rem for headings, legends, lead text and typography utilities. Body text remains 19px. Export `typographySmall` alongside the large-screen typography tokens.
- Give headings size-specific vertical rhythm within shared layouts, accounting for existing gaps and preserving explicit spacing overrides. Heading utilities and fieldset legends share the complete heading typography.
- Increase spacing between complete form questions to 24px on small screens and 32px on desktop, or 16px/24px in compact density. Preserve label spacing, compound controls and error-rail geometry.
- Fix excessive radio and checkbox option spacing when a Fieldset also uses Stack. Choice groups retain consistent option gaps and 48px single-line row pitch for comfortable controls.
- Centre step-indicator labels against their numbered circles, increase horizontal spacing and add responsive separation below the indicator.
- Adapt altiță colours to dark themes with flag-red and off-white stitches on a near-black background. Preserve SVG geometry, seamless repeats and size variants.

### Documentation

- Add a bilingual About the project section describing the motivation, fragmented public-service interfaces and opportunities for shared design resources and pilots.
- Explain the Distribution first approach: a framework-independent core with two portable runtime files, a React adapter and scope for community adapters.
- Add nine studies of official web forms, paper-service digitisation candidates and existing document redesigns. Include source captures, observed problems, field mappings and existing digital routes where available.
- Show every study step as a separate, complete page example, in order, with its own header, navigation, back link and selected step indicator. Examples are visual baselines without validation or real submissions.
- Preserve individual and legal-entity applicant choices where the source form provides them, with conditional fields and retained local values.
- Add direct per-answer Change links and Trimite / Submit buttons to review examples, with 32px/48px separation between review sections. Remove repeated Help blocks from study examples.
- Consolidate repeated alpha notices into the shared footer and align sidebar groups with the available study pages.

### Verification

- Extend component, installed-package and browser coverage for responsive typography, form and choice spacing, step indicators, theme-aware motifs and the complete study examples.
- Use installed Chrome for GitHub Pages deployment checks while retaining Chromium, Firefox and WebKit coverage in the full browser suite.

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
