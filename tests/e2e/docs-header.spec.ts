import { expect, test } from './support/fixtures';

const widths = [320, 375, 640, 768, 799, 800, 1024, 1080, 1280, 1360, 1380, 1395, 1440, 1536, 1600, 1664, 1920, 2560];
for (const locale of ['ro', 'en']) for (const section of ['', 'components/button/']) {
  test(`Documentation header ${locale} ${section || 'home'}: responsive controls stay inside the masthead`, async ({ page }, info) => {
    await page.goto(`/${locale}/${section}`);
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
    for (const size of [16, 32]) {
      await page.evaluate(size => { document.documentElement.style.fontSize = `${size}px`; }, size);
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const errors = await page.evaluate(() => {
          const header = document.querySelector('header.header')!;
          const box = header.getBoundingClientRect();
          const visible = (node: Element) => node.getClientRects().length && node.getBoundingClientRect().width > 0;
          const controls = [...header.querySelectorAll<HTMLElement>('a,button,select'), ...document.querySelectorAll<HTMLElement>('.sl-menu-button')].filter(visible);
          const problems: string[] = [];
          for (const control of controls) {
            const rect = control.getBoundingClientRect(), label = control.getAttribute('aria-label') ?? control.textContent?.trim();
            if (rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1) problems.push(`outside: ${label}`);
            if (control.scrollWidth > control.clientWidth + 1) problems.push(`clipped: ${label}`);
          }
          for (let a = 0; a < controls.length; a++) for (let b = a + 1; b < controls.length; b++) {
            const first = controls[a].getBoundingClientRect(), second = controls[b].getBoundingClientRect();
            if (Math.min(first.right, second.right) - Math.max(first.left, second.left) > 1 && Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 1) problems.push('overlapping controls');
          }
          const links = [...header.querySelectorAll('.sdr-doc-nav a')].filter(visible);
          if (links.some(link => Math.abs(link.getBoundingClientRect().top - links[0].getBoundingClientRect().top) > 1)) problems.push('wrapped navigation');
          return problems;
        });
        expect(errors, `${locale}/${section} at ${width}px with ${size}px root text`).toEqual([]);
      }
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = '16px'; });
    await page.setViewportSize({ width: 1920, height: 900 });
    await expect(page.locator('header.header .sdr-doc-nav')).toBeVisible();
    await page.setViewportSize({ width: 1380, height: 900 });
    const search = page.locator('site-search > button');
    await search.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('site-search dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(search).toBeFocused();
    if (!section && info.project.name === 'chromium') {
      await page.locator('header.header').screenshot({ path: `output/playwright/docs-header-${locale}-1380.png` });
      await page.setViewportSize({ width: 1920, height: 900 });
      await page.locator('header.header').screenshot({ path: `output/playwright/docs-header-${locale}-1920.png` });
    }
    if (section) {
      await page.setViewportSize({ width: 320, height: 900 });
      await page.locator('.sl-menu-button').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#starlight__sidebar')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('.sl-menu-button')).toBeFocused();
    }
  });
}
