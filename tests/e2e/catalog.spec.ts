import {
  catalog,
  expectAccessible,
  expectReflow,
  openExample,
  test,
  type Edition,
  type Locale,
} from "./support/fixtures";

for (const [group, examples] of Object.entries(catalog)) {
  for (const example of examples)
    for (const locale of ["ro", "en"] as Locale[])
      for (const edition of ["react", "html"] as Edition[]) {
        if (example.name === "Page") continue; // Full React and HTML page journeys have dedicated specs.
        test(`${group}: ${example.name} / ${locale} / ${edition} accessibility and reflow`, async ({
          page,
        }) => {
          const root = await openExample(
            page,
            example.name,
            edition,
            locale,
            group === "patterns",
          );
          await expectAccessible(
            page,
            edition === "html"
              ? "main > .sdr"
              : `[data-sdr-example="${example.name}"] .sdr-demo__canvas`,
          );
          for (const width of [320, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            await expectReflow(root);
          }
          await page.setViewportSize({ width: 320, height: 900 });
          await page.evaluate(() => {
            document.documentElement.style.fontSize = "200%";
          });
          await expectReflow(root);
        });
      }
}
