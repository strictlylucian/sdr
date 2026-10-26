# SDR core — Sistem de Design Românesc

[Română](./README.ro.md)

Independent Romanian design-system proposal. Experimental alpha; no government affiliation or certified accessibility claim.

This package supplies shared styles, design tokens and framework-independent behaviour. Labels, translations and formatters are supplied by the application; the library has no i18n runtime or dictionaries. Inter is embedded in CSS; the decorative motif is drawn with palette-coloured SVG masks embedded in CSS, without a separate image asset.

## Installation

```sh
npm install @strictlylucian/sdr-core@alpha
```

## With a bundler

```js
import '@strictlylucian/sdr-core/styles.css';
import { init, destroy } from '@strictlylucian/sdr-core';

const release = init(document);
// Before replacing a route or removing enhanced markup:
release();
// Or release all enhanced elements below a container:
destroy(document);
```

Enhancement is explicit. Markup opts in through `data-sdr-component`; React-owned roots are skipped. Inserted HTML can be enhanced with another `init(container)` call. Character-count markup requires `init(root, { formatCount })` with the application’s formatter; negative values mean the limit is exceeded. Password and accordion labels are supplied through the documented HTML data attributes.

## Without a bundler

Copy `dist/sdr.css` and `dist/sdr.js` from this package to your application. These are the only two runtime assets required.

```html
<link rel="stylesheet" href="/assets/sdr.css">
<script src="/assets/sdr.js" defer></script>
<script src="/assets/app.js" defer></script>
```

In your application script, `SDR.init(document)` activates opted-in markup. `SDR.destroy(container)` removes its handlers. The `@strictlylucian/sdr-core/portable.js` export resolves the classic script for asset-copy tooling; bundler applications use the normal ESM exports.

The documentation's demo handlers are examples, not part of this runtime. Applications supply submission, storage, payment and messaging integrations.

## Assets and licences

Code is MIT licensed. Embedded Inter is SIL OFL 1.1; retain its embedded notice and the supplied `dist/INTER-LICENSE.txt`.
