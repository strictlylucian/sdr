import {
  expect,
  expectAccessible,
  test,
  type Edition,
  type Locale,
} from "./support/fixtures";
import { openReactPage } from "./support/page-fixture";

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
