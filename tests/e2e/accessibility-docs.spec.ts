import { test, expect } from './support/fixtures';
import { readFileSync } from 'node:fs';
const audit = JSON.parse(readFileSync('catalog/accessibility/audit.json', 'utf8')) as { sourceFingerprint: string | null };
const components = JSON.parse(readFileSync('catalog/data/components.json', 'utf8')) as { name: string; slug: string }[];

for (const locale of ['ro', 'en']) {
  test(`Accessibility evidence ${locale}: top badges, variant links and complete inventory`, async ({ page }, info) => {
    const state = audit.sourceFingerprint !== null && audit.sourceFingerprint === info.config.metadata.accessibilitySource ? 'passed' : 'pending';
    await page.goto(`/${locale}/components/button/`);
    const badges = page.locator('.sdr-audit-status');
    await expect(badges.first()).toHaveAttribute('data-a11y-status', state);
    await expect(badges.first().getByRole('link')).toHaveAttribute('href', `/${locale}/accessibility/`);
    if (state === 'passed') await expect(badges.first().getByRole('link')).toHaveText(locale === 'ro' ? 'Verificat WCAG 2.2 AA' : 'Passes WCAG 2.2 AA checks');
    await expect(badges.first()).not.toContainText(locale === 'ro' ? 'Automat' : 'Automated');
    expect(await badges.first().evaluate(node => node.parentElement!.firstElementChild === node)).toBe(true);
    const variant = page.locator('#variant-toggle-button .sdr-audit-status');
    await expect(variant).toHaveAttribute('data-a11y-status', state);
    await expect(variant.getByRole('link')).toHaveAttribute('href', `/${locale}/accessibility/`);
    await badges.first().getByRole('link').click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/accessibility/$`));
    await expect(page.locator('.sdr-audit-table tbody tr')).toHaveCount(components.length);
    for (const component of components) {
      const row = page.locator(`#audit-${component.slug}`);
      await expect(row.getByRole('link')).toBeVisible();
      await expect(row.locator('td').first()).toHaveText(state === 'passed' ? (locale === 'ro' ? 'Verificat' : 'Passes') : (locale === 'ro' ? 'În așteptare' : 'Pending'));
    }
    await expect(page.locator('.sdr-audit-table tbody tr').first()).toContainText(locale === 'ro' ? 'În așteptare' : 'Pending');
  });
}
