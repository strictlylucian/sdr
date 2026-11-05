import { catalog, expect, expectReflow, openExample, test, type Edition } from './support/fixtures';
import { applyTextSpacing, expand, expectReducedMotion, expectVisibleFocus, scan } from './support/accessibility-audit';
import { openReactPage } from './support/page-fixture';

for (const example of [...catalog.components, ...catalog.states]) for (const edition of ['react', 'html'] as Edition[]) {
  test(`WCAG matrix: ${example.name} / ${edition}`, async ({ page }, info) => {
    test.setTimeout(120000);
    const isPage = example.name === 'Page';
    const root = isPage ? await (async () => {
      if (edition === 'react') await openReactPage(page, 'en');
      else await page.goto('/examples/en/page.html');
      return page.locator('.sdr').first();
    })() : await openExample(page, example.name, edition);
    const selector = isPage ? '.sdr' : edition === 'html' ? 'main > .sdr' : `[data-sdr-example="${example.name}"] .sdr-demo__canvas`;
    await scan(page, selector, 'initial', info);
    await expand(root, example.name, page);
    for (const theme of ['light', 'dark', 'heritage', 'contrast']) for (const density of ['comfortable', 'compact']) {
      await root.evaluate((node, settings) => {
        node.setAttribute('data-sdr-theme', settings.theme);
        node.setAttribute('data-sdr-density', settings.density);
      }, { theme, density });
      await scan(page, selector, `${theme}-${density}`, info);
    }
    await scan(page, selector, 'expanded', info);
    const tabs = root.getByRole('tab');
    for (const tab of await tabs.all()) {
      await tab.focus();
      await page.keyboard.press('Enter');
      await scan(page, selector, 'selected-tab', info);
    }
    for (const choice of await root.locator('[data-sdr-component="conditional-choice"] .sdr-choice__input').all()) {
      await choice.check();
      await scan(page, selector, 'selected-conditional-choice', info);
    }
    for (const button of await root.locator('[data-sdr-sort]').all()) {
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button.locator('..')).toHaveAttribute('aria-sort', 'ascending');
      await scan(page, selector, 'sorted-ascending', info);
      await page.keyboard.press('Enter');
      await expect(button.locator('..')).toHaveAttribute('aria-sort', 'descending');
    }
    await expectVisibleFocus(root, page);
    await page.keyboard.press('Escape');
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await expectReducedMotion(root);
    await expectVisibleFocus(root, page);
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'none' });
    await page.setViewportSize({ width: 320, height: 900 });
    await expectReflow(root);
    await applyTextSpacing(page);
    await expectReflow(root);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await expectReflow(root);
    expect(await root.isVisible()).toBe(true);
  });
}
