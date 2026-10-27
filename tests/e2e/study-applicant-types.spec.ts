import { expect, expectAccessible, expectReflow, test } from './support/fixtures';

for (const edition of ['react', 'html'] as const) for (const locale of ['ro', 'en'] as const) {
  for (const id of ['online-igi', 'online-payment'] as const) {
    test(`Applicant types ${id} ${edition} ${locale}: legal entity, conditional validation and review`, async ({ page }) => {
      const posts: string[] = [];
      page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
      await page.goto(edition === 'react' ? `/${locale}/reality/${id}/` : `/examples/${locale}/study-${id}.html`);
      const root = page.locator('[data-form-study]');
      const next = root.locator('[data-study-next]');
      await expect(next).toBeEnabled();
      const type = root.getByRole('combobox', { name: locale === 'ro' ? 'Tipul solicitantului' : 'Applicant type', exact: true });
      await expect(type).toBeEnabled();
      await expect(type.locator('option')).toHaveText(locale === 'ro'
        ? ['Alege o opțiune', 'Persoană fizică', 'Persoană juridică']
        : ['Choose an option', 'Individual', 'Legal entity']);
      await type.selectOption('legal-entity');
      if (id === 'online-payment') {
        await expect(root.locator('[name="recipient-number"]')).toBeHidden();
        await expect(root.locator('[name="recipient-number"]')).toBeDisabled();
        await expect(root.locator('[name="company-name"]')).toBeVisible();
        await next.click();
        await expect(root.locator('[name="company-name"]')).toHaveAttribute('aria-invalid', 'true');
        await root.locator('[name="company-name"]').fill('Companie fictivă');
        await root.locator('[name="company-number"]').fill('12345678');
        await root.locator('[name="payer-number"]').fill('0000000000000');
      } else {
        await root.locator('[name="surname"]').fill('Șerban');
        await root.locator('[name="given-name"]').fill('Ana');
        await root.locator('[name="citizenship"]').fill('Română');
        await root.locator('[name="birth-date"]').fill('2000-01-01');
      }
      await page.setViewportSize({ width: 320, height: 900 });
      await expectReflow(root);
      await expectAccessible(page, '[data-form-study]');
      await next.click();
      if (id === 'online-payment') {
        await root.locator('[name="email"]').fill('fictional@example.invalid');
        await root.locator('[name="confirm-email"]').fill('fictional@example.invalid');
      } else {
        await root.locator('[name="correspondence-address"]').fill('Adresă fictivă');
        await root.locator('[name="county"]').fill('București');
      }
      await next.click();
      if (id === 'online-igi') {
        await root.locator('[name="recipient-office"]').selectOption({ index: 1 });
        await root.locator('[name="petition-text"]').fill('Petiție fictivă');
      }
      await next.click();
      await expect(root.locator('[data-study-review]')).toBeVisible();
      await expect(root.locator('[data-study-answers]')).toContainText(locale === 'ro' ? 'Persoană juridică' : 'Legal entity');
      if (id === 'online-payment') {
        await expect(root.locator('[data-study-answers]')).toContainText('Companie fictivă');
        await expect(root.locator('[data-study-answers]')).not.toContainText(locale === 'ro' ? 'CNP-ul beneficiarului' : 'Recipient’s Romanian personal number');
      }
      await expectAccessible(page, '[data-form-study]');
      await root.locator('[data-study-answers] button').first().click();
      await expect(type).toHaveValue('legal-entity');
      if (id === 'online-payment') {
        await type.selectOption('individual');
        await expect(root.locator('[name="company-number"]')).toBeDisabled();
        await expect(root.locator('[name="recipient-number"]')).toBeVisible();
        await next.click();
        await expect(root.locator('[name="recipient-number"]')).toHaveAttribute('aria-invalid', 'true');
      }
      expect(posts).toEqual([]);
    });
  }
}
