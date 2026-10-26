import { lifecycle, requireElement } from './lifecycle';

export function tabs(root: HTMLElement) {
  const life = lifecycle();
  const list = requireElement<HTMLElement>(root, '[data-sdr-tablist]');
  const triggers = [...list.querySelectorAll<HTMLAnchorElement>('[data-sdr-tab]')];
  const panels = triggers.map(tab => {
    const id = tab.getAttribute('href')?.slice(1);
    const panel = [...root.querySelectorAll<HTMLElement>('[data-sdr-panel]')].find(item => item.id === id);
    if (!id || !panel || !tab.id) throw new Error('SDR Tabs require unique tab IDs and matching panel anchors.');
    return panel;
  });
  if (!triggers.length) throw new Error('SDR Tabs require at least one tab.');
  let active = Number(root.dataset.sdrSelected ?? 0);
  if (!Number.isInteger(active) || active < 0 || active >= triggers.length) throw new Error('SDR Tabs initial index is out of range.');
  life.set(list, 'role', 'tablist');
  const select = (index: number, focus = false) => {
    active = index;
    triggers.forEach((tab, i) => {
      life.set(tab, 'role', 'tab'); life.set(tab, 'aria-controls', panels[i].id);
      life.set(tab, 'aria-selected', String(i === index)); life.set(tab, 'tabindex', i === index ? '0' : '-1');
      life.set(panels[i], 'role', 'tabpanel'); life.set(panels[i], 'aria-labelledby', tab.id);
      life.set(panels[i], 'tabindex', '0'); life.set(panels[i], 'hidden', i === index ? null : '');
    });
    if (focus) triggers[index].focus();
  };
  triggers.forEach((tab, index) => {
    life.on(tab, 'click', event => { event.preventDefault(); select(index); });
    life.on(tab, 'keydown', event => {
      const key = (event as KeyboardEvent).key;
      const rtl = getComputedStyle(root).direction === 'rtl';
      let next = active;
      if (key === 'Home') next = 0;
      else if (key === 'End') next = triggers.length - 1;
      else if (key === 'ArrowRight') next = (active + (rtl ? -1 : 1) + triggers.length) % triggers.length;
      else if (key === 'ArrowLeft') next = (active + (rtl ? 1 : -1) + triggers.length) % triggers.length;
      else return;
      event.preventDefault(); select(next, true);
    });
  });
  select(active);
  return life.destroy;
}
