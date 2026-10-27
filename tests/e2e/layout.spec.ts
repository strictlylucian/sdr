import { expect, openExample, test, type Edition, type Locale } from './support/fixtures';

for (const edition of ['react', 'html'] as Edition[]) for (const locale of ['ro', 'en'] as Locale[]) {
  test(`Form spacing ${edition} ${locale}: question gaps adapt without changing label gaps or explicit overrides`, async ({ page }, info) => {
    const root = await openExample(page, 'Fieldset', edition, locale);
    for (const density of ['comfortable', 'compact']) for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await root.evaluate((node, density) => node.setAttribute('data-sdr-density', density), density);
      const geometry = await root.locator('.sdr-fieldset').evaluate(node => {
        const fields = [...node.querySelectorAll<HTMLElement>(':scope > .sdr-field')];
        const label = fields[0].querySelector('label')!.getBoundingClientRect();
        const input = fields[0].querySelector('input')!.getBoundingClientRect();
        return { gap: fields[1].getBoundingClientRect().top - fields[0].getBoundingClientRect().bottom, labelGap: input.top - label.bottom };
      });
      expect(geometry.gap).toBe(density === 'compact' ? (width < 640 ? 16 : 24) : (width < 640 ? 24 : 32));
      expect(geometry.labelGap).toBe(8);
    }
    await root.locator('.sdr-fieldset').evaluate(node => node.classList.add('sdr-u-gap-3'));
    const override = await root.locator('.sdr-fieldset').evaluate(node => getComputedStyle(node).rowGap);
    expect(override).toBe('12px');
    await root.screenshot({ path: info.outputPath('form-spacing.png'), scale: 'css' });
  });
  test(`Accordion ${edition} ${locale}: bulk action aligns to the component edge`, async ({ page }) => {
    const root = await openExample(page, 'Accordion', edition, locale);
    const accordion = root.locator('.sdr-accordion');
    const toggle = accordion.locator('[data-sdr-accordion-toggle]');
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const outer = await accordion.boundingBox(), button = await toggle.boundingBox();
      expect(Math.abs(button!.x - outer!.x)).toBeLessThan(1);
      await toggle.click();
      await expect(accordion.locator('details[open]')).toHaveCount(2);
      await toggle.click();
      await expect(accordion.locator('details[open]')).toHaveCount(0);
    }
  });

  test(`SearchBar ${edition} ${locale}: action and input have the same height`, async ({ page }) => {
    const root = await openExample(page, 'SearchBar', edition, locale);
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const input = await root.getByRole('searchbox').boundingBox();
      const button = await root.getByRole('button').boundingBox();
      expect(Math.abs(input!.height - button!.height)).toBeLessThan(1);
    }
  });

  test(`SummaryList ${edition} ${locale}: value columns share an alignment track`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const root = await openExample(page, 'SummaryList', edition, locale);
    const positions = await root.locator('.sdr-summary__row > dd:not(.sdr-summary__actions)').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().left));
    expect(positions.length).toBeGreaterThan(1);
    expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(1);
  });
}
