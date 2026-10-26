import { build } from 'esbuild';
import type { Page } from '@playwright/test';
import type { Locale } from './fixtures';

const bundle = build({
  stdin: {
    contents: `import { createRoot } from 'react-dom/client';
import { SdrProvider } from './packages/react/src';
import * as examples from './apps/docs/src/examples/form-errors';
const Example = examples[document.body.dataset.example + 'Example'];
if (!Example) throw new Error('Unknown choice fixture');
createRoot(document.getElementById('fixture')).render(<SdrProvider theme="dark" lang={document.documentElement.lang}><Example locale={document.documentElement.lang} /></SdrProvider>);`,
    resolveDir: process.cwd(), loader: 'tsx',
  },
  write: false, bundle: true, jsx: 'automatic', format: 'iife',
  define: { 'process.env.NODE_ENV': '"production"', 'process.env.SDR_DOCS_BASE': '"/"' },
});

/** Isolate actual React examples from the documentation shell for font-resize checks. */
export async function openReactChoice(page: Page, name: string, locale: Locale) {
  const { outputFiles } = await bundle;
  await page.route('**/__test__/choices.js', route => route.fulfill({
    contentType: 'text/javascript', body: Buffer.from(outputFiles[0].contents),
  }));
  await page.route('**/__test__/choices', route => route.fulfill({
    contentType: 'text/html',
    body: `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/portable/sdr.css"></head><body class="sdr sdr-u-padding-5" data-sdr-theme="dark" data-example="${name}"><main id="fixture"></main><script src="/__test__/choices.js" defer></script></body></html>`,
  }));
  await page.goto('/__test__/choices');
  return page.locator('#fixture > .sdr');
}
