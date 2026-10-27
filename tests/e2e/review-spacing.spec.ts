import { expect, expectReflow, test } from './support/fixtures';

for (const edition of ['react', 'html']) for (const locale of ['ro', 'en']) {
  test(`Review spacing ${edition} ${locale}: groups are separated at mobile and desktop sizes`, async ({ page }) => {
    await page.goto(edition === 'react' ? `/${locale}/reality/online-gruiu/` : `/examples/${locale}/study-online-gruiu.html`);
    const root = page.locator('[data-form-study]');
    await expect(root).toHaveAttribute('data-study-ready', 'true');
    if (edition === 'html') await root.locator('[data-study-stepper] a').last().click();
    const review = root.locator('[data-study-review]');
    await expect(review).toBeVisible();
    for (const width of [320, 767, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const gaps = await review.locator('[data-study-answers] > section').evaluateAll(sections => sections.slice(1).map((section, index) => section.getBoundingClientRect().top - sections[index].getBoundingClientRect().bottom));
      expect(gaps).toHaveLength(2);
      gaps.forEach(gap => expect(gap).toBeCloseTo(width < 768 ? 32 : 48, 1));
      await expectReflow(review);
    }
    const change = review.locator('[data-study-edit="locality"]');
    await change.click();
    await expect(root.locator('[name="locality"]').first()).toBeFocused();
  });
}
