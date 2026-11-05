import AxeBuilder from '@axe-core/playwright';
import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';

export const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export async function scan(page: Page, selector: string, state: string, info: TestInfo) {
  const result = await new AxeBuilder({ page }).include(selector).withTags(wcagTags).analyze();
  await info.attach(state, {
    contentType: 'application/json',
    body: Buffer.from(JSON.stringify({
      state, engine: result.testEngine, violations: result.violations,
      incomplete: result.incomplete.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, any, all, none }) => ({ target, checks: [...any, ...all, ...none].map(check => check.message) })) })),
      passedRules: result.passes.map(rule => rule.id),
    })),
  });
  expect(result.violations, `${state}: WCAG A/AA violations`).toEqual([]);
  expect(result.incomplete.filter(rule => rule.id === 'aria-prohibited-attr'), `${state}: unsupported naming or ARIA attributes`).toEqual([]);
}

/** Exercise the rendered expanded state, rather than scanning hidden descendants. */
export async function expand(root: Locator, name: string, page: Page) {
  for (const summary of await root.locator('details > summary').all()) {
    if (!await summary.evaluate(node => node.parentElement!.hasAttribute('open'))) await summary.click();
  }
  if (name === 'Dialog' || name === 'Drawer') {
    await root.locator('[data-sdr-dialog-open]').click();
    await expect(root.getByRole('dialog')).toBeVisible();
  }
  if (name === 'Tooltip') {
    await root.locator('[data-sdr-tooltip-trigger]').focus();
    await expect(root.getByRole('tooltip')).toBeVisible();
  }
  if (name === 'Toast') await root.locator('[data-sdr-toast-show]').click();
  if (name === 'ServiceNavigation') {
    const toggle = root.locator('[data-sdr-navigation-toggle]');
    if (await toggle.isVisible()) await toggle.click();
  }
  // Leave dialog/tooltip state stable while axe inspects it.
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

export async function expectVisibleFocus(root: Locator, page: Page) {
  const controls = root.locator('a[href],button,input:not([type="hidden"]),select,textarea,summary,[tabindex="0"]');
  for (const control of await controls.all()) {
    if (!await control.isVisible() || !await control.isEnabled()) continue;
    if (await control.evaluate(node => {
      const modal = document.querySelector('dialog:modal');
      return node.closest('[inert]') !== null || (node as HTMLElement).tabIndex < 0 || (modal !== null && !modal.contains(node));
    })) continue;
    await control.focus();
    await page.keyboard.press('Shift');
    const result = await control.evaluate(node => {
      const style = getComputedStyle(node);
      return { outline: parseFloat(style.outlineWidth), shadow: style.boxShadow, focused: node === document.activeElement };
    });
    expect(result.focused, await control.evaluate(node => node.outerHTML)).toBe(true);
    expect(result.outline > 0 || result.shadow !== 'none', 'visible keyboard focus indicator').toBe(true);
  }
}

export async function applyTextSpacing(page: Page) {
  await page.addStyleTag({ content: '.sdr * { line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important } .sdr p { margin-block-end:2em!important }' });
}

export async function expectReducedMotion(root: Locator) {
  const animated = await root.evaluate(node => [...node.querySelectorAll('*')].flatMap(element =>
    [null, '::before', '::after'].flatMap(pseudo => {
      const style = getComputedStyle(element, pseudo);
      return style.animationName === 'none' ? [] : [{ element: element.className, pseudo, animation: style.animationName }];
    }),
  ));
  expect(animated, 'CSS animations under reduced motion').toEqual([]);
}
