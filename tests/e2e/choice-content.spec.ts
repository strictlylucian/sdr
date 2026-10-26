import { expect, expectAccessible, expectReflow, openExample, test, type Edition, type Locale } from './support/fixtures';
import { openReactChoice } from './support/choice-fixture';

const screenshotOptions = { scale: 'css' as const, style: 'header.header,mobile-starlight-toc{visibility:hidden!important}' };

for (const edition of ['react', 'html'] as Edition[]) for (const locale of ['ro', 'en'] as Locale[]) {
  test(`Choice content ${edition} ${locale}: aligned labels, hints and error bottoms without padded rows`, async ({ page }, info) => {
    test.setTimeout(120000);
    for (const name of ['RadioError', 'CheckboxError', 'SwitchError', 'SegmentedControlError']) {
      await page.setViewportSize({ width: 1280, height: 900 });
      const root = await openExample(page, name, edition, locale);
      for (const theme of ['light', 'dark', 'heritage', 'contrast']) for (const density of ['comfortable', 'compact']) {
        await root.evaluate((node, settings) => {
          node.setAttribute('data-sdr-theme', settings.theme);
          node.setAttribute('data-sdr-density', settings.density);
        }, { theme, density });
        const geometry = await root.evaluate(node => {
          const rows = [...node.querySelectorAll<HTMLElement>('.sdr-choice')].map(row => {
            const input = row.querySelector('input')!, label = row.querySelector('.sdr-choice__label')!;
            const box = input.getBoundingClientRect(), text = label.getBoundingClientRect(), css = getComputedStyle(input);
            const hint = row.querySelector('.sdr-hint')?.getBoundingClientRect();
            const padding = getComputedStyle(row);
            const paintedBottom = hint?.bottom ?? Math.max(box.bottom, text.bottom);
            return { center: box.top + box.height / 2 - text.top - parseFloat(getComputedStyle(label).lineHeight) / 2,
              square: box.width - box.height, bottom: row.getBoundingClientRect().bottom - paintedBottom,
              hintBelow: hint ? hint.top - Math.max(box.bottom, text.bottom) : null,
              paddingStart: padding.paddingBlockStart, paddingEnd: padding.paddingBlockEnd,
              shadow: css.boxShadow, radius: css.borderRadius, type: input.type };
          });
          const rail = node.querySelector('.sdr-field--error')!;
          const last = rail.querySelector('.sdr-segmented') ?? [...rail.querySelectorAll('.sdr-choice')].at(-1)!;
          return { rows, railBottom: rail.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom };
        });
        expect(Math.abs(geometry.railBottom), name).toBeLessThanOrEqual(0.5);
        for (const row of geometry.rows) {
          expect(Math.abs(row.center), name).toBeLessThanOrEqual(0.5);
          expect(Math.abs(row.square), name).toBeLessThanOrEqual(0.5);
          expect(Math.abs(row.bottom), name).toBeLessThanOrEqual(0.5);
          expect(row.paddingStart).toBe('0px');
          expect(row.paddingEnd).toBe('0px');
          expect(row.shadow).toBe('none');
          if (row.hintBelow !== null) expect(row.hintBelow).toBeGreaterThanOrEqual(4);
          if (row.type === 'radio') expect(row.radius).toBe('50%');
        }
        if (locale === 'ro' && density === 'comfortable') {
          await root.screenshot({ ...screenshotOptions, path: `output/playwright/choice-review/${info.project.name}/${edition}-${name}-${theme}.png` });
          if (theme === 'dark') for (const input of await root.locator('input[type="radio"]').all()) {
            const background = await root.evaluate(node => getComputedStyle(node).backgroundColor);
            const bytes = await input.screenshot({ scale: 'css' });
            const pixels = await page.evaluate(async ({ png, background }) => {
              const image = new Image();
              image.src = png;
              await image.decode();
              const canvas = document.createElement('canvas');
              canvas.width = image.width; canvas.height = image.height;
              const context = canvas.getContext('2d')!;
              context.drawImage(image, 0, 0);
              const bg = background.match(/\d+/g)!.slice(0, 3).map(Number);
              const points = [[1, 1], [image.width - 2, 1], [1, image.height - 2], [image.width - 2, image.height - 2]];
              return points.map(([x, y]) => {
                const colour = context.getImageData(x, y, 1, 1).data;
                return Math.max(...bg.map((channel, i) => Math.abs(channel - colour[i])));
              });
            }, { png: `data:image/png;base64,${bytes.toString('base64')}`, background });
            for (const delta of pixels) expect(delta, `${name}: circular painted corners`).toBeLessThanOrEqual(3);
          }
        }
      }
      await page.setViewportSize({ width: 320, height: 900 });
      await root.evaluate(node => { node.setAttribute('data-sdr-theme', 'dark'); node.setAttribute('data-sdr-density', 'comfortable'); });
      if (locale === 'ro') await root.screenshot({ ...screenshotOptions, path: `output/playwright/choice-review/${info.project.name}/${edition}-${name}-320.png` });
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await expectReflow(root);
      const wrapped = await root.locator('.sdr-choice').evaluateAll(rows => rows.map(row => {
        const input = row.querySelector('input')!.getBoundingClientRect();
        const label = row.querySelector('.sdr-choice__label')!;
        return input.top + input.height / 2 - label.getBoundingClientRect().top - parseFloat(getComputedStyle(label).lineHeight) / 2;
      }));
      for (const difference of wrapped) expect(Math.abs(difference), `${name}: first line at 200%`).toBeLessThanOrEqual(0.5);
      await page.evaluate(() => { document.documentElement.style.fontSize = '16px'; });
      await expectAccessible(page, edition === 'react' ? `[data-sdr-example="${name}"] .sdr-demo__canvas` : 'main > .sdr');
      const input = root.locator('.sdr-choice__input').first();
      await input.focus();
      await page.keyboard.press('Shift');
      await expect(input).toHaveCSS('outline-color', 'rgb(252, 209, 22)');
      await page.emulateMedia({ forcedColors: 'active' });
      await expect(input).toBeVisible();
      await page.emulateMedia({ forcedColors: 'none' });
    }
  });

  test(`Choice hit area ${edition} ${locale}: outer spacing remains clickable without extending the error rail`, async ({ page }) => {
    const root = await openExample(page, 'SwitchError', edition, locale);
    const input = root.locator('input').first();
    await input.scrollIntoViewIfNeeded();
    const before = await input.isChecked();
    const box = await input.boundingBox();
    if (!box) throw new Error('Switch has no rendered box');
    await page.mouse.click(box.x + box.width / 2, box.y - 6);
    await expect(input).toBeChecked({ checked: !before });
  });

  test(`Choice enlarged text ${edition} ${locale}: isolated components preserve first-line alignment at 200%`, async ({ page }, info) => {
    for (const name of ['RadioError', 'CheckboxError', 'SwitchError', 'SegmentedControlError']) {
      await page.setViewportSize({ width: 1280, height: 900 });
      const root = edition === 'react' ? await openReactChoice(page, name, locale) : await openExample(page, name, edition, locale);
      await expect(root.locator('input').first()).toBeVisible();
      await root.evaluate(node => { node.setAttribute('data-sdr-theme', 'dark'); });
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      await expectReflow(root);
      const differences = await root.locator('.sdr-choice').evaluateAll(rows => rows.map(row => {
        const input = row.querySelector('input')!.getBoundingClientRect();
        const label = row.querySelector('.sdr-choice__label')!;
        return input.top + input.height / 2 - label.getBoundingClientRect().top - parseFloat(getComputedStyle(label).lineHeight) / 2;
      }));
      for (const difference of differences) expect(Math.abs(difference)).toBeLessThanOrEqual(0.5);
      if (locale === 'ro') await root.screenshot({ ...screenshotOptions, path: `output/playwright/choice-review/${info.project.name}/${edition}-${name}-1280-200.png` });
    }
  });
}
