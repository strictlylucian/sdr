import { expectStudyExamples } from './support/study-examples';
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
import { expectPageLayout } from './support/page-layout';

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
      await expect(page.getByRole('main')).toHaveCount(1);
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
        await expectPageLayout(page.locator('.sdr-page'));
        expect(await page.locator('.sdr-page').evaluate(node => node.getBoundingClientRect().x)).toBe(0);
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
  test(`Form study ${study.id} ${edition} ${locale}: review, visual baseline, mobile reflow and no submission`, async ({ page }, info) => {
    test.setTimeout(90000);
    const posts: string[] = [];
    page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
    await page.goto(edition === 'react' ? `/${locale}/reality/${study.id}/` : `/examples/${locale}/study-${study.id}.html`);
    if (edition === 'react') { await expectStudyExamples(page, study.steps.length); expect(posts).toEqual([]); return; }
    const storageBefore = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
    const root = page.locator('[data-form-study]');
    await expect(root.locator('[id$="-help"],a[href$="-help"]')).toHaveCount(0);
    await expect(root.locator('.sdr-header')).toBeVisible();
    await expect(root).toHaveClass(/sdr-page/);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expectPageLayout(root);
    expect(await root.evaluate(node => node.getBoundingClientRect().x)).toBe(0);
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
    await expectPageLayout(root);
    const menu = root.locator('[data-sdr-navigation-toggle]');
    await expect(menu).toBeHidden();
    await expect(root.locator('[data-sdr-navigation-links]')).toBeVisible();
    await expectReflow(root);
    await expect(root.locator('[data-study-error], [data-study-errors], [aria-invalid]')).toHaveCount(0);
    if (study.id === 'online-gruiu') {
      await root.locator('[data-study-stepper] a').last().click();
      await expect(root.locator('[name="issue-type"]').first()).toBeFocused();
      await expect(root.locator('[data-study-error]:visible')).toHaveCount(2);
      const invalidGroup = root.locator('.sdr-field-group.sdr-field--error > .sdr-fieldset');
      const groupError = invalidGroup.locator('.sdr-legend + .sdr-error');
      await expect(groupError).toBeVisible();
      const groupErrorId = (await groupError.getAttribute('id'))!;
      await expect(invalidGroup).toHaveAttribute('aria-describedby', groupErrorId);
      await expect(root.locator('[name="issue-type"]').first()).toHaveAttribute('aria-describedby', groupErrorId);
      await root.screenshot({ path: info.outputPath('study-first-step-errors.png'), scale: 'css' });
      await root.locator('[name="issue-type"][value="other"]').check();
      await expect(invalidGroup).toHaveCount(0);
      await root.locator('[name="description"]').fill('Exemplu fictiv');
      await next.click();
      await expect(root.locator('[name="other-issue"]')).toBeFocused();
      await expect(root.locator('[name="other-issue"]')).toHaveAttribute('aria-invalid', 'true');
    } else if (study.id === 'health-allowance') {
      await root.locator('[data-study-stepper] a').last().click();
      await expect(root.locator('[name="full-name"]')).toBeFocused();
      await expect(root.locator('[data-study-error]:visible')).toHaveCount(3);
      const cnpField = root.locator('.sdr-field.sdr-field--error').filter({ has: page.locator('[name="personal-number"]') });
      const cnpError = cnpField.locator('.sdr-hint + .sdr-error:has(+ .sdr-input)');
      await expect(cnpError).toBeVisible();
      await root.screenshot({ path: info.outputPath('study-first-step-errors.png'), scale: 'css' });
      await root.locator('[name="personal-number"]').fill('0000000000000');
      await expect(cnpField).toHaveCount(0);
    } else {
      for (const _step of study.steps) await next.click();
      await expect(root.locator('[data-study-review]')).toBeVisible();
      await root.locator('[data-study-finish]').click();
      await root.locator('[data-study-restart]').click();
    }
    await expect(root.locator('[data-study-step="0"]')).toBeVisible();
    let primaryName: string | null = null;
    for (const [index, step] of study.steps.entries()) {
      const group = root.locator(`[data-study-step="${index}"]`);
      for (const field of step.fields) {
        const input = group.locator(`[name="${field.name}"]`);
        if (field.showWhen && !await input.isVisible()) continue;
        if (field.type === 'radios') { await group.locator(`[name="${field.name}"]`).first().check(); continue; }
        if (field.type === 'checkboxes') { await input.first().check(); continue; }
        if (field.fixedValueKey) continue;
        if (field.type === 'file') {
          if (!field.accept) { await input.setInputFiles({ name: 'example.pdf', mimeType: 'application/pdf', buffer: Buffer.from('fictional') }); continue; }
          await input.setInputFiles(field.multiple ? [
            { name: 'fișier.pdf', mimeType: 'application/pdf', buffer: Buffer.from('fictional') },
            { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('fictional') },
          ] : { name: 'fișier.pdf', mimeType: 'application/pdf', buffer: Buffer.from('fictional') });
          continue;
        }
        if (field.type === 'select') { await input.selectOption(field.options![0].value); continue; }
        if (field.type === 'checkbox') { await input.check(); continue; }
        const value = field.type === 'date' ? '2000-01-01' : field.name === 'percentage' ? '3.5' : field.name === 'tax-year' ? '2025' : field.pattern === '[0-9]{13}' ? '0000000000000' : field.pattern === '[0-9]+' ? '123456' : field.type === 'email' ? 'fictional@example.invalid' : field.type === 'number' ? '1' : 'Exemplu fictiv';
        await input.fill(value);
        if (field.name === study.pricing?.countField) {
          await input.fill('3');
          await expect(root.locator('[data-study-total]')).toContainText('75');
        }
      }
      if (index === 0) { primaryName = await group.locator('input[type="text"]:not([inputmode="numeric"]):visible,textarea:visible').first().getAttribute('name'); await expectReflow(root); await expectAccessible(page, '[data-form-study]'); }
      if (study.id === 'health-allowance' && index === 0) {
        await group.locator('[name="personal-number"]').fill('123');
        await next.click();
        await expect(group.locator('[name="personal-number"]')).toBeFocused();
        await group.locator('[name="personal-number"]').fill('0000000000000');
        await group.locator('[name="email"]').fill('invalid');
        await next.click();
        await expect(group.locator('[name="email"]')).toBeFocused();
        await group.locator('[name="email"]').fill('fictional@example.invalid');
        await expect(group.locator('[name="email"]')).not.toHaveAttribute('aria-invalid');
      }
      if (study.id === 'health-allowance' && index === 3) await group.locator('[name="iban"]').clear();
      if (study.id === 'online-gruiu' && index === 2) {
        await group.locator('[name="email"]').fill('invalid');
        await group.locator('[name="privacy-read"]').uncheck();
        const attachment = group.locator('[name="attachment"]');
        await expect(attachment).not.toHaveAttribute('accept');
        await attachment.setInputFiles({ name: 'example.txt', mimeType: 'text/plain', buffer: Buffer.alloc(5_000_001) });
      }
      await next.click();
      await expect(root.locator('[aria-invalid]')).toHaveCount(0);
    }
    await expect(root.locator('[data-study-review]')).toBeFocused();
    if (study.id === 'online-gruiu') await expect(root.locator('[data-study-answers]')).toContainText('example.txt');
    await expect(root.locator('.sdr-summary')).toHaveCount(study.steps.length);
    await expectReflow(root);
    await expectAccessible(page, '[data-form-study]');
    await root.screenshot({ path: info.outputPath('study-review-mobile.png'), scale: 'css' });
    const edit = root.locator('[data-study-edit]').first();
    const editedField = await edit.getAttribute('data-study-edit');
    await edit.click();
    await expect(root.locator(`[name="${editedField}"]`).first()).toBeFocused();
    expect(primaryName).not.toBeNull();
    await expect(root.locator(`[name="${primaryName}"]`)).toHaveValue('Exemplu fictiv');
    for (const _step of study.steps) await next.click();
    await expect(root.locator('[data-study-review]')).toBeVisible();
    await root.locator('[data-study-finish]').click();
    await expect(root.locator('[data-study-done]')).toBeFocused();
    await expect(root.locator('[data-study-done]')).toContainText(study.id === 'online-payment' ? (locale === 'ro' ? 'nicio plată' : 'No payment') : (locale === 'ro' ? 'Nicio cerere' : 'No application'));
    await root.locator('[data-study-restart]').click();
    await expect(root.locator(`[name="${primaryName}"]`)).toHaveValue('');
    if (study.id === 'online-igi') expect(await root.locator('input[type="file"]').evaluate(input => (input as HTMLInputElement).files!.length)).toBe(0);
    expect(posts).toEqual([]);
    expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual(storageBefore);
  });
}
