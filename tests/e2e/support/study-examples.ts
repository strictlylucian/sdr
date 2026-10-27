import { expect, expectAccessible, expectReflow } from './fixtures';
import type { Page } from '@playwright/test';

export async function expectStudyExamples(page: Page, count: number) {
  const root = page.locator('[data-form-study]');
  await expect(root).toHaveAttribute('data-study-mode', 'examples');
  await expect(root).toHaveAttribute('data-study-ready', 'true');
  const pages = root.locator('[data-study-page]');
  await expect(pages).toHaveCount(count + 1);
  for (let index = 0; index <= count; index++) {
    const example = pages.nth(index);
    await expect(example).toBeVisible();
    await expect(example.locator('.sdr-header')).toBeVisible();
    await expect(example.locator('[data-study-page-back]')).toBeVisible();
    const steps = example.locator('[data-study-stepper] li');
    await expect(steps).toHaveCount(count + 1);
    await expect(steps.nth(index)).toHaveAttribute('aria-current', 'step');
    await expect(example.locator('[aria-current="step"]')).toHaveCount(1);
  }
  for (const fields of await root.locator('[data-study-step]').all()) { await expect(fields).toBeVisible(); await expect(fields).toBeEnabled(); }
  const field = root.locator('input[type="text"]:visible,input[type="email"]:visible,input[type="tel"]:visible,textarea:visible').first();
  const name = await field.getAttribute('name');
  await field.fill('Fictional answer');
  await expect(root.locator('[data-study-review]')).toContainText('Fictional answer');
  await root.locator(`[data-study-edit="${name}"]`).click();
  await expect(field).toBeFocused();
  for (const example of await pages.all()) await expect(example).toBeVisible();
  expect(await root.locator('[id]').evaluateAll(nodes => new Set(nodes.map(node => node.id)).size === nodes.length)).toBe(true);
  await expectAccessible(page, '[data-form-study]');
  await page.setViewportSize({ width: 320, height: 900 });
  await expectReflow(root);
}
