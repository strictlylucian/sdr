import type { EnhancementOptions } from './options';
import { lifecycle, requireElement, requireAttribute, refreshEvent } from './lifecycle';

export function password(root: HTMLElement) {
  const life = lifecycle();
  const input = requireElement<HTMLInputElement>(root, 'input');
  const button = requireElement<HTMLButtonElement>(root, '[data-sdr-password-toggle]');
  requireAttribute(root, 'data-sdr-show-label');
  requireAttribute(root, 'data-sdr-hide-label');
  let visible = input.type === 'text';
  life.set(button, 'hidden', null);
  const previous = button.textContent;
  life.add(() => { button.textContent = previous; });
  const update = () => {
    const type = visible ? 'text' : 'password';
    const label = requireAttribute(root, visible ? 'data-sdr-hide-label' : 'data-sdr-show-label');
    if (input.type !== type) life.set(input, 'type', type);
    if (button.textContent !== label) button.textContent = label;
    if (button.getAttribute('aria-pressed') !== String(visible)) life.set(button, 'aria-pressed', String(visible));
  };
  life.on(root, refreshEvent, update);
  life.on(button, 'click', () => {
    visible = !visible;
    update();
  });
  return life.destroy;
}

export function characterCount(root: HTMLElement, { formatCount }: EnhancementOptions = {}) {
  const life = lifecycle();
  const input = requireElement<HTMLTextAreaElement>(root, 'textarea');
  const output = requireElement<HTMLElement>(root, '[data-sdr-count]');
  const limit = Number(root.dataset.sdrLimit);
  if (!Number.isInteger(limit) || limit <= 0) throw new Error('SDR CharacterCount requires a positive integer limit.');
  if (typeof formatCount !== 'function') throw new Error('SDR CharacterCount requires an application formatCount callback.');
  const previous = output.textContent;
  life.add(() => { output.textContent = previous; });
  const update = () => {
    const remaining = limit - [...input.value].length;
    const message = formatCount(remaining, root);
    const className = remaining >= 0 ? 'sdr-character-count' : 'sdr-error';
    if (output.textContent !== message) output.textContent = message;
    if (output.className !== className) life.set(output, 'class', className);
  };
  life.on(input, 'input', update);
  life.on(root, refreshEvent, update);
  life.on(input.form ?? input, 'reset', () => { life.defer(update); });
  update();
  return life.destroy;
}

export function toggle(root: HTMLElement) {
  const life = lifecycle();
  life.on(root, 'click', () => life.set(root, 'aria-pressed', String(root.getAttribute('aria-pressed') !== 'true')));
  return life.destroy;
}
