import { lifecycle, requireElement } from './lifecycle';

export function dialog(root: HTMLElement) {
  const life = lifecycle();
  const element = requireElement<HTMLDialogElement>(root, 'dialog');
  const trigger = requireElement<HTMLButtonElement>(root, '[data-sdr-dialog-open]');
  const close = requireElement<HTMLButtonElement>(element, '[data-sdr-dialog-close]');
  life.set(trigger, 'hidden', null);
  life.on(trigger, 'click', () => { element.showModal(); });
  life.on(close, 'click', () => { element.close(); });
  const outside = (event: PointerEvent) => {
    const bounds = element.getBoundingClientRect();
    return event.target === element && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
  };
  let startedOutside = false;
  life.on(element, 'pointerdown', event => { startedOutside = outside(event as PointerEvent); });
  life.on(element, 'pointerup', event => {
    if (startedOutside && outside(event as PointerEvent)) element.close();
    startedOutside = false;
  });
  life.on(element, 'pointercancel', () => { startedOutside = false; });
  life.on(element, 'keydown', event => {
    const key = event as KeyboardEvent;
    if (key.key !== 'Tab' || !element.open) return;
    const controls = [...element.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex],[contenteditable="true"]')]
      .filter(control => control.tabIndex >= 0 && !control.matches(':disabled') && !control.closest('[inert]') && control.getClientRects().length > 0 && getComputedStyle(control).visibility !== 'hidden');
    if (!controls.length) throw new Error('SDR Dialog requires a visible close control.');
    const active = element.ownerDocument.activeElement;
    if (key.shiftKey && active === controls[0]) { key.preventDefault(); controls.at(-1)!.focus(); }
    else if (!key.shiftKey && active === controls.at(-1)) { key.preventDefault(); controls[0].focus(); }
  });
  life.on(element, 'close', () => { trigger.focus(); });
  life.add(() => { if (element.open) element.close(); });
  return life.destroy;
}

export function tooltip(root: HTMLElement) {
  const life = lifecycle();
  const trigger = requireElement<HTMLElement>(root, '[data-sdr-tooltip-trigger]');
  const content = requireElement<HTMLElement>(root, '[role="tooltip"]');
  let hovered = false;
  let focused = false;
  let dismissed = false;
  life.set(content, 'hidden', '');
  const update = () => life.set(content, 'hidden', (hovered || focused) && !dismissed ? null : '');
  life.on(root, 'mouseenter', () => { hovered = true; dismissed = false; update(); });
  life.on(root, 'mouseleave', () => { hovered = false; update(); });
  life.on(trigger, 'focus', () => { focused = true; dismissed = false; update(); });
  life.on(trigger, 'blur', () => { focused = false; update(); });
  life.on(root.ownerDocument, 'keydown', event => {
    if ((event as KeyboardEvent).key === 'Escape') { dismissed = true; update(); }
  });
  return life.destroy;
}

export function dismiss(root: HTMLElement) {
  const life = lifecycle();
  const button = requireElement<HTMLElement>(root, '[data-sdr-dismiss]');
  life.on(button, 'click', () => {
    const target = root.dataset.sdrReturnFocus;
    const destination = target ? root.ownerDocument.getElementById(target) : null;
    if (!destination) throw new Error('SDR dismissible content requires data-sdr-return-focus pointing to a focusable element.');
    destination.focus(); life.set(root, 'hidden', '');
    root.dispatchEvent(new CustomEvent('sdr:dismiss', { bubbles: true }));
  });
  return life.destroy;
}

export function disclosure(root: HTMLElement) {
  const life = lifecycle();
  const summary = requireElement<HTMLElement>(root, 'summary');
  life.on(root, 'keydown', event => {
    if ((event as KeyboardEvent).key === 'Escape') { life.set(root, 'open', null); summary.focus(); }
  });
  life.on(root.ownerDocument, 'click', event => {
    if (!root.contains(event.target as Node)) life.set(root, 'open', null);
  });
  return life.destroy;
}
