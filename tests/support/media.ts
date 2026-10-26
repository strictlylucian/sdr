import { vi } from 'vitest';

/** jsdom has no layout engine; responsive focus is also exercised in real browsers. */
export function mockViewport(desktop = true) {
  const media = new EventTarget() as MediaQueryList;
  Object.defineProperties(media, {
    matches: { value: desktop, writable: true },
    media: { value: '(min-width:40rem)' },
    onchange: { value: null, writable: true },
  });
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  return (matches: boolean) => {
    Object.defineProperty(media, 'matches', { value: matches, writable: true });
    media.dispatchEvent(new Event('change'));
  };
}
