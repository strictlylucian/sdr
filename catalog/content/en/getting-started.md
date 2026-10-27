SDR stands for **Sistem de Design Românesc** (Romanian Design System).

## Distribution first

SDR starts with a shared foundation that can be distributed and integrated into applications built with different technologies. The core defines the visual language, semantic HTML and interaction behaviours; framework integrations build on that foundation.

Romanian digital-infrastructure projects span different institutions, suppliers, teams and existing platforms. A common design language should be practical to adopt across this fragmented landscape while leaving teams free to choose their frontend architecture. SDR supports integration with server-rendered applications, browser-rendered interfaces and static HTML.

SDR is distributed as @strictlylucian/sdr-core and @strictlylucian/sdr-react.

| Package | Role |
|---|---|
| core | The framework-independent foundation: shared CSS, design tokens, embedded fonts, themes and DOM enhancement behaviours. Its complete portable browser distribution is two files, sdr.css and sdr.js. |
| react | The React integration: typed components built on the same styles and behaviours, with lifecycle handling suited to React. |

The two-file contract describes the browser runtime assets. The core npm package also provides module exports and TypeScript declarations for integrations that use a bundler.

React is the default integration in this repository because of its widespread adoption and familiar ecosystem. It is one way to use SDR; choosing SDR does not require choosing React. The shared foundation can support additional framework packages without creating a separate design language for each stack.

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

Core can be installed independently of React:

~~~sh
npm install @strictlylucian/sdr-core@alpha
~~~

For direct browser integration, copy dist/sdr.css and dist/sdr.js from the installed core package to your own static assets. In this repository, the equivalent built pair is in dist/portable/. Bundled integrations can use the core module API and the @strictlylucian/sdr-core/styles.css export. Supply semantic HTML using the component examples, include the CSS and deferred script, then call SDR.init(document) from your application script. The CSS contains all themes. The JavaScript contains all enhancement controllers. No fonts, icons, chunks or remote resources are fetched by SDR.

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

The two-file promise concerns SDR runtime assets; your HTML and business logic remain part of your application. For a strict CSP, keep initialisation in an external application file. Embedded fonts require data: in font-src, for example `font-src 'self' data:`. Embedded SVG motif masks also use data: in img-src. SDR does not require unsafe-eval.

## Integrations for other frameworks

Contributions that add packages for other frameworks are welcome. A Vue, Angular or Svelte integration, or an integration with server-side templates, can build on core. Each integration can provide the API and rendering conventions familiar to its developers while preserving the shared tokens, styles, semantic HTML, interaction and accessibility contracts.

The adapter owns framework-specific rendering and lifecycle handling, including initialisation after markup is mounted and cleanup when it is removed. Core remains the shared point for design and behaviour improvements. Additional packages can live alongside React in packages/; their maintenance, examples and verification follow the [contribution guidance](/en/contributing/). The [architecture and contracts](/en/architecture/) describe the integration boundaries.

## Run this workspace

Use Node 22.23.4 or later and npm 11. This workspace also pins a local Node runtime for npm scripts.

~~~sh
npm ci
npm run build:library
npm run docs:generate
npm run dev
~~~

Open /ro/ or /en/ on the local server. Run npm run verify for source checks, type checking, unit tests, the production documentation build and browser checks. Install all browser engines with `npx playwright install chromium firefox webkit`. Linux runners use `npx playwright install --with-deps chromium firefox webkit`.

## Supported baseline

Modern browsers with native dialog, details, CSS custom properties and ES2022 support. Playwright runs native interaction tests in Chromium, Firefox and WebKit; Chromium also checks the complete React/HTML catalogue with axe, narrow layouts and 200% text. WebKit automation is not a manual Safari/iOS test. NVDA, VoiceOver, TalkBack and real-user research remain unverified. Essential forms should submit to a server without JavaScript. Dialog-only features need an accessible alternative route if JavaScript is unavailable.
