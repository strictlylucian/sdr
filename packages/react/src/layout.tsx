import type { HTMLAttributes, ReactNode, ElementType } from 'react';
import { cx, type Space } from './shared';
type Div = HTMLAttributes<HTMLDivElement>;
export function Container({ className, ...props }: Div) { return <div {...props} className={cx('sdr-container', className)} />; }
export function Stack({ gap, className, ...props }: Div & { gap?: Space }) { return <div {...props} className={cx('sdr-stack', gap !== undefined && `sdr-u-gap-${gap}`, className)} />; }
export function Cluster({ gap = 3, className, ...props }: Div & { gap?: Space }) { return <div {...props} className={cx('sdr-cluster', `sdr-u-gap-${gap}`, className)} />; }
export function Grid({ columns, className, ...props }: Div & { columns?: 2 | 3 }) { return <div {...props} className={cx('sdr-grid', !!columns && `sdr-grid--${columns}`, className)} />; }
export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) { return <section {...props} className={cx('sdr-section', className)} />; }
export function SidebarLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) { return <div className="sdr-sidebar-layout"><aside>{sidebar}</aside><div>{children}</div></div>; }
export function Card({ title, children, footer, horizontal = false, className, ...props }: Omit<HTMLAttributes<HTMLElement>, 'title'> & { title?: ReactNode; footer?: ReactNode; horizontal?: boolean }) {
  return <article {...props} className={cx('sdr-card', horizontal && 'sdr-card--horizontal', className)}>{title && <h3 className="sdr-heading-md">{title}</h3>}<div>{children}</div>{footer && <div className="sdr-card__footer">{footer}</div>}</article>;
}
export function Hero({ title, description, children, kicker, decorative = true }: { title: ReactNode; description?: ReactNode; children?: ReactNode; kicker?: ReactNode; decorative?: boolean }) {
  return <section className="sdr-hero"><div className="sdr-hero__body">{kicker && <p className="sdr-kicker">{kicker}</p>}<h1>{title}</h1>{description && <p className="sdr-lead">{description}</p>}{children}</div>{decorative && <Motif />}</section>;
}
export function PageHeader({ title, description, actions, className }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; className?: string }) {
  return <header className={cx('sdr-page-header', className)}><div className="sdr-page-header__content"><h1>{title}</h1>{description && <p className="sdr-lead">{description}</p>}</div>{actions}</header>;
}
export function InsetText(props: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={cx('sdr-inset', props.className)} />; }
export function Divider(props: HTMLAttributes<HTMLHRElement>) { return <hr {...props} className={cx('sdr-divider', props.className)} />; }
export function Motif({ size = 'md', className, ...props }: Div & { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return <div {...props} className={cx('sdr-motif', size !== 'md' && `sdr-motif--${size}`, className)} aria-hidden="true" />;
}
export function Heading({ level = 2, size, className, ...props }: HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 | 3 | 4 | 5 | 6; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const Tag = `h${level}` as ElementType;
  return <Tag {...props} className={cx('sdr-heading', !!size && `sdr-heading-${size}`, className)} />;
}
export function Text({ size = 'md', className, ...props }: HTMLAttributes<HTMLParagraphElement> & { size?: 'xs' | 'sm' | 'md' | 'lg' }) { return <p {...props} className={cx(`sdr-u-text-${size}`, className)} />; }
export function Prose(props: Div) { return <div {...props} className={cx('sdr-prose', props.className)} />; }
