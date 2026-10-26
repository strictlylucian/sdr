import { expect, it, vi } from 'vitest';
import { init, destroy } from '../../packages/core/src/portable';
import { characterCount } from '../../packages/core/src/behaviors/forms';
import { tabs } from '../../packages/core/src/behaviors/tabs';
import { lifecycle, requireElement } from '../../packages/core/src/behaviors/lifecycle';

it('emits bubbling action details only for opted-in controls', () => {
  document.body.innerHTML = '<section data-sdr-component="actions"><button data-sdr-action="accept">Accept</button><button>Other</button></section>';
  const action = vi.fn(); document.body.addEventListener('sdr:action', action);
  const dispose = init();
  document.querySelector('button')!.click();
  expect(action).toHaveBeenCalledOnce();
  expect((action.mock.calls[0][0] as CustomEvent).detail).toEqual({ action: 'accept' });
  document.querySelectorAll('button')[1].click(); expect(action).toHaveBeenCalledOnce();
  dispose(); document.querySelector('button')!.click(); expect(action).toHaveBeenCalledOnce();
  document.body.removeEventListener('sdr:action', action);
});

it('destroys a mounted root and all nested enhancements', () => {
  document.body.innerHTML = '<div id="root"><button data-sdr-component="toggle" aria-pressed="false">Toggle</button></div>';
  const root = document.getElementById('root')!, button = root.querySelector('button')!;
  init(root); button.click(); expect(button).toHaveAttribute('aria-pressed', 'true');
  destroy(root); button.click(); expect(button).toHaveAttribute('aria-pressed', 'false');
});

it.each([0, -1, 1.5, NaN])('rejects invalid character limit %s', limit => {
  const root = document.createElement('div');
  root.innerHTML = '<textarea></textarea><p data-sdr-count></p>'; root.dataset.sdrLimit = String(limit);
  expect(() => characterCount(root)).toThrow('positive integer limit');
});

it('recounts after form reset using the reset default rather than the old value', async () => {
  document.body.innerHTML = '<form><div data-sdr-component="character-count" data-sdr-limit="3" lang="en"><textarea>a</textarea><p data-sdr-count></p></div></form>';
  init(document, { formatCount: remaining => remaining < 0 ? `${-remaining} character over` : `${remaining} characters remaining` }); const textarea = document.querySelector('textarea')!;
  textarea.value = 'abcd'; textarea.dispatchEvent(new Event('input'));
  expect(document.querySelector('p')).toHaveTextContent('1 character over');
  document.querySelector('form')!.reset(); await new Promise(resolve => setTimeout(resolve, 0));
  expect(document.querySelector('p')).toHaveTextContent('2 characters remaining');
});

it('requires application formatting instead of selecting language from the DOM', () => {
  const root = document.createElement('div');
  root.lang = 'fr'; root.dataset.sdrLimit = '3';
  root.innerHTML = '<textarea></textarea><p data-sdr-count></p>';
  expect(() => characterCount(root)).toThrow('application formatCount callback');
  const dispose = characterCount(root, { formatCount: remaining => `${remaining} disponibles` });
  expect(root.querySelector('p')).toHaveTextContent('3 disponibles');
  dispose();
});

it.each([
  '<div data-sdr-tablist></div>',
  '<div data-sdr-tablist><a data-sdr-tab href="#missing" id="tab">Tab</a></div>',
])('rejects incomplete tab contracts: %s', markup => {
  const root = document.createElement('div'); root.innerHTML = markup;
  expect(() => tabs(root)).toThrow('SDR Tabs');
});

it('restores original attributes once and removes lifecycle listeners', () => {
  const life = lifecycle(), button = document.createElement('button'), listener = vi.fn(), cleanup = vi.fn();
  button.title = 'original'; life.set(button, 'title', 'changed'); life.set(button, 'title', null);
  life.set(button, 'aria-pressed', 'true'); life.on(button, 'click', listener); life.add(cleanup);
  button.click(); expect(listener).toHaveBeenCalledOnce();
  life.destroy(); life.destroy(); button.click();
  expect(button).toHaveAttribute('title', 'original'); expect(button).not.toHaveAttribute('aria-pressed');
  expect(listener).toHaveBeenCalledOnce(); expect(cleanup).toHaveBeenCalledOnce();
  expect(() => requireElement(button, 'input')).toThrow('required element missing');
});
