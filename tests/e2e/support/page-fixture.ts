import { build } from "esbuild";
import type { Page } from "@playwright/test";
import type { Locale } from "./fixtures";

const bundle = build({
  stdin: {
    contents: `import { createRoot } from 'react-dom/client';
import { SdrProvider } from './packages/react/src';
import { PageExample } from './apps/docs/src/examples/page';
const locale = document.documentElement.lang;
createRoot(document.getElementById('fixture')).render(<SdrProvider lang={locale}><PageExample locale={locale} /></SdrProvider>);`,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  write: false,
  bundle: true,
  jsx: "automatic",
  format: "iife",
  define: { "process.env.NODE_ENV": '"production"', "process.env.SDR_DOCS_BASE": '"/"' },
});

/** Real React composition, served only through Playwright's per-test routing. */
export async function openReactPage(page: Page, locale: Locale) {
  const { outputFiles } = await bundle;
  await page.route("**/__test__/page.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: Buffer.from(outputFiles[0].contents),
    }),
  );
  await page.route("**/__test__/page", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>SDR Page test</title><link rel="stylesheet" href="/portable/sdr.css"></head><body><div id="fixture"></div><script src="/__test__/page.js" defer></script></body></html>`,
    }),
  );
  await page.goto("/__test__/page");
}
