import { localisationContent, projectContent } from './content';
export const guidesEn: Record<string, { title: string; body: string }> = {
  about: { title: 'About the project', body: projectContent.en },
  'getting-started': { title: 'Get started', body: `
SDR stands for **Sistem de Design Românesc** (Romanian Design System). It is an **independent proposal, implemented as an experimental alpha**, not an official Romanian government system.

## Run this workspace

Use Node 22.23.4 or later and npm 11. This workspace also pins a local Node runtime for npm scripts.

~~~sh
npm ci
npm run build:library
npm run docs:generate
npm run dev
~~~

Open /ro/ or /en/ on the local server. Run npm run verify for source checks, type checking, unit tests, the production documentation build and browser checks. Install all browser engines with \`npx playwright install chromium firefox webkit\`. Linux runners use \`npx playwright install --with-deps chromium firefox webkit\`.

## Use React

~~~sh
npm install @strictlylucian/sdr-core@alpha @strictlylucian/sdr-react@alpha
~~~

The alpha uses matching versions of the core and React packages. React and React DOM are peer dependencies supplied by the application. Source contributors can build local archives with npm run pack:release.

~~~tsx
import { SdrProvider, Button, Stack, TextInput } from '@strictlylucian/sdr-react';
import '@strictlylucian/sdr-core/styles.css';

export function Application() {
  return <SdrProvider lang="ro" theme="light">
    <form onSubmit={event => event.preventDefault()}><Stack><TextInput label="Nume complet" name="name" autoComplete="name" />
      <Button type="submit">Continuă</Button></Stack></form>
  </SdrProvider>;
}
~~~

Place submit buttons inside the host application form. Use SdrProvider at the application boundary, rather than once per component. It supplies theme, density and scoped base styling; the native lang attribute is passed through without selecting translations.

## Use two portable files

Copy dist/portable/sdr.css and dist/portable/sdr.js to your own static assets. Supply semantic HTML using the component examples, include the CSS and deferred script, then call SDR.init(document) from your application script. The CSS contains all themes. The JavaScript contains all enhancement controllers. No fonts, icons, chunks or remote resources are fetched by SDR.

Include the assets once in your page template, in this order:

~~~html
<link rel="stylesheet" href="/assets/sdr.css">
<script src="/assets/sdr.js" defer></script>
<script src="/assets/app.js" defer></script>
~~~

In your application file, /assets/app.js:

~~~js
const dispose = SDR.init(document);
~~~

For character-count controls, init also requires a formatCount(remaining, element) callback supplied by the application. Negative values mean the limit has been exceeded; wording and plural rules belong to the host translation system. Password and accordion action labels are supplied in the HTML data attributes shown in their examples.

~~~js
PORTABLE_COUNT_EXAMPLE
~~~

The data-sdr-component attributes in the HTML examples opt into enhancement. Call dispose() before removing enhanced content, and SDR.init(container) after inserting new content. app.js belongs to your application, not the SDR distribution.

Interactive documentation examples also use demonstration wiring from portable-demo.js. The data-sdr-pattern-demo, data-sdr-toast-show and data-sdr-toast-example attributes belong to the examples, not the SDR API. The application controls toast presentation; the library handles dismissal and focus restoration. They do not enable payments, messaging or server persistence. A consuming service implements those actions.

Example IDs are illustrative, such as email and email-error. Choose descriptive IDs that are unique within your page, and keep for, aria-describedby, aria-labelledby, aria-controls and href anchors matched to them.

The host implements business actions, persistence and server validation. In the portable edition, CookieBanner, Feedback and DismissibleChip emit sdr:action with detail.action; Toast emits sdr:dismiss. Ordinary buttons use native events. React examples with callbacks need equivalent host action wiring in an HTML application.

The two-file promise concerns SDR runtime assets; your HTML and business logic remain part of your application. For a strict CSP, keep initialisation in an external application file. Embedded fonts require data: in font-src, for example \`font-src 'self' data:\`. Embedded SVG motif masks also use data: in img-src. SDR does not require unsafe-eval.

## Supported baseline

Modern browsers with native dialog, details, CSS custom properties and ES2022 support. Playwright runs native interaction tests in Chromium, Firefox and WebKit; Chromium also checks the complete React/HTML catalogue with axe, narrow layouts and 200% text. WebKit automation is not a manual Safari/iOS test. NVDA, VoiceOver, TalkBack and real-user research remain unverified. Essential forms should submit to a server without JavaScript. Dialog-only features need an accessible alternative route if JavaScript is unavailable.
` },
  architecture: { title: 'Architecture and contracts', body: `
## Package boundaries

- packages/core: tokens, styles and DOM enhancement controllers; application-owned labels and formatters.
- packages/react: typed React components and service compositions. React remains a peer dependency.
- dist/portable: exactly sdr.css and sdr.js.
- apps/docs: Astro Starlight, bilingual MDX, live React examples and portable HTML examples.
- catalog: component guidance and service-pattern guidance.

Both adapters use the same styles and enhancement controllers. Native HTML is the baseline. Data attributes are an explicit public enhancement contract, not selectors tied to incidental document structure.

## Lifecycle

SDR.init(root) enhances opted-in descendants and the root itself. Repeated initialisation does not duplicate listeners. The returned disposer releases only components mounted by that call. SDR.destroy(root) releases every enhanced component in a removed subtree. Call init again after inserting HTML. React-owned roots are skipped by the portable initializer.

Uncontrolled enhancements accept initial state. Tabs defaultSelected and ToggleButton defaultPressed are initial values, not controlled props. React reinitialises tabs when its item configuration changes. Host applications own routing, network requests, storage, validation, analytics and consent enforcement.

## Events

CookieBanner, Feedback and DismissibleChip emit sdr:action with detail.action in the portable edition. Actions are accept, reject, helpful, unhelpful and remove. React exposes corresponding callbacks. Toast emits sdr:dismiss after moving focus to the configured destination. Listen on a local container and remove host handlers when disposing it.

## Styling contract

Component classes start sdr- and tokens start --sdr-. Components use logical properties. One spacing source generates variables, layout gaps and override classes. Tokens and shared primitives provide consistent customisation points across a service.

## Versioning

0.1.0-alpha.1 is experimental. Breaking alpha changes must be documented. A stable release requires API review, disabled-user research, manual browser and screen-reader qualification and a published support policy.
` },
  'foundations/spacing': { title: 'Spacing and layout', body: `
Spacing is a contract. Every component gap, padding and margin uses the shared scale. The source checker rejects arbitrary authored spacing in library and documentation styles, with a documented exception for the off-screen accessibility utility.

| Token | rem | At 16 px/rem | Intended role |
|---|---|---|---|
| 0 | 0 | 0 | Reset |
| 1 | .25 | 4 px | Fine separation |
| 2 | .5 | 8 px | Label and hint |
| 3 | .75 | 12 px | Control group |
| 4 | 1 | 16 px | Content inset |
| 5 | 1.5 | 24 px | Form group |
| 6 | 2 | 32 px | Layout gutter |
| 7 | 3 | 48 px | Section |
| 8 | 4 | 64 px | Large editorial section |
| 9 | 6 | 96 px | Major editorial separation |

The source uses rem so user font preferences are preserved. Semantic aliases include --sdr-field-gap, --sdr-form-group-gap, --sdr-group-gap, --sdr-section-gap and --sdr-layout-gap. A single shared alias controls all components in that role.

Stack arranges vertical groups, Cluster allows actions to wrap, Grid arranges repeated content, Container aligns page gutters and SidebarLayout positions contextual navigation. Gap-based spacing avoids accumulating adjacent child margins. Smaller spaces within groups help distinguish them from neighbouring groups.

Grid with columns=2 or columns=3 caps the column count while retaining a 16rem minimum for each column. The actual count follows the space available to the component, including a narrow container on a wide screen. SidebarLayout stacks when navigation and content no longer fit side by side. The main container is capped at 64rem and prose at 68ch. Tables scroll inside their own labelled, keyboard-focusable region.

Semantic spacing is responsive: --sdr-group-gap changes from 16px to 24px, --sdr-layout-gap from 16px to 32px, and --sdr-section-gap from 32px to 48px at 40rem. Stack without an explicit gap follows group spacing; when its children are form controls, field groups or sdr-form-group wrappers, it uses question spacing through --sdr-form-group-gap; the gap prop and numbered utilities retain the selected value.

### Space between questions

Forms have more space between questions than between a question’s label and control. --sdr-field-gap keeps 8px between label, hint, error and control. --sdr-form-group-gap separates questions: 24px on small screens and 32px from 40rem in comfortable density; compact density uses 16px and 24px respectively.

Stack, Fieldset and conditional groups containing fields own this space. Inputs and option rows receive no extra padding. Radio and checkbox options within one question retain their internal spacing, so error rails end at the group’s content without empty space below. Parts of a date or input group stay together.

For a compound field in a custom wrapper, sdr-form-group identifies the question to the layout. An explicit gap prop or spacing utility still takes precedence over the default question spacing.

` },
  'foundations/typography': { title: 'Typography', body: `
Inter 4.1 is the default typeface across the library and documentation. Its variable regular and italic WOFF2 faces are embedded directly in CSS, covering the UI weight range 400–750. The Latin and Latin Extended subsets retain international Latin-script names, combining accents, punctuation and currency symbols. Other scripts use the system font stack. Optical sizing, tabular numerals and hinting are preserved. There are no separate font requests, and portable delivery remains two files. Inter includes Romanian diacritics, including comma-below Ș/ș and Ț/ț. Code retains a monospace font. An institution can override the family through --sdr-font.

| Token | rem | Role |
|---|---|---|
| xs | .875 | Captions and tags |
| sm | 1 | Supporting text |
| md | 1.125 | Body text |
| lg | 1.25 | Lead text |
| xl | 1.5 | Subsection headings |
| 2xl | 2 | Section headings |
| 3xl | 3 | Page headings |
| 4xl | 4 | Editorial display |

A heading's level describes document structure; its size prop controls visual size independently. Body line height is 1.6 and heading line height is 1.25. Headings can wrap across lines. Prose limits editorial width to 68ch, and the sdr-u-tabular utility provides tabular figures for numeric values.

Romanian text includes ă, â, î, ș and ț, with corresponding capitals. Names such as Șerban, Târgu Mureș and Dâmbovița are useful samples when evaluating an alternative font. Controls preserve entered Unicode text; visual presentation and data normalisation are separate concerns.

Inputs render text at least 1rem in size. The accessibility targets include 200% text resizing and reflow at 320 CSS pixels. Underlined links remain identifiable without colour. Visible labels provide a persistent reference that placeholders cannot offer.
` },
  'foundations/themes': { title: 'Colour, themes and density', body: `
Four named themes share the same semantic roles: light, dark, heritage and contrast. Heritage uses warm paper neutrals, deep blue interactions and a restrained red cultural accent. Contrast is an explicit high-contrast palette; platform forced-colours preferences remain separately supported.

The theme prop on SdrProvider configures React appearance; data-sdr-theme on an HTML .sdr boundary configures portable appearance. For example, dark selects the dark palette. Sections can have different themes. Preference persistence belongs to the application; the library does not write to localStorage or apply a global theme automatically. Interactive documentation examples follow page appearance by default and also allow individual theme selection.

Roles include canvas, surface, subtle, text, muted, border, divider, action, action-hover, on-action, link, focus, focus-gap, danger, success, warning, info, and their background roles. Decorative accent is separate from error and link roles. Tokens are centrally authored in packages/core/src/tokens.ts. Errors and destructive actions use #CA3535 in Light and Heritage. Dark uses #D76868 for error text on dark surfaces; Contrast uses #982828. The semantic danger role adapts to the theme, while the decorative flag-red primitive stays unchanged.

Primary buttons use the same #002B7F blue as the header and navigation across all themes, with white text. A lighter border keeps the button boundary visible in dark mode. The roles are button-bg, button-hover, on-button and button-border. Pressed and keyboard-focus states retain flag yellow.

Text contrast targets 4.5:1, large text 3:1 and meaningful control boundaries 3:1. Decorative dividers are not control boundaries. Status colours accompany text. Action colour pairs include both normal and hover states. Focus uses an offset perimeter and gap to remain distinguishable across surfaces.

Comfortable controls are at least 3rem high; compact controls are at least 2.75rem high. Density never shrinks text or keyboard focus indicators. Theme and density matrices are tested in the component previews. Automated pair checks do not replace checking rendered combinations in complete services.
` },
  'foundations/overrides': { title: 'Override classes', body: `
Overrides are generated from the same tokens as the components. Composition provides the base structure; utilities support local adjustments without a separate set of CSS values.

- sdr-u-margin-0 through sdr-u-margin-9, and corresponding padding classes.
- Logical sides: top, bottom, left, right, block and inline. Left and right map to inline-start and inline-end for localisation.
- sdr-u-gap-0 through sdr-u-gap-9, plus row-gap and column-gap.
- sdr-u-md-padding-5 and equivalent spacing classes apply at 48rem.
- sdr-u-width-full, three-quarters, two-thirds, one-half, one-third, one-quarter and auto. Fractional widths become full width below 40rem; auto remains intrinsic.
- sdr-u-text-xs through sdr-u-text-4xl; sdr-u-weight-regular, medium and bold.
- sdr-u-text-start, center and end; sdr-u-tabular and sdr-u-measure.
- sdr-u-display-block, inline, inline-block, none, flex and grid; sdr-u-hide-print.
- sdr-visually-hidden stays available to assistive technology and becomes visible when focused.

The canonical utility prefix is sdr-u-. Numbered spacing utilities retain their selected value; sdr-u-md-* applies the same adjustment from 48rem.

Override declarations use !important, including zero resets. display-none also removes content from screen readers; sdr-visually-hidden keeps it available to assistive technology. Tokens are available in application CSS for continuity with component spacing.
` },
  'foundations/content': { title: 'Localisation', body: localisationContent.en },
  'foundations/culture': { title: 'Cultural expression', body: `
## Embroidery motif

The decorative band reproduces the reference geometry: stepped rosettes with checked centres, diamonds, corner hooks and alternating borders. Flag red replaces the original red, and flag blue replaces black. White spaces use the shared on-masthead colour. The drawing uses reconstructed SVG paths embedded in CSS; no reference photograph or bitmap is included.

<div className="sdr-motif" aria-hidden="true" />

Blouse embroidery with altiță belongs to the cultural heritage of Romania and the Republic of Moldova. [UNESCO documentation](https://ich.unesco.org/en/RL/01861) describes regional variation in techniques and ornament. The SDR version is a digital interpretation of these forms, without assigning an unverified regional origin or symbolic meaning.

Motif and the sdr-motif class share the same drawing in library examples. The 194 × 225-unit repeat preserves the reference pixel coordinates, including unequal stitch widths and the checked centre. Two SVG masks embedded in CSS separate geometry from palette colours. The diamond crosses the horizontal boundary and wraps into the next repeat, preserving its complete shape. All colours use SDR palette variables. The horizontal band defaults to 3rem (48px at a 16px root). The documentation header, hero and footer currently use no motif. The size prop accepts sm (24px), md (48px, default), lg (64px) and xl (96px); HTML uses sdr-motif--sm, sdr-motif--md, sdr-motif--lg and sdr-motif--xl. The --sdr-motif-size property supports custom heights. CSS scales the drawing proportionally and repeats it horizontally, without separate image files, extra elements or network requests. Decoration stays separate from text and controls, hidden from assistive technology and removed in forced colours.

A consuming institution can supply its own visual assets outside functional components. The ornament uses embedded SVG masks; no reference photograph is included.

Institutional identity is separate from library identity. Header accepts an optional application-provided emblem and has no default institutional mark. The [experimental identity studies](/en/studies/institutional-identity/) are documentation material, separate from the library packages.
` },
  accessibility: { title: 'Accessibility and evidence', body: `
## Target and current status

SDR targets WCAG 2.2 Level AA with stronger control-size and focus conventions. This alpha has no independent audit, disabled-participant study or conformance certification. Passing automated tests is evidence for the checks exercised, not a statement that every service built with SDR conforms.

## Required verification

- Native names, roles and states; visible labels; associated hints and errors.
- Keyboard traversal, no traps, clear focus, modal Escape and focus restoration.
- Tabs: Left/Right, Home/End and a single tab stop, including RTL direction.
- Four themes, both densities, 200% text enlargement, 320 CSS-pixel reflow, forced colours and reduced motion.
- Password paste and managers; one-time-code paste; no memory puzzle requirement.
- No colour-only status, auto-dismissed important notifications or hidden essential instructions.

## Browser and assistive-technology matrix

Native interaction tests run in Chromium, Firefox and WebKit through npm run test:e2e. Chromium also runs catalogue-wide axe scans and responsive checks. Component, controller and contrast tests run with npm test. Their actual results must be read from the run output and generated reports. Manual NVDA with Firefox/Chrome, VoiceOver with Safari/iOS, TalkBack with Android, speech input and switch access remain unverified until recorded in a release evidence report.

## Known implementation boundaries

DatePicker and TimeInput use browser-native interfaces. TreeView is disclosure navigation, not an ARIA tree. PopoverMenu is a disclosure with ordinary Tab navigation, not an ARIA menu. CharacterCount counts Unicode code points. DataTable supports local sorting, not remote paging or an editable grid. ExitThisPage is a direct navigation link without a keyboard shortcut. Accordion uses native details with an expand/collapse-all action.

## European mapping

Track applicable EN 301 549 requirements separately, including documentation and support requirements. WCAG alone does not cover the entire standard. Each adopting service owns an accurate accessibility statement, feedback route and whole-journey assessment.

References: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [European Commission standards guidance](https://digital-strategy.ec.europa.eu/en/policies/web-accessibility-directive-standards-and-harmonisation).

## Automated tests and reports

Component and portable-controller tests use Vitest with React Testing Library, user-event and jest-dom. They cover accessible labels, descriptions, native form semantics, refs, callbacks, controlled input, Unicode, keyboard interaction, rerendering and cleanup. npm run test:coverage checks every runtime TypeScript file in core and React, including unimported files, against enforced thresholds: 90% lines, statements and functions, and 85% branches. Reports are available in coverage/.

Playwright Test runs native dialog, focus, navigation and form journeys in Chromium, Firefox and WebKit. Chromium also checks the complete bilingual React/HTML catalogue with axe and responsive layouts. Traces and screenshots are retained on failure; HTML and JUnit reports are written to playwright-report/ and test-results/. npm run test:packages installs the actual archives in a separate TypeScript and server-rendering consumer.

npm run verify builds the project and runs all release checks. The reports describe the fixtures exercised in that run; they do not establish accessibility certification or replace manual assistive-technology testing.

` },
  contributing: { title: 'Contributing and release gates', body: `
Every contribution needs a real user need, coherent semantics and a named maintainer. Include Romanian and English guidance, a runnable example, all relevant states and evidence for keyboard and screen-reader behaviour. Preserve the two-file portable contract when changing core components.

Run npm run verify before proposing a release. The checks cover source file length, spacing-token use, locale parity, types, behaviours, theme contrast, build artifacts and browser interactions. Generated API tables and component snippets must be regenerated with npm run docs:generate after source changes.

All components are experimental in 0.1.0-alpha.1. A stable release requires research with representative users including disabled people, manual browser and assistive-technology checks, documented limitations, a reviewed API and a support commitment.

Report a problem with the component, version, browser, assistive technology, reproduction and expected result. Do not include real identity documents or personal information. The designated repository is [strictlylucian/sdr](https://github.com/strictlylucian/sdr). Local verification reports and GitHub-hosted CI results are separate evidence. Current runs are available in the Actions tab. The GitHub Pages workflow publishes documentation on pushes to main.

Changes to tokens must pass every theme and density fixture. New spacing values need a system-level rationale. No authored code file may exceed 300 lines. Keep entrypoints stable and isolate behaviour into small modules.
` },
  sources: { title: 'Sources and licences', body: `
SDR is an original independent implementation. It draws on publicly documented government design-system practices; those systems do not endorse SDR. Library packages include no default government logo or proprietary font. The experimental studies section contains user-supplied institutional identity concept boards with their own proposal status.

- [IBM/Carbon DESIGN.md](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/ibm/DESIGN.md): independent design analysis used to inform flat surfaces, restrained colour and consistent structure. SDR has its own identity, palette and typography.
- [Inter 4.1](https://github.com/rsms/inter/releases/tag/v4.1): licensed under SIL Open Font License 1.1. Regular and italic WOFF2 faces are embedded in CSS with the copyright notice and full license. The core package also includes dist/INTER-LICENSE.txt.
- [Astro Starlight](https://starlight.astro.build/): the documentation framework, under MIT.
- React, Astro, TypeScript, esbuild, Vitest and Playwright remain third-party dependencies under their respective licences. Versions are locked in package-lock.json.
- [UNESCO altiță entry](https://ich.unesco.org/en/RL/01861): cultural background for the traditional embroidery.

The SDR-authored implementation is licensed under the repository MIT licence. Third-party rights remain with their owners. Check naming and trademarks before public branding or publication.
` },
};
