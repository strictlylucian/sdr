import { lifecycle, requireElement, requireAttribute, refreshEvent } from './lifecycle';
export function accordion(root: HTMLElement) {
  const life = lifecycle();
  const button = requireElement<HTMLButtonElement>(root, '[data-sdr-accordion-toggle]');
  const sections = [...root.querySelectorAll<HTMLDetailsElement>('details')];
  if (!sections.length) throw new Error('SDR Accordion requires sections.');
  requireAttribute(root, 'data-sdr-expand-label');
  requireAttribute(root, 'data-sdr-collapse-label');
  const previous = button.textContent;
  life.add(() => { button.textContent = previous; });
  const update = () => {
    const expanded = sections.every(section => section.open);
    const label = requireAttribute(root, expanded ? 'data-sdr-collapse-label' : 'data-sdr-expand-label');
    if (button.textContent !== label) button.textContent = label;
    life.set(button, 'aria-expanded', String(expanded));
  };
  life.set(button, 'hidden', null);
  life.on(button, 'click', () => {
    const open = !sections.every(section => section.open);
    sections.forEach(section => life.set(section, 'open', open ? '' : null));
    update();
  });
  sections.forEach(section => life.on(section, 'toggle', update));
  life.on(root, refreshEvent, update);
  update(); return life.destroy;
}
