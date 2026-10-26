# Testing SDR

SDR uses Vitest with React Testing Library, user-event and jest-dom for component and portable-controller tests. Playwright Test covers browser behaviour that jsdom cannot reproduce. There is no custom browser runner.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run component, controller, sorting, contrast and documentation translation tests. |
| `npm run test:watch` | Run component tests while developing. |
| `npm run test:coverage` | Run the same suite with enforced V8 coverage thresholds. |
| `npm run build` | Build the library and bilingual static documentation. |
| `npm run test:e2e` | Run Playwright Test against the built documentation. |
| `npm run test:e2e:ui` | Open Playwright's interactive test runner. |
| `npm run test:packages` | Verify built assets and install the actual npm archives in an isolated consumer. |
| `npm run check` | Check source modularity, spacing tokens and bilingual documentation parity. |
| `npm run typecheck` | Type-check the library, examples, test suites and configuration. |
| `npm run verify` | Build and run all release checks. |

Install browser binaries once with `npx playwright install chromium firefox webkit`. CI uses `--with-deps` on Linux. Builds must finish before browser tests start. Playwright owns an http-server instance serving the built files on port 4322; the Astro LAN preview on port 4321 remains independent.

## Component tests

Tests live in `tests/unit/`, grouped by component family. They assert accessible names and descriptions, native form behaviour, callbacks, controlled input, refs, Unicode handling, rerendering, keyboard interaction and lifecycle cleanup. Assertions use public DOM roles, labels and user-visible states. Snapshot files are not a substitute for behaviour assertions.

Both React and portable HTML controllers are exercised. Portable tests check initialisation ownership, repeated initialisation, rollback, disposal, restoration of original markup, event contracts and sorting. Native dialog APIs and viewport media queries are stubbed locally where jsdom has no implementation. Those stubs do not constitute native-browser evidence; separate browser tests cover native focus and layout.

Coverage includes every TypeScript runtime file under `packages/core/src/` and `packages/react/src/`, including files not imported by tests. It excludes no runtime branches to raise the score. Minimum coverage is 90% lines, statements and functions, and 85% branches. A missed threshold fails the command. HTML, LCOV and JSON summary reports are generated under `coverage/`.

## Browser tests

Run `npm run test:packages` before browser tests. It installs the packed packages in isolated projects using React 18.3.0, 18.3.1, 19.0.0 and 19.2.0, checks their matching declarations, server-renders the complete example catalogue in both languages, and builds version-specific hydration fixtures. `tests/e2e/react-compat.spec.ts` uses those fixtures in Chromium, Firefox and WebKit, including Strict Mode effect setup/cleanup, generated IDs, refs, conditional fields, controlled updates, reset, validation, password reveal, character count, tabs, accordion and dialog. Hydration warnings and recoverable errors fail the tests.

`tests/e2e/` contains named Playwright tests with isolated browser contexts and automatic runtime-error assertions. Failures retain a trace and screenshot. HTML and JUnit reports are written to `playwright-report/` and `test-results/`. Tests have no automatic retries that could conceal an intermittent failure.

- Chromium runs the complete component and pattern catalogue in React and HTML, in Romanian and English, with axe checks and 320px/desktop/200% text reflow checks.
- Chromium, Firefox and WebKit run modal/backdrop/drag/focus, tab navigation, responsive navigation, password, payment, phone and full-page submission journeys.
- The full Page composition is tested as actual React and portable HTML. Its test-only React bundle is served from memory by Playwright routing and is never published with the docs.
- The skip-link journey uses real `Tab` navigation in all three browsers. SkipLink explicitly has `tabIndex={0}` in the library markup, preserving native tab order while remaining reachable with WebKit's restricted link-tabbing preference. The test harness does not rewrite tabindex or programmatically focus the link.
- Documentation tests cover variant selection, React/HTML source tabs, themes, density, national-yellow keyboard focus and the native no-JavaScript disclosure baseline.
- Form-state examples cover errors, disabled controls and native read-only fields, with SummaryList alternatives for controls without HTML readonly support. Availability journeys verify editing, focus and actual FormData inclusion/exclusion. Native date/time widgets retain browser-specific focus behaviour.
- Error-rail geometry tests compare the first text row and final control/group edge at 320px and 1280px in LTR and RTL, for Romanian and English React/HTML examples. Composite controls include their enclosing border and associated action.
- The documentation route audit checks every generated RO/EN page, internal documentation fragment and linked asset. Example controls are excluded from link crawling; their behaviour is covered by catalogue and journey tests.

Browser tests use public components and documented examples, with local demonstration data. They do not submit real applications, process payments or send messages. Tests check that demonstration submissions do not make POST requests.

## Build and package contracts

Build, font and release tooling lives in `tooling/`. Documentation generation lives in `tooling/docs/`. These modules build distribution files; component assertions belong to the test runners.

Documentation builds run in `.astro/sdr-build/` before publication to `dist/`. A failed build leaves the served version intact. Successful publication installs assets before HTML and replaces individual files through rename. Files outside the completed build inventory and empty directories are removed after publication. Tabs opened before a local rebuild may need a reload. Publication is not a whole-site atomic transaction. Quality tests cover incomplete builds, replacement and pruning obsolete outputs.

The package test project verifies the two-file portable contract, embedded-font hashes and Romanian glyph evidence, embedded SVG motif masks without raster or external assets, asset size budgets, browser-free ESM imports and the React client boundary. Motif geometry tests cover reference geometry, complete seam wrapping, lossless vectorisation and palette variables. Native-size React/HTML browser screenshots are compared pixel-by-pixel across three full repeats in all three engines. The package project also packs both npm workspaces, rejects library translation modules and i18next dependencies, installs those archives in a separate consumer and checks their actual public entrypoints with full declaration validation and server rendering. Consumer ambient types are limited to its own installed dependencies, excluding documentation-only MDX types.

Automated checks cover their fixtures. They do not replace manual assistive-technology testing or research with disabled participants, and they do not establish accessibility certification.

## GitHub Pages

`npm run build:pages` creates an isolated `/sdr/` deployment in `output/pages/sdr/`; `npm run test:pages` serves it at that prefix and crawls every generated HTML page and internal resource. Chromium, Firefox and WebKit verify hydrated sidebar variants, source links, the embedded Page and institutional-study assets. The normal localhost/LAN build remains separate.

## Choice visual checks

`tests/e2e/choice-content.spec.ts` captures React/HTML choice states in four themes across Chromium, Firefox and WebKit. Screenshots are saved under `output/playwright/choice-review/`, including 320px and enlarged-text profiles. Enlarged-text captures use an isolated React fixture and standalone HTML, while the documentation previews also undergo 320px/200% reflow checks. The Starlight shell itself still needs separate font-resize layout work. Component captures hide documentation chrome to avoid sticky-header overlap; actual documentation pages are also reviewed in the browser. Geometry assertions check first-line alignment, hint placement, unpadded row bottoms, error-rail boundaries and extended clickable label areas. Native PNG corner checks detect rectangular radio error borders that computed border-radius alone would miss.

`tests/e2e/conditional-choices.spec.ts` exercises related child fields in both editions and languages across all three engines. Checks include keyboard reveal order, independent checkbox branches, exclusive radio branches, retained values, actual FormData and native required-field validation, form reset, no-JavaScript availability, nested error/branch rail geometry, themes, densities, narrow layouts, RTL and enlarged text. Review captures live under `output/playwright/conditional/`. Unit tests additionally cover controlled React updates, dynamic children, nested choices, disabled fields and controller disposal.
