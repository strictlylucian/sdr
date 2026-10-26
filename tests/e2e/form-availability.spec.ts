import { catalog, expect, openExample, test, type Edition, type Locale } from './support/fixtures';

for (const locale of ['ro', 'en'] as Locale[]) for (const edition of ['react', 'html'] as Edition[]) {
  test(`Availability ${edition} ${locale}: disabled and read-only controls retain native behaviour and form-data contracts`, async ({ page }) => {
    test.setTimeout(120000);
    for (const example of catalog.states.filter(item => item.state !== 'error')) {
      const root = await openExample(page, example.name, edition, locale);
      const controls = root.locator('input,select,textarea');
      if (example.state === 'readOnly' && !example.native) {
        await expect(controls).toHaveCount(0);
        await expect(root.locator('dl')).toBeVisible();
        continue;
      }
      expect(await controls.count(), example.name).toBeGreaterThan(0);
      for (const control of await controls.all()) {
        if (example.state === 'disabled') {
          await expect(control).toBeDisabled();
          await control.focus();
          await expect(control).not.toBeFocused();
        } else {
          await expect(control).toHaveAttribute('readonly');
          await expect(control).toBeEnabled();
          const value = await control.inputValue();
          await control.focus();
          // Firefox may skip its native read-only date/time widget entirely.
          // Text controls retain keyboard focus; temporal widgets retain native semantics.
          const temporal = await control.evaluate(node => ['date', 'time'].includes((node as HTMLInputElement).type));
          if (!temporal) {
            await expect(control).toBeFocused();
            await page.keyboard.type('x');
            await page.keyboard.press('ArrowRight');
          }
          await expect(control).toHaveValue(value);
        }
      }
      const formValues = await root.evaluate(node => {
        let form = node.querySelector('form');
        if (!form) {
          form = document.createElement('form');
          node.before(form);
          form.append(node);
        }
        const data = new FormData(form);
        return [...node.querySelectorAll<HTMLInputElement>('input,select,textarea')]
          .map(input => ({ name: input.name, value: input.value, included: data.getAll(input.name).includes(input.value) }));
      });
      for (const input of formValues) expect(input.included, `${example.name}: ${input.name}`).toBe(example.state === 'readOnly');
      if (example.state === 'disabled') for (const button of await root.locator('button').all()) await expect(button).toBeDisabled();
    }
  });

  test(`Error rail ${edition} ${locale}: starts at the first text row and ends at the control or choice group`, async ({ page }) => {
    test.setTimeout(120000);
    for (const example of catalog.states.filter(item => item.state === 'error')) {
      const root = await openExample(page, example.name, edition, locale);
      for (const width of [320, 1280]) for (const direction of ['ltr', 'rtl']) {
        await page.setViewportSize({ width, height: 900 });
        await root.evaluate((node, dir) => { node.setAttribute('dir', dir); }, direction);
        const alignment = await root.locator('.sdr-field--error').first().evaluate(rail => {
          const first = rail.querySelector('.sdr-label,.sdr-legend,.sdr-error,.sdr-choice')!;
          const choices = rail.querySelectorAll('.sdr-choice');
          const controls = rail.querySelectorAll('input,select,textarea');
          const composite = rail.querySelector('.sdr-input-group,.sdr-segmented');
          const last = composite ?? (choices.length ? choices[choices.length - 1] : controls[controls.length - 1]);
          const frame = rail.getBoundingClientRect();
          return { top: frame.top - first.getBoundingClientRect().top, bottom: frame.bottom - last.getBoundingClientRect().bottom };
        });
        expect(Math.abs(alignment.top), `${example.name}: rail top`).toBeLessThanOrEqual(1);
        expect(Math.abs(alignment.bottom), `${example.name}: rail bottom`).toBeLessThanOrEqual(1);
      }
    }
  });
}
