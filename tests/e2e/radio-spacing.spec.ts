import { expect, expectReflow, test } from './support/fixtures';

for (const edition of ['react', 'html']) for (const locale of ['ro', 'en']) {
  test(`Radio spacing ${edition} ${locale}: grouped options have consistent gaps and separate click areas`, async ({ page }) => {
    await page.goto(edition === 'react' ? `/${locale}/reality/online-gruiu/` : `/examples/${locale}/study-online-gruiu.html`);
    const root = page.locator('[data-form-study]');
    await expect(root).toHaveAttribute('data-study-ready', 'true');
    if (edition === 'html') await root.locator('[data-study-stepper] a').nth(1).click();
    const group = root.locator('[data-study-field="locality"]');
    for (const width of [320, 1280]) for (const density of ['comfortable', 'compact']) {
      await page.setViewportSize({ width, height: 900 });
      await root.evaluate((node, density) => { const provider = node.closest('.sdr')!; provider.setAttribute('data-sdr-density', density); provider.setAttribute('data-sdr-theme', 'dark'); }, density);
      const boxes = await group.locator('.sdr-choice').evaluateAll(rows => rows.map(row => {
        const box = row.getBoundingClientRect(), hit = getComputedStyle(row, '::before');
        return { top: box.top, bottom: box.bottom, hitTop: box.top + parseFloat(hit.top), hitBottom: box.top + parseFloat(hit.top) + parseFloat(hit.height) };
      }));
      expect(boxes).toHaveLength(4);
      for (let index = 1; index < boxes.length; index++) {
        expect(boxes[index].top - boxes[index - 1].bottom).toBeCloseTo(24, 1);
        expect(boxes[index - 1].hitBottom - boxes[index].hitTop).toBeLessThanOrEqual(0.5);
      }
      await group.getByRole('radio').first().focus();
      await page.keyboard.press('ArrowDown');
      await expect(group.getByRole('radio').nth(1)).toBeChecked();
      await expectReflow(group);
    }
  });
}
