import { catalog, expect, expectAccessible, openExample, test, type Edition, type Locale } from './support/fixtures';

for (const locale of ['ro', 'en'] as Locale[]) for (const edition of ['react', 'html'] as Edition[]) {
  test(`Validation ${edition} ${locale}: every error state has a message, associated controls and visible treatment in all themes`, async ({ page }) => {
    test.setTimeout(90000);
    for (const example of catalog.states.filter(item => item.state === 'error')) {
      const root = await openExample(page, example.name, edition, locale);
      const controls = root.locator('input:not([type="hidden"]),select,textarea');
      expect(await controls.count(), example.name).toBeGreaterThan(0);
      for (const control of await controls.all()) {
        await expect(control).toHaveAttribute('aria-invalid', 'true');
        expect(await control.evaluate(node => (node.getAttribute('aria-describedby') ?? '').split(' ').every(id => !!document.getElementById(id)))).toBe(true);
        await expect(control).toHaveAccessibleDescription(/\S/);
      }
      for (const theme of ['light', 'dark', 'heritage', 'contrast']) {
        await root.evaluate((node, theme) => { (node as HTMLElement).dataset.sdrTheme = theme; }, theme);
        const errorColour = await root.locator('.sdr-error').first().evaluate(node => getComputedStyle(node).color);
        await expect(root.locator('.sdr-field--error').first()).toHaveCSS('border-inline-start-color', errorColour);
        await expect(root.locator('.sdr-field--error').first()).toHaveCSS('border-inline-start-width', '4px');
        for (const input of await root.locator('.sdr-input,.sdr-select,.sdr-textarea,.sdr-file').all()) await expect(input).toHaveCSS('border-color', errorColour);
      }
    }
  });

  test(`Buttons ${edition} ${locale}: destructive and outlined variants retain red, hover and yellow keyboard focus`, async ({ page }, info) => {
    const root = await openExample(page, 'Button', edition, locale);
    const danger = root.locator('.sdr-button--danger');
    const outlined = root.locator('.sdr-button--danger-secondary');
    for (const theme of ['light', 'dark', 'heritage', 'contrast']) {
      await root.evaluate((node, theme) => { (node as HTMLElement).dataset.sdrTheme = theme; }, theme);
      const colour = theme === 'contrast' ? 'rgb(152, 40, 40)' : 'rgb(202, 53, 53)';
      await expect(danger).toHaveCSS('background-color', colour);
      await expect(danger).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(outlined).not.toHaveCSS('background-color', colour);
      await danger.hover();
      await expect(danger).toHaveCSS('background-color', theme === 'contrast' ? 'rgb(101, 27, 27)' : 'rgb(152, 40, 40)');
      await danger.focus(); await page.keyboard.press('Shift');
      await expect(danger).toHaveCSS('background-color', 'rgb(252, 209, 22)');
      await expect(danger).toHaveCSS('color', 'rgb(19, 31, 51)');
      await danger.blur(); await page.mouse.move(0, 0);
      await expectAccessible(page, edition === 'html' ? 'main > .sdr' : '[data-sdr-example="Button"] .sdr-demo__canvas');
    }
    if (info.project.name === 'chromium' && locale === 'ro' && edition === 'react') await root.screenshot({ path: 'output/playwright/button-variants.png' });
  });
}
