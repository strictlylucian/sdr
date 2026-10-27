import { expect, expectReflow, test } from './support/fixtures';

for (const edition of ['react', 'html']) for (const locale of ['ro', 'en']) {
  test(`Stepper ${edition} ${locale}: centred labels, horizontal space and wrapping`, async ({ page }) => {
    await page.goto(edition === 'react' ? `/${locale}/components/stepper/` : `/examples/${locale}/stepper.html`);
    const stepper = page.locator('.sdr-stepper').first();
    await expect(stepper).toBeVisible();
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const measurements = await stepper.locator('li').evaluateAll(items => items.map(item => {
        const text = item.querySelector('a,span:not(.sdr-visually-hidden)')!;
        const row = item.getBoundingClientRect(), label = text.getBoundingClientRect();
        const circle = getComputedStyle(item, '::before');
        return {
          centreDifference: Math.abs(label.y + label.height / 2 - (row.y + row.height / 2)),
          horizontalGap: label.x - row.x - parseFloat(circle.width),
          alignment: getComputedStyle(item).alignItems,
          lineHeight: parseFloat(getComputedStyle(text).lineHeight) / parseFloat(getComputedStyle(text).fontSize),
        };
      }));
      for (const item of measurements) {
        expect(item.alignment).toBe('center');
        expect(item.centreDifference).toBeLessThan(0.6);
        expect(item.horizontalGap).toBeGreaterThanOrEqual(11.9);
        expect(item.lineHeight).toBeCloseTo(1.25, 2);
      }
      expect(await stepper.evaluate(node => parseFloat(getComputedStyle(node).columnGap))).toBeGreaterThanOrEqual(32);
      expect(await stepper.evaluate(node => parseFloat(getComputedStyle(node).marginBlockEnd))).toBe(width < 640 ? 16 : 24);
      await expectReflow(stepper);
    }
  });
}

for (const locale of ['ro', 'en']) test(`Stepper page title ${locale}: page examples have a consistent gap before their titles`, async ({ page }) => {
  await page.goto(`/${locale}/reality/online-payment/`);
  await expect(page.locator('[data-form-study]')).toHaveAttribute('data-study-ready', 'true');
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const gaps = await page.locator('[data-study-page]').evaluateAll(pages => pages.map(page => {
      const steps = page.querySelector('.sdr-stepper')!;
      const title = page.querySelector('legend,[data-study-review] h2')!;
      return title.getBoundingClientRect().top - steps.getBoundingClientRect().bottom;
    }));
    gaps.forEach(gap => expect(gap).toBeCloseTo(width < 640 ? 32 : 48, 1));
  }
});
