import { docsUrl } from '../../apps/docs/src/docs-url';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SdrProvider } from '../../packages/react/src/index';
import type { Locale } from '../../apps/docs/src/i18n/messages';
import * as examples from '../../apps/docs/src/examples/index';
import { formatExample } from './format-example.mts';
import { simplifyExampleIds } from './example-ids.mjs';
import { localiseExample } from './localised-example.mts';
import { countSnippet } from './count-snippet.mts';
const directory = 'apps/docs/src/examples';
export async function readExamples() {
  const snippets: Record<Locale, Record<string, string>> = { ro: {}, en: {} };
  for (const filename of await readdir(directory)) {
    if (!filename.endsWith('.tsx')) continue;
    const text = await readFile(`${directory}/${filename}`, 'utf8');
    const file = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const node of file.statements) {
      if (ts.isFunctionDeclaration(node) && node.name?.text.endsWith('Example')) {
        const name = node.name.text.replace(/Example$/, '');
        for (const locale of ['ro', 'en'] as const) {
          const formatter = node.getText(file).includes('countText(') ? countSnippet(locale) : '';
          snippets[locale][name] = await formatExample(`import { useState } from 'react';\nimport * as R from '@sdr/react';\n${formatter}\nconst locale = '${locale}';\n\n${localiseExample(node, file, locale)}`, 'tsx');
        }
      }
    }
  }
  return snippets;
}
export function exampleHtml(name: string, locale: Locale) {
  const Example = examples[`${name}Example` as keyof typeof examples];
  if (!Example) throw new Error(`No example ${name}`);
  const html = renderToStaticMarkup(React.createElement(SdrProvider, { lang: locale, children: React.createElement(Example, { locale }) }), { identifierPrefix: `${locale}-${name}-` });
  return simplifyExampleIds(html.replaceAll(' data-sdr-owner="react"', ''), name, locale);
}
export async function writePortablePage(name: string, slug: string, locale: Locale) {
  const body = exampleHtml(name, locale);
  const path = `apps/docs/public/examples/${locale}`;
  await mkdir(path, { recursive: true });
  const heading = /<h1(?:\s|>)/.test(body) ? '' : `<h1 class="sdr-heading-md sdr-u-margin-bottom-5">${name} · SDR alpha</h1>`;
  const content = name === 'Page' ? body : `<main>${heading}${body}</main>`;
  await writeFile(`${path}/${slug}.html`, `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} · SDR · ${locale === 'ro' ? 'Propunere independentă' : 'Independent proposal'}</title><link rel="icon" href="${docsUrl('/favicon.svg')}"><link rel="stylesheet" href="${docsUrl('/portable/sdr.css')}"><script src="${docsUrl('/portable/sdr.js')}" defer></script><script src="${docsUrl('/portable-demo.js')}" defer></script></head><body class="sdr ${name === 'Page' ? 'sdr-u-margin-0' : 'sdr-u-padding-5'}">${content}</body></html>`);
}
