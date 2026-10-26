import { expect, expectAccessible, expectReflow, openExample, test, type Edition, type Locale } from './support/fixtures';

for (const edition of ['react', 'html'] as Edition[]) for (const locale of ['ro', 'en'] as Locale[]) {
  for (const kind of ['Radio', 'Checkbox']) {
    test(`Conditional ${kind} ${edition} ${locale}: selection, keyboard, retained answers and form reset`, async ({ page }, info) => {
      const name = `Conditional${kind}`;
      const root = await openExample(page, name, edition, locale);
      const role = kind === 'Radio' ? 'radio' : 'checkbox';
      const choices = root.getByRole(role);
      const panels = root.locator('[data-sdr-conditional]');
      await expect(panels.nth(0)).toBeVisible(); await expect(panels.nth(1)).toBeHidden();
      const email = panels.nth(0).locator('input'), phone = panels.nth(1).locator('input');
      await expect(email).toHaveAttribute('aria-invalid', 'true');
      await expect(email).toHaveAccessibleDescription(locale === 'ro' ? 'Introdu adresa de email.' : 'Enter your email address.');
      await root.evaluate(node => {
        const form = document.createElement('form');
        form.append(...node.childNodes); node.append(form);
        form.querySelectorAll<HTMLInputElement>('input[type="email"],input[type="tel"]').forEach(input => { input.required = true; });
      });
      await choices.nth(0).focus(); await page.keyboard.press('Tab'); await expect(email).toBeFocused();
      await email.fill('citizen@example.ro');
      await choices.nth(1).focus(); await page.keyboard.press('Space');
      await expect(choices.nth(1)).toBeFocused(); await expect(phone).toBeVisible();
      await expect(panels.nth(0))[kind === 'Radio' ? 'toBeHidden' : 'toBeVisible']();
      await phone.fill('0712345678');
      if (kind === 'Checkbox') await choices.nth(0).uncheck();
      await expect(email).toBeDisabled();
      const submission = await root.locator('form').evaluate((form: HTMLFormElement) => ({ valid: form.checkValidity(), entries: [...new FormData(form).entries()] }));
      expect(submission.valid).toBe(true);
      expect(submission.entries.some(([key]) => key === 'email-address')).toBe(false);
      expect(submission.entries).toContainEqual(['phone-number', '0712345678']);
      await choices.nth(0).check(); await expect(email).toHaveValue('citizen@example.ro');
      await root.locator('form').evaluate((form: HTMLFormElement) => form.reset());
      await expect(panels.nth(0)).toBeVisible(); await expect(panels.nth(1)).toBeHidden();
      await expect(email).toHaveValue('');
      await expectAccessible(page, edition === 'react' ? `[data-sdr-example="${name}"] .sdr-demo__canvas` : 'main > .sdr');
      for (const theme of ['light', 'dark', 'heritage', 'contrast']) for (const density of ['comfortable', 'compact']) {
        await root.evaluate((node, settings) => {
          node.setAttribute('data-sdr-theme', settings.theme); node.setAttribute('data-sdr-density', settings.density);
        }, { theme, density });
        const alignment = await root.evaluate(node => {
          const panel = node.querySelector<HTMLElement>('[data-sdr-conditional]')!;
          const label = node.querySelector('.sdr-choice__label')!.getBoundingClientRect();
          const error = panel.querySelector('.sdr-field--error')!.getBoundingClientRect();
          const input = panel.querySelector('input')!.getBoundingClientRect();
          return { indent: label.left - error.left, railBottom: error.bottom - input.bottom, branchBottom: panel.getBoundingClientRect().bottom - input.bottom };
        });
        expect(Math.abs(alignment.indent)).toBeLessThanOrEqual(0.5);
        expect(Math.abs(alignment.railBottom)).toBeLessThanOrEqual(0.5);
        expect(Math.abs(alignment.branchBottom)).toBeLessThanOrEqual(0.5);
        if (density === 'comfortable' && locale === 'ro') await root.screenshot({
          path: `output/playwright/conditional/${info.project.name}/${edition}-${kind}-${theme}.png`, scale: 'css',
          style: 'header.header,mobile-starlight-toc{visibility:hidden!important}',
        });
      }
      for (const width of [320, 768]) {
        await page.setViewportSize({ width, height: 900 });
        await expectReflow(root);
      }
      await root.evaluate(node => { node.setAttribute('dir', 'rtl'); });
      await expectReflow(root);
      await root.evaluate(node => { node.style.fontSize = '200%'; });
      await expectReflow(root);
    });
  }
}

test('Radios reveal their fields using native arrow-key navigation', async ({ page }) => {
  const root = await openExample(page, 'ConditionalRadio', 'html');
  const radios = root.getByRole('radio');
  await radios.nth(0).focus(); await page.keyboard.press('ArrowDown');
  await expect(radios.nth(1)).toBeChecked(); await expect(radios.nth(1)).toBeFocused();
  await expect(root.locator('[data-sdr-conditional]').nth(0)).toBeHidden();
  await page.keyboard.press('Tab'); await expect(root.getByRole('textbox', { name: 'Phone number' })).toBeFocused();
});

test('Portable conditional fields remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const slug of ['conditional-radio', 'conditional-checkbox']) {
    await page.goto(`http://127.0.0.1:4322/examples/en/${slug}.html`);
    for (const panel of await page.locator('[data-sdr-conditional]').all()) {
      await expect(panel).toBeVisible(); await expect(panel.locator('input')).toBeEnabled();
    }
  }
  await context.close();
});
