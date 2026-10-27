import { expect, test } from './support/fixtures';
import { studyGroups } from '../../apps/docs/src/studies/forms';
import en from '../../apps/docs/src/i18n/en/studies.json' with { type: 'json' };
import ro from '../../apps/docs/src/i18n/ro/studies.json' with { type: 'json' };
const messages = { en, ro };

for (const locale of ['ro', 'en'] as const) {
  test(`${locale}: study sections match the sidebar and every article selects its own link`, async ({ page }) => {
    test.setTimeout(90000);
    const visit = async (url: string) => {
      await page.goto(url);
      await expect(page.locator('#starlight__search .pagefind-ui__search-input')).toHaveCount(1);
    };
    await visit(`/${locale}/reality/`);
    const sidebar = page.locator('#starlight__sidebar');
    await expect(page.locator('h1')).toHaveText(messages[locale].section);
    await expect(sidebar.locator('summary').filter({ hasText: messages[locale].section })).toHaveCount(1);
    const links = sidebar.locator(`a[href^="/${locale}/reality/"]`);
    await expect(links).toHaveCount(10);
    for (const group of studyGroups) {
      await visit(`/${locale}/reality/`);
      const label = messages[locale][group.key];
      await expect(page.getByRole('heading', { name: label, exact: true })).toBeVisible();
      const details = sidebar.locator('details').filter({ has: page.locator('summary').filter({ hasText: label }) }).last();
      await expect(details.locator('a')).toHaveCount(group.studies.length);
      for (const study of group.studies) {
        await visit(`/${locale}/reality/${study.id}/`);
        const active = sidebar.locator('a[aria-current="page"]');
        await expect(active).toHaveAttribute('href', `/${locale}/reality/${study.id}/`);
        await expect(active).toHaveText(messages[locale][study.title]);
        await expect(active).toBeVisible();
        const preview = page.locator('[data-form-study]');
        await expect(preview).toHaveAttribute('data-study-ready', 'true');
        const examples = preview.locator('[data-study-page]');
        await expect(examples).toHaveCount(study.steps.length + 1);
        for (let index = 0; index <= study.steps.length; index++) {
          await expect(examples.nth(index)).toBeVisible();
          await expect(examples.nth(index).locator('[data-study-stepper] li').nth(index)).toHaveAttribute('aria-current', 'step');
        }
        await expect(page.getByRole('heading', { name: locale === 'en' ? 'Why a complete overhaul is needed' : 'De ce este necesară o refacere completă', exact: true })).toBeVisible();
      }
    }
  });
}
