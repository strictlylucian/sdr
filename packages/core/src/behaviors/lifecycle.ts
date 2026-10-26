export type Cleanup = () => void;
export const refreshEvent = 'sdr:refresh';
export function lifecycle() {
  const cleanups: Cleanup[] = [];
  const changed = new WeakMap<Element, Set<string>>();
  const pending = new Set<ReturnType<typeof setTimeout>>();
  return {
    on(target: EventTarget, type: string, listener: EventListener) {
      target.addEventListener(type, listener);
      cleanups.push(() => target.removeEventListener(type, listener));
    },
    set(element: Element, name: string, value: string | null) {
      let names = changed.get(element);
      if (!names) { names = new Set(); changed.set(element, names); }
      if (!names.has(name)) {
        const previous = element.getAttribute(name);
        cleanups.push(() => previous === null ? element.removeAttribute(name) : element.setAttribute(name, previous));
        names.add(name);
      }
      if (value === null) element.removeAttribute(name); else element.setAttribute(name, value);
    },
    add(cleanup: Cleanup) { cleanups.push(cleanup); },
    // Native reset-button activation can finish its default action after microtasks run.
    defer(callback: Cleanup) {
      const timer = setTimeout(() => { pending.delete(timer); callback(); }, 0);
      pending.add(timer);
    },
    destroy() {
      for (const timer of pending) clearTimeout(timer);
      pending.clear();
      for (const cleanup of cleanups.reverse()) cleanup();
      cleanups.length = 0;
    },
  };
}
export function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`SDR: required element missing: ${selector}`);
  return element;
}
export function requireAttribute(element: Element, name: string): string {
  const value = element.getAttribute(name);
  if (!value?.trim()) throw new Error(`SDR: required attribute missing: ${name}`);
  return value;
}
