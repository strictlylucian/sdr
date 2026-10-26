# SDR — Sistem de Design Românesc

[Română](README.ro.md) · [Repository](https://github.com/strictlylucian/sdr)

**Independent proposal · 0.1.0-alpha.1 · Experimental implementation.**

SDR provides React components, shared styles and a two-file HTML edition for Romanian public-service interfaces. Documentation and examples are available in Romanian and English. The project claims no government affiliation or accessibility certification.

## Run the workspace

Use Node 22.23.4 or later and npm 11. The lockfile pins dependencies, including the local Node runtime used by npm scripts. Run these commands from the repository root:

```sh
npm ci
npm run build:library
npm run docs:generate
npm run dev
```

Open `/ro/` or `/en/` on the local server. Development binds to localhost. For a built, searchable site on the local network:

```sh
npm run build
npm run preview:lan
```

Docs builds finish in a staging directory before updating the served `apps/docs/dist/` directory.

## Verify

```sh
npx playwright install chromium firefox webkit
npm run verify
```

Linux runners install browser dependencies with `npx playwright install --with-deps chromium firefox webkit`. Verification builds the project and checks source policy, TypeScript, component/controller coverage, installed package archives and browser behaviour.

Chromium checks the complete Romanian/English React and HTML catalogue, including form states, axe scans, 320px/1280px layouts and 200% text. Chromium, Firefox and WebKit exercise native interactions, forms, full Page journeys, themes and error alignment. Tables and code samples retain contained scrolling. See [TESTING.md](TESTING.md) for scope and limitations.

## Library packages

- `@sdr/core`: design tokens, scoped styles and framework-independent enhancement controllers.
- `@sdr/react`: typed React components, supplied content and reusable service compositions.
- `dist/portable/sdr.css` and `dist/portable/sdr.js`: exactly two portable runtime files, with embedded Inter fonts and SVG motif masks.
- `apps/docs`: Astro Starlight documentation, live examples, API tables and documentation-only i18next resources.

Build and create local installable archives with `npm run pack:release`. The output directory `output/release/0.1.0-alpha.1/` contains both npm archives, the portable pair and SHA-256 checksums. This command prepares local files; npm publication has not occurred. Ownership of the `@sdr` npm scope remains unconfirmed.

React applications install both archives, import `@sdr/core/styles.css` once and mount components inside `SdrProvider`. The manifests declare React/React DOM >=18.3; current consumer and browser evidence uses React 19. The lowest declared peer version still needs a separate qualification run.

Portable applications copy the two runtime files, provide semantic HTML and initialise opted-in elements from their application script. `SDR.init(root)` returns a disposer; character-count controls also require an application `formatCount` callback. React-owned elements are managed through React effects. Business logic, validation, routing, persistence and translations belong to the application.

## Design and documentation

Four themes share one token contract; comfortable and compact densities preserve text size. Spacing, layout utilities and overrides come from the same scale. Utility classes use `sdr-u-*`. Component variants and pattern scenarios live under their canonical parent pages.

The library contains no dictionaries or i18n engine. Documentation uses local Romanian/English JSON with i18next; editable catalogue definitions, variants, patterns and form states live in `catalog/data/`. See [I18N.md](I18N.md).

Form examples cover error, disabled and native read-only states. Controls without native HTML readonly support have documented fixed-value SummaryList examples. Institutional identity boards are explicitly experimental studies in the docs, rather than default library branding.

## Evidence and limits

The project targets WCAG 2.2 AA. Automated checks cover their fixtures; manual NVDA, VoiceOver, TalkBack and research with disabled participants remain unverified. APIs are experimental and integrations should pin exact versions. See [DESIGN.md](DESIGN.md), [TESTING.md](TESTING.md) and [CHANGELOG.md](CHANGELOG.md).

Code is MIT licensed. Embedded Inter uses SIL OFL 1.1, with its notice in CSS and the core archive. The reference author/licence for the reconstructed altiță remains unconfirmed in `catalog/motif-provenance.json`; code licensing does not establish rights to that reference. Original user-supplied identity-study boards are documentation assets, separate from library runtime files.

## Repository and hosting

The public repository is [strictlylucian/sdr](https://github.com/strictlylucian/sdr). Documentation is published at [strictlylucian.github.io/sdr](https://strictlylucian.github.io/sdr/).

The Deploy documentation workflow builds and publishes GitHub Pages on pushes to main or manual dispatch. Only its deployment job has Pages write permission. Package verification runs separately; npm publication remains manual and has not occurred.

`npm run build:pages` builds into `output/pages/sdr/` using the `/sdr/` deployment prefix; `npm run test:pages` checks the deployed route structure and native browser behaviour. Normal `npm run build` retains root-based localhost/LAN routes. CI results are available in the repository Actions tab.
