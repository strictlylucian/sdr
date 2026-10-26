import { lifecycle, refreshEvent, requireElement } from './lifecycle';

const stateEvent = 'sdr:conditional-state';

/** Keep a choice's related fields mounted, but exclude inactive fields from forms. */
export function conditionalChoice(root: HTMLElement) {
  const input = requireElement<HTMLInputElement>(root, ':scope > .sdr-choice .sdr-choice__input');
  const panel = requireElement<HTMLFieldSetElement>(root, ':scope > [data-sdr-conditional]');
  if (!['radio', 'checkbox'].includes(input.type) || panel.tagName !== 'FIELDSET' || !panel.id ||
    !input.getAttribute('aria-controls')?.split(/\s+/).includes(panel.id)) {
    throw new Error('SDR conditional choice requires a radio or checkbox controlling its related fieldset.');
  }
  const life = lifecycle();
  const tree = input.getRootNode();
  const related = (source: unknown) => source === input || (source instanceof HTMLInputElement &&
    input.type === 'radio' && source.type === 'radio' && !!input.name &&
    source.name === input.name && source.form === input.form && source.getRootNode() === tree);
  const sync = () => {
    life.set(panel, 'hidden', input.checked ? null : '');
    // Ancestor fieldsets already cascade disabled; copying that state would latch nested reveals shut.
    life.set(panel, 'disabled', input.checked && !input.disabled ? null : '');
  };
  const announce = () => tree.dispatchEvent(new CustomEvent(stateEvent, { detail: input }));
  life.on(tree, 'change', event => { if (related(event.target)) sync(); });
  life.on(tree, stateEvent, event => { if (related((event as CustomEvent).detail)) sync(); });
  life.on(root, refreshEvent, announce);
  life.on(tree, 'reset', event => {
    if (event.target === input.form) life.defer(announce);
  });
  sync();
  announce();
  return life.destroy;
}
