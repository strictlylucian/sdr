import { behaviors, enhance, type Behavior, type EnhancementOptions } from './behaviors';
import type { Cleanup } from './behaviors/lifecycle';
export { themes, spacing, typography, typographySmall } from './tokens';

const mounted = new WeakMap<HTMLElement, Cleanup>();
/** Enhances only opted-in, non-React roots. Call again after inserting HTML. */
export function init(root: ParentNode = document, options: EnhancementOptions = {}) {
  const candidates = [...root.querySelectorAll<HTMLElement>('[data-sdr-component]')];
  if (root instanceof HTMLElement && root.matches('[data-sdr-component]')) candidates.unshift(root);
  const owned: HTMLElement[] = [];
  const release = () => {
    for (const element of owned.reverse()) { mounted.get(element)?.(); mounted.delete(element); }
    owned.length = 0;
  };
  try {
    for (const element of candidates) {
      if (element.dataset.sdrOwner === 'react' || mounted.has(element)) continue;
      const name = element.dataset.sdrComponent as Behavior;
      if (!Object.hasOwn(behaviors, name)) throw new Error(`Unknown SDR behavior: ${name}`);
      const cleanup = enhance(element, name, options);
      mounted.set(element, cleanup); owned.push(element);
    }
  } catch (error) {
    release(); throw error;
  }
  return release;
}
/** Release handlers before removing enhanced HTML or swapping application routes. */
export function destroy(root: ParentNode = document) {
  const candidates = [...root.querySelectorAll<HTMLElement>('[data-sdr-component]')];
  if (root instanceof HTMLElement) candidates.unshift(root);
  for (const element of candidates) {
    mounted.get(element)?.(); mounted.delete(element);
  }
}
