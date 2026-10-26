import { lifecycle } from './lifecycle';
/** Host applications implement persistence/business logic through these events. */
export function actions(root: HTMLElement) {
  const life = lifecycle();
  life.on(root, 'click', event => {
    const button = (event.target as Element).closest<HTMLElement>('[data-sdr-action]');
    if (!button || !root.contains(button)) return;
    root.dispatchEvent(new CustomEvent('sdr:action', { bubbles: true, detail: { action: button.dataset.sdrAction } }));
  });
  return life.destroy;
}
