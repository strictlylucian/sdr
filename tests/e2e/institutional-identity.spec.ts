import { expect, expectAccessible, expectReflow, test } from './support/fixtures';

for (const locale of ['ro', 'en']) test(`Institutional identity ${locale}: shared vectors, proportional marks and readable colour families`, async ({ page }) => {
  await page.goto(`/${locale}/studies/institutional-identity/`);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const family = page.locator('[data-identity-family]');
  const specimens = family.locator('[data-identity-institution]');
  await expect(specimens).toHaveCount(7);
  await expect(family.locator('use')).toHaveCount(14);
  const vector = await page.request.get('/studies/romanian-eagle.svg');
  expect(vector.ok()).toBeTruthy();
  const source = await vector.text();
  expect(source).toContain('<path');
  expect(source).not.toMatch(/<image|data:image|<script/);
  const finance = family.locator('[data-identity-institution="finance"]');
  const anaf = family.locator('[data-identity-institution="anaf"]');
  expect(await finance.evaluate(node => getComputedStyle(node).getPropertyValue('--identity-ink'))).toBe(await anaf.evaluate(node => getComputedStyle(node).getPropertyValue('--identity-ink')));
  for (const theme of ['light', 'dark']) for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
    for (const mark of await family.locator('.sdr-identity-mark').all()) {
      const geometry = await mark.evaluate(node => {
        const symbol = node.querySelector<SVGGraphicsElement>('svg')!;
        const name = [...node.querySelectorAll('.sdr-identity-mark__name')].find(item => getComputedStyle(item).display !== 'none')!;
        const eagle = symbol.getBoundingClientRect(), text = name.getBoundingClientRect();
        return { height: eagle.height - text.height, gap: text.left - eagle.right - eagle.height / 4, loaded: symbol.getBBox().height };
      });
      expect(geometry.height).toBeCloseTo(0, 0);
      expect(geometry.gap).toBeCloseTo(0, 0);
      expect(geometry.loaded).toBeGreaterThan(0);
      await expectReflow(mark);
    }
    await expectReflow(family);
    await expectReflow(page.locator('.sdr-identity-applications'));
  }
  await expectAccessible(page, '[data-identity-family]');
});
