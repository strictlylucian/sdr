import {
  expect,
  expectAccessible,
  test,
  type Edition,
  type Locale,
} from "./support/fixtures";
import { openReactPage } from "./support/page-fixture";
import { formStudies } from '../../apps/docs/src/studies/forms';
import { expectReflow } from './support/fixtures';

for (const edition of ["react", "html"] as Edition[])
  for (const locale of ["ro", "en"] as Locale[]) {
    test(`Page ${edition} ${locale}: keyboard entry, required documents, validation and confirmation`, async ({
      page,
    }) => {
      const posts: string[] = [];
      page.on("request", (request) => {
        if (request.method() === "POST") posts.push(request.url());
      });
      if (edition === "react") await openReactPage(page, locale);
      else await page.goto(`/examples/${locale}/page.html`);
      await expect(page.getByRole("main")).toBeVisible();
      await page.bringToFront();
      await page.keyboard.press('Tab');
      const skip = page.getByRole("link", {
        name: locale === "ro" ? "Mergi direct la conținut" : "Skip to content",
      });
      await expect(skip).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("#page-main")).toBeFocused();
      await expect(page.locator("#page-documents li")).toHaveCount(3);
      await expect(page.locator("#page-documents details")).toHaveCount(0);
      const submit = page.locator('[data-sdr-page-form] button[type="submit"]');
      await submit.click();
      await expect(page.locator("#page-confirmation")).not.toBeVisible();
      await page.locator("#full-name").fill("Ana Șerban");
      await page.locator("#email").fill("ana@example.invalid");
      await page.locator("#document-type").selectOption("certificate");
      await page.locator("#confirm-details").check();
      await submit.click();
      await expect(page.locator("#page-confirmation")).toBeVisible();
      await expect(page.locator("#page-confirmation")).toBeFocused();
      await expectAccessible(page, "body");
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
      }
      await page.setViewportSize({ width: 320, height: 900 });
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      expect(posts).toEqual([]);
    });
  }

for (const edition of ['react', 'html'] as const) for (const locale of ['ro', 'en'] as const) for (const study of formStudies) {
  test(`Form study ${study.id} ${edition} ${locale}: review, errors, mobile reflow and no submission`, async ({ page }, info) => {
    test.setTimeout(90000);
    const posts: string[] = [];
    page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
    await page.goto(edition === 'react' ? `/${locale}/reality/${study.id}/` : `/examples/${locale}/study-${study.id}.html`);
    const storageBefore = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
    const root = page.locator('[data-form-study]');
    if (edition === 'react') {
      await expect(page.locator('.sdr-doc-notice')).toHaveCount(1);
      await expect(page.locator('.sdr-doc-footer .sdr-doc-notice')).toHaveCount(1);
      await expect(root.locator('.sdr-doc-notice,.sdr-alert')).toHaveCount(0);
    }
    await expect(root.locator('.sdr-header')).toBeVisible();
    await expect(root.locator('.sdr-back')).toHaveAttribute('href', `/${locale}/reality/`);
    const typography = await root.locator('legend').first().evaluate(node => {
      const heading = document.createElement('h2'); node.parentElement!.append(heading);
      const properties = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color'] as const;
      const read = (element: Element) => Object.fromEntries(properties.map(key => [key, getComputedStyle(element)[key]]));
      const result = { legend: read(node), heading: read(heading) }; heading.remove(); return result;
    });
    expect(typography.legend).toEqual(typography.heading);
    const next = root.locator('[data-study-next]');
    await expect(next).toBeEnabled();
    await page.setViewportSize({ width: 320, height: 900 });
    const menu = root.locator('[data-sdr-navigation-toggle]');
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(root.locator('[data-sdr-navigation-links]')).toBeVisible();
    await menu.click();
    await expectReflow(root);
    await next.click();
    await expect(root.locator('[data-study-errors]')).toBeFocused();
    await expectAccessible(page, '[data-form-study]');
    const firstError = root.locator('[data-study-errors] a').first();
    const target = await firstError.getAttribute('href');
    await firstError.click();
    await expect(page.locator(target!)).toBeFocused();
    for (const [index, step] of study.steps.entries()) {
      const group = root.locator(`[data-study-step="${index}"]`);
      for (const field of step.fields) {
        const input = group.locator(`[name="${field.name}"]`);
        if (field.showWhen && !await input.isVisible()) continue;
        if (field.fixedValueKey) continue;
        if (field.type === 'file') {
          await input.setInputFiles({ name: 'example.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('fictional') });
          await next.click();
          await expect(input).toHaveAttribute('aria-invalid', 'true');
          await input.setInputFiles({ name: 'fișier.pdf', mimeType: 'application/pdf', buffer: Buffer.from('fictional') });
          continue;
        }
        if (field.type === 'select') { await input.selectOption(field.options![0].value); continue; }
        if (field.type === 'checkbox') { await input.check(); continue; }
        const value = field.type === 'date' ? '2000-01-01' : field.name === 'percentage' ? '3.5' : field.name === 'tax-year' ? '2025' : field.pattern === '[0-9]{13}' ? '0000000000000' : field.pattern === '[0-9]+' ? '123456' : field.type === 'email' ? 'fictional@example.invalid' : field.type === 'number' ? '1' : 'Exemplu fictiv';
        await input.fill(value);
        if (field.matches) {
          await input.fill('different@example.invalid');
          await next.click();
          await expect(input).toHaveAttribute('aria-invalid', 'true');
          await input.fill(value);
        }
        if (field.name === study.pricing?.countField) {
          await input.fill('1.5');
          await next.click();
          await expect(input).toHaveAttribute('aria-invalid', 'true');
          await input.fill('3');
          await expect(root.locator('[data-study-total]')).toContainText('75');
        }
      }
      if (index === 0) { await expectReflow(root); await expectAccessible(page, '[data-form-study]'); }
      await next.click();
      await expect(root.locator('[data-study-errors]')).not.toBeVisible();
    }
    await expect(root.locator('[data-study-review]')).toBeFocused();
    await expect(root.locator('.sdr-summary')).toHaveCount(study.steps.length);
    await expectReflow(root);
    await expectAccessible(page, '[data-form-study]');
    await root.screenshot({ path: info.outputPath('study-review-mobile.png'), scale: 'css' });
    await root.locator('[data-study-answers] button').first().click();
    const primary = study.steps[0].fields.find(field => field.autoComplete === 'family-name' || field.autoComplete === 'name')!;
    await expect(root.locator(`[name="${primary.name}"]`)).toHaveValue('Exemplu fictiv');
    for (const _step of study.steps) await next.click();
    await root.locator('[data-study-finish]').click();
    await expect(root.locator('[data-study-done]')).toBeFocused();
    await expect(root.locator('[data-study-done]')).toContainText(study.id === 'online-payment' ? (locale === 'ro' ? 'nicio plată' : 'No payment') : (locale === 'ro' ? 'Nicio cerere' : 'No application'));
    await root.locator('[data-study-restart]').click();
    await expect(root.locator(`[name="${primary.name}"]`)).toHaveValue('');
    if (study.id === 'online-igi') expect(await root.locator('input[type="file"]').evaluate(input => (input as HTMLInputElement).files!.length)).toBe(0);
    expect(posts).toEqual([]);
    expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual(storageBefore);
  });
}
