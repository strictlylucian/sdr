import { test, expect, openExample, expectReflow, type Edition, type Locale } from './support/fixtures';

for (const edition of ['react', 'html'] as Edition[]) for (const locale of ['ro', 'en'] as Locale[]) {
  test(`Typography headings ${edition} ${locale}: shared scale, line height and utilities`, async ({ page }) => {
    const root = await openExample(page, 'Heading', edition, locale);
    for (const width of [320, 639, 640, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const small = width < 640;
      for (const [tag, size] of [['h2', small ? 27 : 36], ['h3', small ? 21 : 24], ['h4', 19]] as const) {
        const style = await root.locator(tag).evaluate(node => ({ size: parseFloat(getComputedStyle(node).fontSize), leading: parseFloat(getComputedStyle(node).lineHeight) }));
        expect(style.size).toBe(size);
        expect(style.leading).toBeCloseTo(size * 1.25, 1);
      }
      const gaps = await root.locator('.sdr-stack').evaluate(node => {
        const headings = [...node.querySelectorAll('h2,h3,h4')].map(node => node.getBoundingClientRect());
        return [headings[1].top - headings[0].bottom, headings[2].top - headings[1].bottom];
      });
      gaps.forEach((gap, index) => expect(gap).toBeCloseTo((small ? [24, 16] : [32, 24])[index], 1));
      await expectReflow(root);
    }
    await root.locator('.sdr-stack').evaluate(node => node.classList.add('sdr-u-gap-3'));
    const explicitGap = await root.locator('.sdr-stack').evaluate(node => {
      const [first, second] = [...node.querySelectorAll('h2,h3')].map(node => node.getBoundingClientRect());
      return second.top - first.bottom;
    });
    expect(explicitGap).toBeCloseTo(12, 1);
    const heading = root.locator('h2');
    await heading.evaluate(node => node.classList.add('sdr-u-text-3xl'));
    expect(await heading.evaluate(node => getComputedStyle(node).fontSize)).toBe('48px');
    await page.setViewportSize({ width: 320, height: 900 });
    expect(await heading.evaluate(node => getComputedStyle(node).fontSize)).toBe('32px');
    await expect(heading).toHaveRole('heading');
    expect(await heading.evaluate(node => node.tagName)).toBe('H2');
  });

  test(`Typography page title ${edition} ${locale}: responsive title, lead and enlarged text`, async ({ page }, info) => {
    const root = await openExample(page, 'PageHeader', edition, locale);
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await root.locator('h1').evaluate(node => getComputedStyle(node).fontSize)).toBe(width < 640 ? '32px' : '48px');
      expect(await root.locator('.sdr-lead').evaluate(node => getComputedStyle(node).fontSize)).toBe(width < 640 ? '21px' : '24px');
      const gap = await root.evaluate(node => node.querySelector('.sdr-lead')!.getBoundingClientRect().top - node.querySelector('h1')!.getBoundingClientRect().bottom);
      expect(gap).toBeCloseTo(width < 640 ? 32 : 48, 1);
      await expectReflow(root);
    }
    await root.screenshot({ path: info.outputPath('title-desktop.png'), scale: 'css' });
    await page.setViewportSize({ width: 320, height: 900 });
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    expect(await root.locator('h1').evaluate(node => getComputedStyle(node).fontSize)).toBe('64px');
    await expectReflow(root);
  });

  test(`Typography prose ${edition} ${locale}: contextual heading space has one owner`, async ({ page }) => {
    const root = await openExample(page, 'Prose', edition, locale);
    const prose = root.locator('.sdr-prose');
    await prose.evaluate(node => {
      const heading = node.querySelector('h2')!.cloneNode(true) as HTMLElement;
      heading.dataset.rhythmHeading = '';
      const paragraph = node.querySelector('p')!.cloneNode(true) as HTMLElement;
      paragraph.dataset.rhythmParagraph = '';
      node.append(heading, paragraph);
    });
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const rhythm = await prose.evaluate(node => {
        const heading = node.querySelector<HTMLElement>('[data-rhythm-heading]')!;
        return {
          firstTop: getComputedStyle(node.querySelector('h2')!).marginBlockStart,
          before: heading.getBoundingClientRect().top - heading.previousElementSibling!.getBoundingClientRect().bottom,
          after: node.querySelector('[data-rhythm-paragraph]')!.getBoundingClientRect().top - heading.getBoundingClientRect().bottom,
        };
      });
      expect(rhythm.firstTop).toBe('0px');
      expect(rhythm.before).toBeCloseTo(width < 640 ? 32 : 48, 1);
      expect(rhythm.after).toBeCloseTo(width < 640 ? 24 : 32, 1);
      await expectReflow(root);
    }
  });

  test(`Typography stack ${edition} ${locale}: section space does not double the layout gap`, async ({ page }) => {
    const root = await openExample(page, 'Prose', edition, locale);
    await root.evaluate(node => {
      const section = document.createElement('section'); section.className = 'sdr-stack'; section.dataset.headingStack = '';
      section.innerHTML = '<p>Previous section.</p><h2>New section</h2><p>Section content.</p>';
      node.append(section);
    });
    const stack = root.locator('[data-heading-stack]');
    const before = () => stack.evaluate(node => node.querySelector('h2')!.getBoundingClientRect().top - node.querySelector('p')!.getBoundingClientRect().bottom);
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await before()).toBeCloseTo(width < 640 ? 32 : 48, 1);
    }
    await stack.evaluate(node => node.classList.add('sdr-u-gap-3'));
    expect(await before()).toBeCloseTo(12, 1);
  });

  test(`Typography fields ${edition} ${locale}: readable text survives density and text resizing`, async ({ page }) => {
    const root = await openExample(page, 'Fieldset', edition, locale);
    for (const width of [320, 1280]) for (const density of ['comfortable', 'compact']) {
      await page.setViewportSize({ width, height: 900 });
      await root.evaluate((node, density) => node.setAttribute('data-sdr-density', density), density);
      for (const selector of ['legend', 'label', 'input']) expect(await root.locator(selector).first().evaluate(node => getComputedStyle(node).fontSize)).toBe('19px');
      await expectReflow(root);
    }
    await page.setViewportSize({ width: 320, height: 900 });
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    expect(await root.locator('input').first().evaluate(node => getComputedStyle(node).fontSize)).toBe('38px');
    await expectReflow(root);
  });
}

for (const locale of ['ro', 'en']) test(`Typography docs ${locale}: documentation follows the library scale`, async ({ page }, info) => {
  await page.goto(`/${locale}/foundations/typography/`);
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.locator('h1').first().evaluate(node => getComputedStyle(node).fontSize)).toBe(width < 640 ? '32px' : '48px');
    expect(await page.locator('.sl-markdown-content h3').first().evaluate(node => getComputedStyle(node).fontSize)).toBe(width < 640 ? '21px' : '24px');
    expect(await page.locator('.sl-markdown-content p').first().evaluate(node => getComputedStyle(node).fontSize)).toBe('19px');
    const rhythm = await page.locator('.sl-markdown-content > .level-h3').first().evaluate(node => ({ before: getComputedStyle(node).marginBlockStart, after: getComputedStyle(node).marginBlockEnd }));
    expect(rhythm).toEqual(width < 640 ? { before: '24px', after: '16px' } : { before: '32px', after: '24px' });
    await page.screenshot({ path: info.outputPath(`typography-docs-${width}.png`), scale: 'css' });
  }
});
