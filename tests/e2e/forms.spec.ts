import {
  expect,
  openExample,
  test,
  type Edition,
  type Locale,
} from "./support/fixtures";

for (const edition of ["react", "html"] as Edition[])
  for (const locale of ["ro", "en"] as Locale[]) {
    test(`Payment ${edition} ${locale}: validates test data and confirms without a network submission`, async ({
      page,
    }) => {
      const posts: string[] = [];
      page.on("request", (request) => {
        if (request.method() === "POST") posts.push(request.url());
      });
      const root = await openExample(
        page,
        "PaymentCard",
        edition,
        locale,
        true,
      );
      const result = root.locator("[data-sdr-pattern-result]");
      await root.locator('[name="card-number"]').fill("1234");
      await root.locator('button[type="submit"]').click();
      await expect(result).not.toBeVisible();
      await root.locator('[name="card-number"]').fill("4242 4242 4242 4242");
      await root.locator('button[type="submit"]').click();
      await expect(result).toBeVisible();
      await expect(result).toBeFocused();
      expect(posts).toEqual([]);
    });

    test(`Phone ${edition} ${locale}: requires an answer and supports international numbers`, async ({
      page,
    }) => {
      const root = await openExample(
        page,
        "PhoneNumber",
        edition,
        locale,
        true,
      );
      const result = root.locator("[data-sdr-pattern-result]");
      await root.locator('button[type="submit"]').click();
      await expect(result).not.toBeVisible();
      await root.locator('input[type="tel"]').fill("+40 712 345 678");
      await root.locator('button[type="submit"]').click();
      await expect(result).toBeVisible();
      await expect(result).toBeFocused();
    });

    test(`Password ${edition} ${locale}: keyboard reveal, pressed state and value preservation`, async ({
      page,
    }) => {
      const root = await openExample(page, "PasswordInput", edition, locale);
      const input = root.locator("input"),
        toggle = root.locator("[data-sdr-password-toggle]");
      await input.fill("Ș-secret-123");
      await input.focus();
      await page.keyboard.press("Tab");
      await expect(toggle).toBeFocused();
      await page.keyboard.press("Space");
      await expect(input).toHaveAttribute("type", "text");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      await expect(input).toHaveValue("Ș-secret-123");
      await page.keyboard.press("Enter");
      await expect(input).toHaveAttribute("type", "password");
    });
  }

for (const edition of ['react', 'html'] as Edition[])
  for (const locale of ['ro', 'en'] as Locale[]) {
    test(`CharacterCount ${edition} ${locale}: documentation supplies the formatter and preserves over-limit Unicode`, async ({ page }) => {
      const root = await openExample(page, 'CharacterCount', edition, locale);
      const textarea = root.locator('textarea');
      const output = root.locator('[data-sdr-count]');
      await expect(output).toHaveAttribute('aria-live', 'polite');
      await textarea.fill('ș🙂' + 'a'.repeat(179));
      await expect(output).toHaveText(locale === 'ro' ? '19 caractere rămase' : '19 characters remaining');
      const answer = 'ș🙂' + 'a'.repeat(199);
      await textarea.fill(answer);
      await expect(textarea).toHaveValue(answer);
      await expect(output).toHaveText(locale === 'ro' ? 'Ai depășit limita cu 1 caracter' : 'You are 1 character over the limit');
      await expect(output).toHaveClass('sdr-error');
    });
  }
