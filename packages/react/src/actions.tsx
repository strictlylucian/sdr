import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cx, useBehavior } from './shared';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'danger-secondary'; }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'primary', className, type = 'button', ...props }, ref) {
  return <button {...props} ref={ref} type={type} className={cx('sdr-button', variant !== 'primary' && `sdr-button--${variant}`, className)} />;
});
export const Link = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function Link(props, ref) { return <a {...props} ref={ref} />; });
export function ButtonLink({ variant = 'primary', className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & Pick<ButtonProps, 'variant'>) {
  return <a {...props} className={cx('sdr-button', variant !== 'primary' && `sdr-button--${variant}`, className)} />;
}
export function ToggleButton({ defaultPressed = false, ...props }: ButtonProps & { defaultPressed?: boolean }) {
  const ref = useBehavior<HTMLButtonElement>('toggle');
  return <Button {...props} ref={ref} variant="secondary" data-sdr-component="toggle" data-sdr-owner="react" aria-pressed={defaultPressed} />;
}
export function ActionChip({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...props} type="button" className={cx('sdr-chip', className)} />; }
export function DismissibleChip({ children, onRemove, removeLabel }: { children: ReactNode; onRemove: () => void; removeLabel: string }) {
  return <button className="sdr-chip" type="button" onClick={onRemove} aria-label={removeLabel} data-sdr-component="actions" data-sdr-owner="react" data-sdr-action="remove">{children}<span aria-hidden="true">×</span></button>;
}
export function BackLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return <a {...props} className={cx('sdr-back', props.className)}><span aria-hidden="true">←</span>{children}</a>;
}
export function BackToTop({ children, href = '#top', ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) { return <a {...props} href={href} className="sdr-back">{children}<span aria-hidden="true">↑</span></a>; }
export function SkipLink({ children, href = '#main', ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  // WebKit's restricted link-tabbing preference still honours explicit native tab stops.
  return <a tabIndex={0} {...props} className="sdr-skip sdr-visually-hidden" href={href}>{children}</a>;
}
export function ExitThisPage({ href, children }: { href: string; children: ReactNode }) { return <a className="sdr-button sdr-exit" href={href} rel="noreferrer">{children}</a>; }
