import { motifDimensions, motifGrid } from '../../tooling/build/motif-grid.mjs';
import { expect, expectAccessible, expectReflow, openExample, test, type Edition, type Locale } from './support/fixtures';

for (const locale of ['ro', 'en'] as Locale[]) for (const edition of ['react', 'html'] as Edition[]) {
  test(`Motif ${edition} ${locale}: SVG stitches tile and retain all sizes in every palette`, async ({ page }, info) => {
    const imageRequests: string[] = [];
    page.on('request', request => { if (request.resourceType() === 'image' && !request.url().endsWith('/favicon.svg') && !request.url().startsWith('data:')) imageRequests.push(request.url()); });
    const root = await openExample(page, 'Motif', edition, locale);
    const motifs = root.locator('.sdr-motif');
    await expect(motifs).toHaveCount(4);
    for (const theme of ['light', 'dark', 'heritage', 'contrast']) {
      await root.evaluate((node, theme) => { (node as HTMLElement).dataset.sdrTheme = theme; }, theme);
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await expectReflow(root);
        for (const [index, height] of [24, 48, 64, 96].entries()) {
          const motif = motifs.nth(index);
          await expect(motif).toHaveAttribute('aria-hidden', 'true');
          await expect(motif).toHaveCSS('height', `${height}px`);
          const paint = await motif.evaluate(node => ['::before', '::after'].map(pseudo => {
            const css = getComputedStyle(node, pseudo);
            return { image: css.maskImage, size: css.maskSize.split(' ').map(parseFloat), repeat: css.maskRepeat, colour: css.backgroundColor };
          }));
          for (const layer of paint) {
            expect(decodeURIComponent(layer.image)).toContain('data:image/svg+xml,<svg');
            expect(decodeURIComponent(layer.image)).not.toMatch(/<image|<script|href=/);
            expect(layer.size[0]).toBeCloseTo(height * motifDimensions.width / motifDimensions.height, 2);
            expect(layer.repeat).toBe('repeat-x');
          }
          expect(paint.map(layer => layer.colour)).toEqual(['rgb(206, 17, 38)', theme === 'dark' ? 'rgb(237, 241, 247)' : 'rgb(0, 43, 127)']);
          await expect(motif).toHaveCSS('background-color', theme === 'dark' ? 'rgb(8, 12, 18)' : 'rgb(255, 255, 255)');
        }
      }
    }
    // An explicit light boundary inside dark must reset the palette, and vice versa.
    const first = motifs.first();
    await root.evaluate(node => node.setAttribute('data-sdr-theme', 'dark'));
    await first.evaluate(node => { node.classList.add('sdr'); node.setAttribute('data-sdr-theme', 'light'); });
    await expect(first).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    expect(await first.evaluate(node => getComputedStyle(node, '::after').backgroundColor)).toBe('rgb(0, 43, 127)');
    await root.evaluate(node => node.setAttribute('data-sdr-theme', 'light'));
    await first.evaluate(node => node.setAttribute('data-sdr-theme', 'dark'));
    await expect(first).toHaveCSS('background-color', 'rgb(8, 12, 18)');
    expect(await first.evaluate(node => getComputedStyle(node, '::after').backgroundColor)).toBe('rgb(237, 241, 247)');
    await first.evaluate(node => { node.classList.remove('sdr'); node.removeAttribute('data-sdr-theme'); });
    await expectAccessible(page, edition === 'html' ? 'main > .sdr' : '[data-sdr-example="Motif"] .sdr-demo__canvas');
    if (info.project.name === 'chromium' && locale === 'en' && edition === 'html') {
      for (const theme of ['light', 'dark']) {
        await root.evaluate((node, theme) => node.setAttribute('data-sdr-theme', theme), theme);
        await root.screenshot({ path: `output/playwright/motif-${theme}-sizes.png`, scale: 'css' });
      }
      await root.evaluate(node => node.setAttribute('data-sdr-theme', 'light'));
      await motifs.last().screenshot({ path: 'output/playwright/css-motif-xl.png' });
      await root.screenshot({ path: 'output/playwright/css-motif-sizes.png' });
    }
    await page.emulateMedia({ forcedColors: 'active' });
    for (const motif of await motifs.all()) await expect(motif).toBeHidden();
    expect(imageRequests).toEqual([]);
  });
}

for (const edition of ['react', 'html'] as Edition[]) {
  test(`Motif ${edition}: native vector pixels and complete seams match the reference geometry`, async ({ page }, info) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    const root = await openExample(page, 'Motif', edition, 'en');
    await root.evaluate(node => node.setAttribute('data-sdr-theme', 'light'));
    const motif = root.locator('.sdr-motif').first();
    await motif.evaluate(node => {
      const style = (node as HTMLElement).style;
      style.setProperty('--sdr-motif-size', '225px');
      style.width = '582px';
      // Isolate native SVG units from fractional prose positions and compositor transforms.
      style.position = 'fixed'; style.top = '160px'; style.left = '320px';
      style.zIndex = '2147483647';
    });
    const bytes = await motif.screenshot({ scale: 'css', path: `output/playwright/motif-native-${edition}-${info.project.name}.png` });
    const actual = await page.evaluate(async source => {
      const image = new Image();
      image.src = source;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width; canvas.height = image.height;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const rows: string[] = [];
      for (let y = 0; y < canvas.height; y++) {
        let row = '';
        for (let x = 0; x < canvas.width; x++) {
          const offset = (y * canvas.width + x) * 4;
          const rgb = Array.from(pixels.slice(offset, offset + 3)).join(',');
          row += rgb === '206,17,38' ? 'R' : rgb === '0,43,127' ? 'B' : rgb === '255,255,255' ? '.' : '?';
        }
        rows.push(row);
      }
      return rows;
    }, `data:image/png;base64,${bytes.toString('base64')}`);
    expect(actual).toEqual(motifGrid().map(row => row.repeat(3)));
    if (info.project.name === 'chromium' && edition === 'html') {
      await motif.screenshot({ scale: 'css', path: 'output/playwright/motif-reference-match.png' });
    }
  });
}
