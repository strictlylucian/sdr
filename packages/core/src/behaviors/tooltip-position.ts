import type { lifecycle } from './lifecycle';

/** Keep supporting text readable when its trigger is near a viewport edge. */
export function tooltipPosition(root: HTMLElement, content: HTMLElement, life: ReturnType<typeof lifecycle>) {
  life.set(content, 'style', content.getAttribute('style'));
  const position = () => {
    if (content.hidden) return;
    const view = root.ownerDocument.defaultView!;
    life.set(root, 'data-sdr-tooltip-side', null);
    content.style.setProperty('--sdr-tooltip-offset', '0px');
    if (content.getBoundingClientRect().top < 0) life.set(root, 'data-sdr-tooltip-side', 'bottom');
    const bounds = content.getBoundingClientRect();
    const offset = Math.max(-bounds.left, Math.min(0, view.innerWidth - bounds.right));
    content.style.setProperty('--sdr-tooltip-offset', `${offset}px`);
  };
  life.on(root.ownerDocument.defaultView!, 'resize', position);
  root.ownerDocument.addEventListener('scroll', position, true);
  life.add(() => root.ownerDocument.removeEventListener('scroll', position, true));
  return position;
}
