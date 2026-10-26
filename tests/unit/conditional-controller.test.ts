import { expect, it } from 'vitest';
import { conditionalChoice } from '../../packages/core/src/behaviors/conditional-choice';
import { init } from '../../packages/core/src/portable';

const markup = (id: string, type = 'radio', name = 'contact') => `<div data-sdr-component="conditional-choice"><label class="sdr-choice"><input id="${id}" class="sdr-choice__input" type="${type}" name="${name}" aria-controls="${id}-fields"></label><fieldset id="${id}-fields" data-sdr-conditional><input name="${id}-value" required value="answer"></fieldset></div>`;

it('initialises through portable entrypoint, ignores other form groups and restores original attributes on cleanup', () => {
  document.body.innerHTML = `<form>${markup('email')}${markup('phone')}</form><form>${markup('other')}</form>`;
  const dispose = init();
  const email = document.getElementById('email') as HTMLInputElement;
  const phone = document.getElementById('phone') as HTMLInputElement;
  const other = document.getElementById('other') as HTMLInputElement;
  const panel = document.getElementById('email-fields') as HTMLFieldSetElement;
  expect(panel.hidden).toBe(true); expect(panel.disabled).toBe(true);
  email.click(); expect(panel.hidden).toBe(false); expect(panel.disabled).toBe(false);
  other.click(); expect(panel.hidden).toBe(false);
  phone.click(); expect(panel.hidden).toBe(true);
  dispose(); expect(panel.hidden).toBe(false); expect(panel.disabled).toBe(false);
  email.click(); expect(panel.hidden).toBe(false);
});

it('refreshes programmatic changes and keeps explicitly disabled child fields disabled', () => {
  document.body.innerHTML = markup('email', 'checkbox');
  const root = document.querySelector<HTMLElement>('[data-sdr-component]')!;
  const input = document.getElementById('email') as HTMLInputElement;
  const panel = document.getElementById('email-fields') as HTMLFieldSetElement;
  panel.firstElementChild!.setAttribute('disabled', '');
  const dispose = conditionalChoice(root);
  input.checked = true; root.dispatchEvent(new Event('sdr:refresh'));
  expect(panel.hidden).toBe(false); expect(panel.disabled).toBe(false);
  input.disabled = true; input.dispatchEvent(new Event('change', { bubbles: true }));
  expect(panel.disabled).toBe(true);
  dispose(); expect(panel.firstElementChild).toHaveAttribute('disabled');
});

it('does not resurrect a destroyed controller in a queued reset callback', async () => {
  document.body.innerHTML = `<form>${markup('email')}</form>`;
  const dispose = init(); document.querySelector('form')!.reset(); dispose();
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(document.querySelector('fieldset')).not.toHaveAttribute('hidden');
});

it('supports independent unnamed radios, ignores non-choice changes and cancelled reset', async () => {
  document.body.innerHTML = `<form>${markup('email', 'radio', '')}${markup('phone', 'radio', '')}</form>`;
  const dispose = init(); document.getElementById('email')!.click(); document.getElementById('phone')!.click();
  expect(document.querySelectorAll('fieldset[hidden]')).toHaveLength(0);
  document.querySelector('fieldset input')!.dispatchEvent(new Event('change', { bubbles: true }));
  document.querySelector('form')!.addEventListener('reset', event => event.preventDefault(), { once: true });
  document.querySelector('form')!.reset(); await new Promise(resolve => setTimeout(resolve, 0));
  expect(document.querySelectorAll('fieldset[hidden]')).toHaveLength(0); dispose();
});

it.each([
  '<div></div>',
  markup('email').replace('type="radio"', 'type="text"'),
  markup('email').replaceAll('fieldset', 'section'),
  markup('email').replace('aria-controls="email-fields"', ''),
  markup('email').replace('id="email-fields"', ''),
])('rejects malformed conditional markup: %s', html => {
  const root = document.createElement('section'); root.innerHTML = html;
  expect(() => conditionalChoice(root.firstElementChild as HTMLElement)).toThrow('SDR');
});
