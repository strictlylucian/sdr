import { expect, expectAccessible, expectReflow } from './fixtures';
import type { Page } from '@playwright/test';

export async function expectStudyPanels(page: Page, count: number) {
  const root = page.locator('[data-form-study]');
  await expect(root).toHaveAttribute('data-study-mode', 'panels');
  await expect(root).toHaveAttribute('data-study-ready', 'true');
  await expect(page.locator('.sdr-doc-footer .sdr-doc-notice')).toHaveCount(1);
  await expect(root.locator('.sdr-doc-notice')).toHaveCount(0);
  await expect(root.locator('[data-study-next]')).toHaveCount(0);
  await expect(root.locator('.sdr-study-panel')).toHaveCount(count + 1);
  for (const panel of await root.locator('[data-study-step]').all()) {
    await expect(panel).toBeVisible();
    await expect(panel).toBeEnabled();
  }
  await expect(root.locator('[data-study-review-panel]')).toBeVisible();
  const links = root.locator('[data-study-panel-navigation] a');
  await expect(links).toHaveCount(count + 1);
  const last = links.last(), target = await last.getAttribute('href');
  await last.click();
  await expect(page.locator(target!)).toBeFocused();
  await expect(last.locator('..')).toHaveAttribute('aria-current', 'step');
  await page.setViewportSize({ width: 320, height: 900 });
  await expectReflow(root);
  await expectAccessible(page, '[data-form-study]');
}
