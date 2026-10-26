import { expect, openExample, test, type Edition } from "./support/fixtures";

for (const edition of ["react", "html"] as Edition[])
  for (const name of ["Dialog", "Drawer"]) {
    test(`${name} ${edition}: native focus, Escape, backdrop and drag protection`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      const root = await openExample(page, name, edition);
      const trigger = root.locator("[data-sdr-dialog-open]");
      const dialog = page.getByRole("dialog");
      await trigger.click();
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
      const box = await dialog.boundingBox();
      expect(box).not.toBeNull();
      if (name === "Dialog") {
        expect(Math.abs(box!.x + box!.width / 2 - 640)).toBeLessThan(2);
        expect(Math.abs(box!.y + box!.height / 2 - 450)).toBeLessThan(2);
      }
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await page.mouse.down();
      await page.mouse.move(1, 1);
      await page.mouse.up();
      await expect(dialog).toBeVisible();
      await page.mouse.click(1, 1);
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });
  }

for (const edition of ["react", "html"] as Edition[]) {
  test(`Tabs ${edition}: roving tabindex and arrow-key wrapping`, async ({
    page,
  }) => {
    const root = await openExample(page, "Tabs", edition);
    const tabs = root.getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowLeft");
    await expect(tabs.last()).toBeFocused();
    await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press("End");
    await expect(tabs.last()).toBeFocused();
    await expect(root.getByRole("tabpanel")).toHaveCount(1);
  });

  test(`Service navigation ${edition}: mobile and desktop focus transitions`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const root = await openExample(page, "ServiceNavigation", edition);
    const toggle = root.getByRole("button", { name: "Menu" });
    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await root.getByRole("link").first().focus();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(root.getByRole("link").first()).toBeFocused();
    await page.setViewportSize({ width: 320, height: 800 });
    await expect(toggle).toBeFocused();
  });
}
