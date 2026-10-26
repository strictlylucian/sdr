import {
  expect,
  expectAccessible,
  openExample,
  test,
  type Locale,
} from "./support/fixtures";

for (const locale of ["ro", "en"] as Locale[]) {
  test(`Documentation ${locale}: source tabs, nested variant selection and initial setup links`, async ({
    page,
  }) => {
    await openExample(page, "ToggleButton", "react", locale);
    const variant = page.locator('[aria-current="location"]');
    await expect(variant).toHaveCount(1);
    await expect(variant).toHaveAttribute("href", /variant-toggle-button/);
    const tabs = page.locator(".sdr-example-code").first().getByRole("tab");
    await expect(tabs.nth(0)).toHaveText("React");
    await expect(tabs.nth(1)).toHaveText("HTML");
    await tabs.nth(1).click();
    await expect(
      page.locator(".sdr-example-code").first().getByRole("tabpanel"),
    ).toContainText("data-sdr");
    await expect(
      page
        .locator(".sdr-example-code")
        .first()
        .getByRole("link", {
          name: locale === "ro" ? "Configurare inițială" : "Initial setup",
        }),
    ).toHaveAttribute("href", `/${locale}/getting-started/`);
    await page.goto(`http://127.0.0.1:4322/${locale}/getting-started/`);
    await expect(page.locator('main code').filter({ hasText: 'npx playwright install --with-deps' }))
      .toHaveText('npx playwright install --with-deps chromium firefox webkit');
    await expect(page.locator('main code').filter({ hasText: "font-src 'self'" }))
      .toHaveText("font-src 'self' data:");
  });

  for (const theme of ["light", "dark", "heritage", "contrast"]) {
    test(`Button ${locale}: ${theme} palette, density and flag-yellow keyboard focus`, async ({
      page,
    }) => {
      const root = await openExample(page, "Button", "react", locale);
      const demo = page.locator('[data-sdr-example="Button"]');
      await demo
        .getByRole("combobox", { name: locale === "ro" ? "Temă" : "Theme", exact: true })
        .selectOption(theme);
      await demo
        .getByRole("combobox", { name: locale === "ro" ? "Densitate" : "Density", exact: true })
        .selectOption("compact");
      await expect(root).toHaveAttribute("data-sdr-theme", theme);
      await expect(root).toHaveAttribute("data-sdr-density", "compact");
      const button = root.getByRole("button").first();
      await button.focus();
      await page.keyboard.press("Shift");
      await expect(button).toHaveCSS("background-color", "rgb(252, 209, 22)");
      await expectAccessible(
        page,
        '[data-sdr-example="Button"] .sdr-demo__canvas',
      );
    });
  }
}

test("portable HTML remains readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4322/examples/en/accordion.html");
  const summary = page.locator("summary").first();
  await summary.click();
  await expect(summary.locator("..")).toHaveAttribute("open", "");
  await expect(page.locator("[data-sdr-accordion-toggle]")).toBeHidden();
  await context.close();
});
