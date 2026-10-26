import { catalog, expect, expectAccessible, openExample, test, type Edition, type Locale } from './support/fixtures';

for (const edition of ['react', 'html'] as Edition[]) for (const locale of ['ro', 'en'] as Locale[]) {
  test(`Choice error geometry ${edition} ${locale}: native shapes, inset errors and visible keyboard focus`, async ({ page }) => {
    for (const name of ['CheckboxError', 'RadioError', 'SwitchError']) {
      const root = await openExample(page, name, edition, locale);
      const input = root.locator('.sdr-choice__input').first();
      for (const theme of ['light', 'dark', 'heritage', 'contrast']) for (const density of ['comfortable', 'compact']) {
        await root.evaluate((node, settings) => {
          node.setAttribute('data-sdr-theme', settings.theme);
          node.setAttribute('data-sdr-density', settings.density);
        }, { theme, density });
        for (const checked of [false, true]) {
          await input.evaluate((node, value) => { (node as HTMLInputElement).checked = value; }, checked);
          await input.blur();
          const geometry = await input.evaluate(node => {
            const box = node.getBoundingClientRect(), css = getComputedStyle(node);
            return { width: box.width, height: box.height, radius: css.borderRadius,
              offset: parseFloat(css.outlineOffset), shadow: css.boxShadow, outline: css.outlineStyle };
          });
          expect(geometry.width, name).toBe(geometry.height);
          expect(geometry.width, name).toBe(24);
          expect(geometry.offset, name).toBeLessThan(0);
          expect(geometry.shadow, name).toBe('none');
          expect(geometry.outline, name).toBe('solid');
          if (name === 'RadioError') expect(geometry.radius).toBe('50%');
        }
        await input.focus();
        await page.keyboard.press('Shift');
        await expect(input).toHaveCSS('outline-color', 'rgb(252, 209, 22)');
        await expect(input).toHaveAttribute('aria-invalid', 'true');
      }
      await expectAccessible(page, edition === 'react' ? `[data-sdr-example="${name}"] .sdr-demo__canvas` : 'main > .sdr');
      await page.emulateMedia({ forcedColors: 'active' });
      const forced = await root.locator('.sdr-field--error').first().evaluate(node => {
        const style = getComputedStyle(node, '::before');
        return { width: style.borderInlineStartWidth, style: style.borderInlineStartStyle, colour: style.borderInlineStartColor };
      });
      expect(forced.width).toBe('4px');
      expect(forced.style).toBe('solid');
      expect(forced.colour).not.toBe('rgba(0, 0, 0, 0)');
      await page.emulateMedia({ forcedColors: 'none' });
    }
  });
}

for (const locale of ['ro', 'en'] as Locale[]) {
  test(`Form-state sidebar ${locale}: all states have reachable anchors and exact current selection`, async ({ page, request }) => {
    await openExample(page, 'CheckboxError', 'react', locale);
    await expect(page.locator('[data-sdr-state]')).toHaveCount(catalog.states.length);
    const links = await page.locator('[data-sdr-state]').evaluateAll(nodes => nodes.map(node => ({
      href: node.getAttribute('href')!, slug: node.getAttribute('data-sdr-state')!,
    })));
    const pages = new Map<string, string>();
    for (const link of links) {
      const [path, anchor] = link.href.split('#');
      if (!pages.has(path)) pages.set(path, await (await request.get(path)).text());
      expect(pages.get(path), link.slug).toContain(`id="${anchor}"`);
    }
    for (const name of ['CheckboxError', 'SwitchError', 'RadioError', 'SegmentedControlError', 'TextInputReadOnly']) {
      const example = catalog.states.find(item => item.name === name)!;
      await page.goto(example.docsPath[locale]);
      const selected = page.locator(`[data-sdr-state="${example.slug}"]`);
      await expect(selected).toHaveAttribute('aria-current', 'location');
      await expect(selected).toBeVisible();
      await expect(selected).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(page.locator('[aria-current="location"]')).toHaveCount(1);
      await page.reload();
      await expect(selected).toHaveAttribute('aria-current', 'location');
    }
  });
}
