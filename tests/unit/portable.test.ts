import { afterEach, expect, it } from 'vitest';
import { init, destroy } from '../../packages/core/src/portable';
afterEach(() => { destroy(document); document.body.innerHTML = ''; });
it('initialises once, disposes only owned components, and can reinitialise', () => {
  document.body.innerHTML = '<div id="parent" data-sdr-component="toggle" aria-pressed="false"><button id="child" data-sdr-component="toggle" aria-pressed="false">Toggle</button></div>';
  const child = document.getElementById('child')!;
  const parent = document.getElementById('parent')!;
  const first = init(child); const second = init(parent);
  second(); child.click(); expect(child.getAttribute('aria-pressed')).toBe('true');
  first(); expect(child.getAttribute('aria-pressed')).toBe('false');
  init(child); init(child); child.click(); expect(child.getAttribute('aria-pressed')).toBe('true');
});
it('skips React-owned roots', () => {
  document.body.innerHTML = '<button data-sdr-component="toggle" data-sdr-owner="react" aria-pressed="false">Toggle</button>';
  init(); document.querySelector('button')!.click(); expect(document.querySelector('button')!.getAttribute('aria-pressed')).toBe('false');
});
it('fails on unknown contracts and rolls back earlier mounts', () => {
  document.body.innerHTML = '<button data-sdr-component="toggle" aria-pressed="false">Toggle</button><div data-sdr-component="unknown"></div>';
  expect(() => init()).toThrow('Unknown SDR behavior');
  document.querySelector('button')!.click(); expect(document.querySelector('button')!.getAttribute('aria-pressed')).toBe('false');
});
it('enhances password reveal and restores initial markup on disposal', () => {
  document.body.innerHTML = '<div lang="en" data-sdr-component="password" data-sdr-show-label="Show password" data-sdr-hide-label="Hide password"><input type="password"><button hidden data-sdr-password-toggle>Show password</button></div>';
  const cleanup = init(); const button = document.querySelector('button')!; const input = document.querySelector('input')!;
  expect(button.hidden).toBe(false); button.click(); expect(input.type).toBe('text'); expect(button.textContent).toBe('Hide password');
  cleanup(); expect(input.type).toBe('password'); expect(button.hidden).toBe(true);
});
it('counts code points, allows over-limit text and reports it in Romanian', () => {
  document.body.innerHTML = '<div lang="ro" data-sdr-component="character-count" data-sdr-limit="2"><textarea></textarea><p data-sdr-count></p></div>';
  init(document, { formatCount: remaining => `${Math.abs(remaining)} caracter${Math.abs(remaining) === 1 ? '' : 'e'}` }); const input = document.querySelector('textarea')!; input.value = 'ș🙂a'; input.dispatchEvent(new Event('input'));
  expect(document.querySelector('[data-sdr-count]')!.textContent).toContain('1 caracter'); expect(input.value).toBe('ș🙂a');
});

it.each([
  ['<div data-sdr-component="password"><input type="password"><button hidden data-sdr-password-toggle>Reveal</button></div>', 'data-sdr-show-label'],
  ['<div data-sdr-component="password" data-sdr-show-label="Show"><input type="password"><button hidden data-sdr-password-toggle>Reveal</button></div>', 'data-sdr-hide-label'],
  ['<section data-sdr-component="accordion"><button hidden data-sdr-accordion-toggle>Expand</button><details><summary>Help</summary>Content</details></section>', 'data-sdr-expand-label'],
  ['<section data-sdr-component="accordion" data-sdr-expand-label="Expand"><button hidden data-sdr-accordion-toggle>Expand</button><details><summary>Help</summary>Content</details></section>', 'data-sdr-collapse-label'],
])('rejects missing host labels before enhancing controls: %s', (markup, attribute) => {
  document.body.innerHTML = markup;
  expect(() => init()).toThrow(attribute);
  expect(document.querySelector('button')).toHaveAttribute('hidden');
});
