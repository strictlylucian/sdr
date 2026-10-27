import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { catalog, expect, test } from './support/fixtures';

async function filesWithSuffix(root: string, suffix: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? filesWithSuffix(path, suffix) : path.endsWith(suffix) ? [path] : [];
  }))).flat();
}

for (const locale of ['ro', 'en']) {
  test(`Documentation ${locale}: homepage skip link reaches the main heading`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#_top"],a[href="/' + locale + '/#_top"]').first();
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('h1#_top')).toBeFocused();
  });
}

test('all documentation routes, internal links, fragments and assets resolve', async ({ page, request }, info) => {
  test.skip(info.project.name !== 'chromium', 'HTTP and generated HTML are browser-independent');
  test.setTimeout(180000);
  const root = 'apps/docs/dist';
  const files = (await Promise.all(['ro', 'en'].map(locale => filesWithSuffix(join(root, locale), '.html')))).flat();
  const source = 'apps/docs/src/content/docs';
  // The root 404.mdx is Astro's error document, not a /404/ documentation route.
  const documents = (await filesWithSuffix(source, '.mdx'))
    .filter(path => /^(ro|en)[\\/]/.test(relative(source, path)));
  const routes = [...new Set([
    ...files.map(path => '/' + relative(root, path).split(sep).join('/').replace(/index\.html$/, '')),
    ...documents.map(path => '/' + relative(source, path).split(sep).join('/').replace(/(?:index)?\.mdx$/, '/').replace(/\/\//g, '/')),
    ...(['ro', 'en'] as const).flatMap(locale =>
      [...catalog.components, ...catalog.patterns, ...catalog.states].map(item => item.docsPath[locale].split('#')[0])),
  ])];
  const ids = new Map<string, Set<string>>();
  const references = new Map<string, Set<string>>();
  const errors: string[] = [];
  for (const route of routes) {
    const response = await request.get(route);
    if (!response.ok()) { errors.push(`${route}: HTTP ${response.status()}`); continue; }
    const parsed = await page.evaluate(({ html, route }) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const base = new URL(route, 'http://docs.test');
      const refs: string[] = [];
      for (const element of doc.querySelectorAll('a[href],link[href],script[src],img[src],iframe[src]')) {
        if (element.closest('astro-island,.sdr-demo')) continue;
        const raw = element.getAttribute('href') ?? element.getAttribute('src')!;
        const url = new URL(raw, base);
        if (url.origin === base.origin) refs.push(url.pathname + url.hash);
      }
      return { ids: [...doc.querySelectorAll('[id]')].map(node => node.id), refs, notices: doc.querySelectorAll('.sdr-doc-notice').length, footerNotices: doc.querySelectorAll('.sdr-doc-footer .sdr-doc-notice').length };
    }, { html: await response.text(), route });
    if (parsed.notices !== 1 || parsed.footerNotices !== 1) errors.push(`${route}: expected one footer-only notice, got ${parsed.notices} total / ${parsed.footerNotices} in footer`);
    ids.set(route, new Set(parsed.ids));
    for (const ref of parsed.refs) {
      if (!references.has(ref)) references.set(ref, new Set());
      references.get(ref)!.add(route);
    }
  }
  const checked = new Map<string, number>();
  for (const [ref, sources] of references) {
    const url = new URL(ref, 'http://docs.test');
    if (!checked.has(url.pathname)) {
      const response = await request.head(url.pathname);
      checked.set(url.pathname, response.status());
    }
    const status = checked.get(url.pathname)!;
    if (status >= 400) errors.push(`${ref}: HTTP ${status}; linked from ${[...sources].slice(0, 3).join(', ')}`);
    if (url.hash && ids.has(url.pathname) && !ids.get(url.pathname)!.has(decodeURIComponent(url.hash.slice(1)))) {
      errors.push(`${ref}: missing fragment; linked from ${[...sources].slice(0, 3).join(', ')}`);
    }
  }
  expect(errors, 'broken documentation destinations').toEqual([]);
  console.log(`Audited ${routes.length} documentation routes and ${references.size} internal destinations.`);
});

test('variant documentation exists only at its canonical parent location', async ({ request }, info) => {
  test.skip(info.project.name !== 'chromium', 'HTTP destinations are browser-independent');
  const entries = JSON.parse(await readFile('catalog/data/patterns.json', 'utf8')) as { slug: string; example: string }[];
  let checked = 0;
  for (const locale of ['ro', 'en'] as const) {
    const candidates = [
      ...catalog.components.map(item => ({ path: `/${locale}/components/${item.slug}/`, canonical: item.docsPath[locale] })),
      ...entries.map(entry => {
        const item = catalog.patterns.find(item => item.name === entry.example);
        if (!item) throw new Error('Missing pattern: ' + entry.slug);
        return { path: `/${locale}/patterns/${entry.slug}/`, canonical: item.docsPath[locale] };
      }),
    ];
    for (const item of candidates.filter(item => item.path !== item.canonical.split('#')[0])) {
      expect((await request.head(item.path)).status(), item.path).toBe(404);
      checked++;
    }
  }
  console.log(`Verified ${checked} removed standalone documentation paths.`);
});
