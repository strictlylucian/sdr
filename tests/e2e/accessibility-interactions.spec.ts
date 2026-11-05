import { expect, expectAccessible, openExample, test, type Edition, type Locale } from './support/fixtures';

for (const locale of ['ro', 'en'] as Locale[]) for (const edition of ['react', 'html'] as Edition[]) {
  test(`WCAG tooltip ${edition} ${locale}: hoverable, persistent, dismissible and inside the viewport`, async ({ page }) => {
    const root = await openExample(page, 'Tooltip', edition, locale);
    const trigger = root.locator('[data-sdr-tooltip-trigger]');
    const tooltip = root.getByRole('tooltip');
    await trigger.focus();
    await expect(tooltip).toBeVisible();
    await expect(trigger).toHaveAccessibleDescription(await tooltip.innerText());
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.evaluate(node => (node as HTMLElement).blur());
    await trigger.hover();
    await tooltip.hover();
    await expect(tooltip).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 720 });
      await trigger.focus();
      await trigger.evaluate(node => node.scrollIntoView({ block: 'start' }));
      const box = await tooltip.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y, 'tooltip above viewport').toBeGreaterThanOrEqual(0);
      expect(box!.x, 'tooltip before viewport').toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, 'tooltip beyond viewport').toBeLessThanOrEqual(width);
      await page.keyboard.press('Escape');
      await trigger.evaluate(node => (node as HTMLElement).blur());
    }
  });

  test(`WCAG toast ${edition} ${locale}: keyboard reveal, status and focus restoration`, async ({ page }) => {
    const root = await openExample(page, 'Toast', edition, locale);
    const trigger = root.locator('[data-sdr-toast-show]');
    await trigger.focus();
    await page.keyboard.press('Enter');
    const status = root.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).not.toBeEmpty();
    await expect(trigger).toBeFocused();
    await expectAccessible(page, edition === 'html' ? 'main > .sdr' : '[data-sdr-example="Toast"] .sdr-demo__canvas');
    await page.keyboard.press('Tab');
    await expect(root.locator('[data-sdr-dismiss]')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(status).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test(`WCAG disclosure ${edition} ${locale}: keyboard opening, Escape and focus restoration`, async ({ page, browserName }, info) => {
    const root = await openExample(page, 'PopoverMenu', edition, locale);
    const summary = root.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    if (browserName === 'webkit') {
      // Windows WebKit skips native anchors under its default keyboard preference,
      // including Alt+Tab. Do not rewrite the component's tabindex to conceal it.
      info.annotations.push({ type: 'scope', description: 'Native anchor Tab traversal needs Safari with full keyboard access. This profile verifies Escape from a focused child.' });
      await root.getByRole('link').last().focus();
    } else {
      await page.keyboard.press('Tab');
      await expect(root.getByRole('link').first()).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(root.getByRole('link').last()).toBeFocused();
    }
    await page.keyboard.press('Escape');
    await expect(summary).toBeFocused();
    await expect(root.locator('details')).not.toHaveAttribute('open');
  });
}
