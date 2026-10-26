import {
  test as base,
  expect,
  type Locator,
  type Page,
} from "@playwright/test";
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";

export type Locale = "ro" | "en";
export type Edition = "react" | "html";
export type Example = {
  name: string;
  slug: string;
  docsPath: Record<Locale, string>;
  state?: string;
  native?: boolean;
};
const manifest = JSON.parse(
  readFileSync("apps/docs/public/qa-manifest.json", "utf8"),
) as { components: Example[]; patternExamples: Example[]; states: Example[] };
export const catalog = {
  components: manifest.components,
  patterns: manifest.patternExamples,
  states: manifest.states,
};
export const test = base.extend<{ runtime: void }>({
  runtime: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await use();
      expect(errors, "uncaught browser errors").toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };

export async function openExample(
  page: Page,
  name: string,
  edition: Edition,
  locale: Locale = "en",
  pattern = false,
): Promise<Locator> {
  const example = (pattern ? catalog.patterns : [...catalog.components, ...catalog.states]).find(
    (item) => item.name === name,
  );
  if (!example) throw new Error(`Missing test example ${name}`);
  await page.goto(
    edition === "html"
      ? `/examples/${locale}/${example.slug}.html`
      : example.docsPath[locale],
  );
  const selector =
    edition === "html"
      ? "main > .sdr"
      : `[data-sdr-example="${name}"] .sdr-demo__canvas`;
  const root = page.locator(selector).first();
  await expect(root).toBeVisible();
  if (edition === "react")
    await page.waitForFunction(
      () => !document.querySelector("astro-island[ssr]"),
    );
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return root;
}

export async function expectAccessible(page: Page, selector: string) {
  const results = await new AxeBuilder({ page })
    .include(selector)
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
}

export async function expectReflow(root: Locator) {
  const overflow = await root.evaluate((node) => {
    const bounds = node.getBoundingClientRect();
    return [...node.querySelectorAll<HTMLElement>("*")]
      .filter((child) => {
        if (
          !child.getClientRects().length ||
          child.closest(
            "[hidden],.sdr-visually-hidden,.sdr-table-wrapper,pre,dialog:not([open])",
          )
        )
          return false;
        const box = child.getBoundingClientRect();
        return (
          box.width > 0 &&
          getComputedStyle(child).visibility !== "hidden" &&
          (box.left < bounds.left - 1 || box.right > bounds.right + 1)
        );
      })
      .map((child) => ({ tag: child.tagName, class: child.className }));
  });
  expect(overflow, "content outside its available width").toEqual([]);
}
