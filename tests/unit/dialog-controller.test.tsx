import { fireEvent, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Dialog, Drawer, TextInput } from '../../packages/react/src';
import { renderSdr } from '../support/render';

/** Only the browser's native APIs/geometry are stubbed here. Native focus and backdrop
 * behaviour are separately asserted in Chromium, Firefox and WebKit by Playwright. */
function setup(Component: typeof Dialog = Dialog) {
  const result = renderSdr(<Component closeLabel="Close" trigger="Review" title="Review application"><TextInput label="Note" /><button disabled>Disabled</button><div inert><button>Inert</button></div></Component>);
  const dialog = result.container.querySelector('dialog')!;
  const show = vi.fn(() => { dialog.open = true; });
  const close = vi.fn(() => { dialog.open = false; dialog.dispatchEvent(new Event('close')); });
  Object.defineProperties(dialog, { showModal: { value: show }, close: { value: close } });
  vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 100, 300, 200));
  for (const control of dialog.querySelectorAll<HTMLElement>('button,input')) {
    vi.spyOn(control, 'getClientRects').mockReturnValue([new DOMRect(100, 100, 40, 40)] as unknown as DOMRectList);
  }
  return { ...result, dialog, show, close, trigger: screen.getByRole('button', { name: 'Review' }) };
}

it.each([Dialog, Drawer])('opens a named native overlay, delegates closing and restores trigger focus', async Component => {
  const { dialog, trigger, show, close, unmount } = setup(Component);
  expect(trigger).toHaveAttribute('aria-controls', dialog.id);
  expect(dialog).toHaveAttribute('aria-labelledby', dialog.querySelector('h2')!.id);
  fireEvent.click(trigger); expect(show).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(close).toHaveBeenCalledOnce(); expect(trigger).toHaveFocus();
  fireEvent.click(trigger); unmount();
  expect(close).toHaveBeenCalledTimes(2);
});

it('wraps focus at both modal boundaries and ignores disabled/inert controls', () => {
  const { dialog, trigger } = setup(); fireEvent.click(trigger);
  const first = screen.getByRole('button', { name: 'Close' }), last = screen.getByRole('textbox', { name: 'Note' });
  first.focus(); fireEvent.keyDown(first, { key: 'Tab', shiftKey: true }); expect(last).toHaveFocus();
  fireEvent.keyDown(last, { key: 'Tab' }); expect(first).toHaveFocus();
  fireEvent.keyDown(first, { key: 'ArrowRight' }); expect(first).toHaveFocus();
  dialog.open = false; fireEvent.keyDown(first, { key: 'Tab' }); expect(first).toHaveFocus();
});

it('closes only when the pointer starts and ends outside, and cancels drag dismissal', () => {
  const { dialog, trigger, close } = setup(); fireEvent.click(trigger);
  const pointer = (type: string, outside: boolean) => fireEvent(dialog, new MouseEvent(type, { bubbles: true, clientX: outside ? 0 : 150, clientY: outside ? 0 : 150 }));
  pointer('pointerdown', false); pointer('pointerup', true); expect(close).not.toHaveBeenCalled();
  pointer('pointerdown', true); pointer('pointercancel', true); pointer('pointerup', true); expect(close).not.toHaveBeenCalled();
  pointer('pointerdown', true); pointer('pointerup', false); expect(close).not.toHaveBeenCalled();
  pointer('pointerdown', true); pointer('pointerup', true); expect(close).toHaveBeenCalledOnce();
});
