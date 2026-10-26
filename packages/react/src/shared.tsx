import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { enhance } from '../../core/src/behaviors';
import { refreshEvent } from '../../core/src/behaviors/lifecycle';
export type Theme = 'light' | 'dark' | 'heritage' | 'contrast';
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Behavior = 'accordion' | 'tabs' | 'password' | 'character-count' | 'toggle' | 'dialog' | 'tooltip' | 'dismiss' | 'disclosure' | 'data-table' | 'service-navigation' | 'conditional-choice';
export type BaseProps = HTMLAttributes<HTMLElement>;
export const cx = (...values: (string | false | undefined)[]) => values.filter(Boolean).join(' ');
type ReactBehaviorOptions = { formatCount?: (remaining: number, root: HTMLElement) => string };
export function useBehavior<T extends HTMLElement>(name: Behavior | null, dependencies: unknown[] = [], options: ReactBehaviorOptions = {}) {
  const ref = useRef<T>(null);
  const current = useRef(options);
  current.current = options;
  useEffect(() => {
    if (name === null) return;
    if (!ref.current) throw new Error(`SDR ${name} root is missing.`);
    return enhance(ref.current, name, {
      ...options,
      formatCount: options.formatCount ? (remaining, root) => current.current.formatCount!(remaining, root) : undefined,
    });
  }, [name, ...dependencies]);
  useEffect(() => { if (name !== null) ref.current!.dispatchEvent(new Event(refreshEvent)); });
  return ref;
}
export function SdrProvider({ theme = 'light', density = 'comfortable', children, className, ...props }: {
  theme?: Theme; density?: 'comfortable' | 'compact'; children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return <div {...props} data-sdr-theme={theme} data-sdr-density={density} className={cx('sdr', className)}>{children}</div>;
}
