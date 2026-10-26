import { lifecycle, requireElement } from './lifecycle';

export function serviceNavigation(root: HTMLElement) {
  const life = lifecycle();
  const toggle = requireElement<HTMLButtonElement>(root, '[data-sdr-navigation-toggle]');
  const links = requireElement<HTMLElement>(root, '[data-sdr-navigation-links]');
  if (links.querySelectorAll('a').length < 2) return life.destroy;
  const desktop = root.ownerDocument.defaultView!.matchMedia('(min-width:40rem)');
  let expanded = false;
  const render = () => {
    life.set(toggle, 'hidden', desktop.matches ? '' : null);
    life.set(toggle, 'aria-expanded', String(desktop.matches || expanded));
    life.set(links, 'hidden', desktop.matches || expanded ? null : '');
  };
  life.on(toggle, 'click', () => { expanded = !expanded; render(); });
  life.on(root, 'keydown', event => {
    if ((event as KeyboardEvent).key !== 'Escape' || desktop.matches || !expanded) return;
    event.preventDefault(); expanded = false; render(); toggle.focus();
  });
  life.on(desktop, 'change', () => {
    const active = root.ownerDocument.activeElement;
    const toggleFocused = active === toggle;
    const linksWillHide = !desktop.matches && !expanded && links.contains(active);
    render();
    if (desktop.matches && toggleFocused) requireElement<HTMLAnchorElement>(links, 'a').focus();
    else if (linksWillHide) toggle.focus();
  });
  render();
  return life.destroy;
}
