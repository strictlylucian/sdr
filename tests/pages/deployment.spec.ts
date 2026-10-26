import { expect, test } from '@playwright/test';
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

async function htmlFiles(root: string): Promise<string[]> {
  return (await Promise.all((await readdir(root, { withFileTypes: true })).map(entry => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  }))).flat();
}

test('all deployed HTML pages and their internal destinations stay under /sdr/', async ({ page, request }, info) => {
  test.skip(info.project.name !== 'chromium', 'HTTP inventory is independent of browser engine');
  test.setTimeout(180000);
  const root = 'output/pages/sdr';
  const destinations = new Set<string>();
  const errors: string[] = [];
  for (const file of await htmlFiles(root)) {
    const path = '/sdr/' + relative(root, file).split(sep).join('/').replace(/index\.html$/, '');
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
    const refs = await page.evaluate(({ html, path }) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const base = new URL(path, 'http://docs.test');
      return [...doc.querySelectorAll('a[href],link[href],script[src],img[src],iframe[src],form[action]')].flatMap(node => {
        const raw = node.getAttribute('href') ?? node.getAttribute('src') ?? node.getAttribute('action')!;
        const url = new URL(raw, base);
        return url.origin === base.origin ? [url.pathname] : [];
      });
    }, { html: await response.text(), path });
    for (const ref of refs) {
      if (!ref.startsWith('/sdr/')) errors.push(`${path} → ${ref}`);
      destinations.add(ref);
    }
  }
  for (const path of destinations) expect((await request.head(path)).ok(), path).toBe(true);
  expect(errors).toEqual([]);
  const entry = await request.get('/sdr/');
  expect(await entry.text()).toContain('url=/sdr/ro/');
});

for (const locale of ['ro', 'en']) {
  test(`${locale}: search results and language switching retain the deployment prefix`, async ({ page }) => {
    await page.goto(`/sdr/${locale}/components/button/`);
    await page.locator('site-search > button').click();
    await page.locator('.pagefind-ui__search-input').fill(locale === 'ro' ? 'buton' : 'button');
    const result = page.locator('.pagefind-ui__result-link').first();
    await expect(result).toBeVisible();
    await expect(result).toHaveAttribute('href', /\/sdr\/(?:ro|en)\//);
    await result.click();
    await expect(page).toHaveURL(/\/sdr\//);
    await page.goto(`/sdr/${locale}/components/button/`);
    await page.getByRole('banner').locator('starlight-lang-select select').selectOption(locale === 'ro' ? '/sdr/en/components/button/' : '/sdr/ro/components/button/');
    await expect(page).toHaveURL(new RegExp(`/sdr/${locale === 'ro' ? 'en' : 'ro'}/components/button/`));
  });
  test(`${locale}: hydrated variants, source links, Page and study assets retain the deployment prefix`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/sdr/${locale}/components/button/#variant-toggle-button`);
    await expect(page.locator('[data-sdr-variant="ToggleButton"]')).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('[data-sdr-variant="ToggleButton"]')).toHaveAttribute('href', `/sdr/${locale}/components/button/#variant-toggle-button`);
    await page.locator('.sdr-example-code').first().getByRole('tab', { name: 'HTML', exact: true }).click();
    await expect(page.locator('.sdr-example-code').first().getByRole('link')).toHaveAttribute('href', `/sdr/${locale}/getting-started/`);
    await page.goto(`/sdr/${locale}/components/checkbox/#state-switch-error`);
    await expect(page.locator('[data-sdr-state="switch-error"]')).toHaveAttribute('href', `/sdr/${locale}/components/checkbox/#state-switch-error`);
    await expect(page.locator('[data-sdr-state="switch-error"]')).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('[data-sdr-state="switch-error"]')).toBeVisible();
    await expect(page.locator('[data-sdr-state="switch-error"]')).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await page.goto(`/sdr/${locale}/components/page/`);
    const frame = page.frameLocator('iframe');
    await expect(frame.locator('h1')).toBeVisible();
    await expect(frame.getByRole('link', { name: 'English', exact: true })).toHaveAttribute('href', '/sdr/examples/en/page.html');
    await page.goto(`/sdr/${locale}/studies/institutional-identity/`);
    for (const image of await page.locator('.sdr-study-plate__image').all()) {
      await expect(image).toHaveAttribute('src', /^\/sdr\/studies\//);
    }
    expect(errors).toEqual([]);
  });
}
