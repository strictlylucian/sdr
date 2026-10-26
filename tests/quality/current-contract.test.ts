import { afterEach, expect, it } from 'vitest';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { runInNewContext } from 'node:vm';
import { utilityStyles } from '../../tooling/build/tokens.mjs';
import { portableCountSnippet } from '../../tooling/docs/portable-count-snippet.mts';
import { prunePages } from '../../tooling/docs/prune-pages.mts';
import { countText } from '../../apps/docs/src/i18n/messages';
import { orderedComponents } from '../../catalog/components';
import { patterns } from '../../catalog/patterns';

const base = resolve('output/docs-current-tests');
const roots: string[] = [];
afterEach(async () => {
  for (const root of roots.splice(0)) {
    if (!resolve(root).startsWith(base + sep)) throw new Error('Test output outside owned directory');
    await rm(root, { recursive: true });
  }
});

it('generates only canonical override classes', () => {
  const css = utilityStyles();
  expect(css).toContain('.sdr-u-margin-0{margin:var(--sdr-space-0)!important}');
  expect(css).toContain('.sdr-u-width-two-thirds');
  expect(css).not.toContain('.sdr-\\!-');
});

it('keeps generated documentation inventories aligned with current parent pages', async () => {
  for (const locale of ['ro', 'en'] as const) {
    const components = await readdir(`apps/docs/src/content/docs/${locale}/components`);
    expect(components.sort()).toEqual(['index.mdx', ...orderedComponents(locale).map(item => item.slug + '.mdx')].sort());
    const pages = await readdir(`apps/docs/src/content/docs/${locale}/patterns`);
    expect(pages.sort()).toEqual(['index.mdx', ...patterns.map(item => item.slug + '.mdx')].sort());
  }
});

it('documents existing workspace commands and all required browser engines', async () => {
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  for (const file of ['README.md', 'README.ro.md', 'TESTING.md', 'catalog/guides-ro.ts', 'catalog/guides-en.ts']) {
    const source = await readFile(file, 'utf8');
    expect(source, file).toContain('playwright install chromium firefox webkit');
    for (const match of source.matchAll(/npm run ([a-z][\w:-]*)/g)) expect(manifest.scripts, `${file}: ${match[1]}`).toHaveProperty(match[1]);
  }
});

it.each(['ro', 'en'] as const)('runs the %s portable setup formatter without a bundler or extra imports', locale => {
  let callback: ((remaining: number) => string) | undefined;
  runInNewContext(portableCountSnippet(locale), {
    Intl, document: {}, SDR: { init(_root: unknown, options: { formatCount: (n: number) => string }) { callback = options.formatCount; return () => {}; } },
  });
  expect(callback).toBeTypeOf('function');
  for (const remaining of [0, 1, 2, 20, 101, -1, -2, -20]) expect(callback!(remaining)).toBe(countText(locale, remaining));
});

it('prunes stale generated pages without deleting other file types', async () => {
  await mkdir(base, { recursive: true });
  const root = await mkdtemp(join(base, 'case-'));
  roots.push(root);
  await Promise.all(['current.mdx', 'obsolete.mdx', 'asset.svg'].map(name => writeFile(join(root, name), name)));
  await prunePages(root, ['current'], '.mdx');
  expect((await readdir(root)).sort()).toEqual(['asset.svg', 'current.mdx']);
});
