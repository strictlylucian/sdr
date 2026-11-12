import { expect, type Locator } from '@playwright/test';

/** Chrome reaches the Page edge; only its inner content receives page gutters. */
export async function expectPageLayout(root: Locator) {
  const geometry = await root.evaluate(node => {
    const box = (selector: string) => {
      const element = node.querySelector(selector)!;
      const rect = element.getBoundingClientRect();
      return { x: rect.x, right: rect.right };
    };
    const rect = node.getBoundingClientRect();
    return {
      root: { x: rect.x, right: rect.right },
      header: box('.sdr-header'), navigation: box('.sdr-navigation'),
      headerContent: box('.sdr-header__inner'), navigationContent: box('.sdr-navigation > .sdr-width-container'),
      content: box(':scope > .sdr-container'),
      padding: getComputedStyle(node).padding,
    };
  });
  expect(geometry.padding).toBe('0px');
  for (const edge of ['x', 'right'] as const) {
    expect(geometry.header[edge]).toBeCloseTo(geometry.root[edge], 1);
    expect(geometry.navigation[edge]).toBeCloseTo(geometry.root[edge], 1);
    expect(geometry.headerContent[edge]).toBeCloseTo(geometry.content[edge], 1);
    expect(geometry.navigationContent[edge]).toBeCloseTo(geometry.content[edge], 1);
  }
  expect(geometry.content.x).toBeGreaterThan(geometry.root.x);
  expect(geometry.content.right).toBeLessThan(geometry.root.right);
}
