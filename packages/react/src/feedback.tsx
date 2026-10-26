import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx, useBehavior } from './shared';
import { Button } from './actions';
export type Tone = 'info' | 'success' | 'warning' | 'danger';
export function Alert({ title, tone = 'info', children, className, ...props }: Omit<HTMLAttributes<HTMLDivElement>, 'title'> & { title: ReactNode; tone?: Tone }) {
  return <div {...props} className={cx('sdr-alert', tone !== 'info' && `sdr-alert--${tone}`, className)}><p className="sdr-alert__title">{title}</p>{children && <div>{children}</div>}</div>;
}
export const NotificationBanner = Alert;
export function ErrorMessage(props: HTMLAttributes<HTMLParagraphElement>) { return <p {...props} className={cx('sdr-error', props.className)} />; }
export function ErrorSummary({ title, errors, autoFocus = false }: { title: string; errors: { href: string; message: string }[]; autoFocus?: boolean }) {
  const id = useId();
  return <div className="sdr-error-summary" aria-labelledby={id} tabIndex={-1} ref={node => { if (node && autoFocus) node.focus(); }}>
    <h2 id={id} className="sdr-heading-md">{title}</h2><ul>{errors.map(error => <li key={error.href}><a href={error.href}>{error.message}</a></li>)}</ul>
  </div>;
}
export function Tag({ tone, className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) { return <span {...props} className={cx('sdr-tag', !!tone && `sdr-tag--${tone}`, className)} />; }
export function Badge(props: HTMLAttributes<HTMLSpanElement>) { return <span {...props} className={cx('sdr-badge', props.className)} />; }
export function Chip(props: HTMLAttributes<HTMLSpanElement>) { return <span {...props} className={cx('sdr-chip', props.className)} />; }
export function WarningText({ children }: { children: ReactNode }) { return <div className="sdr-warning"><span className="sdr-warning__icon" aria-hidden="true">!</span><p>{children}</p></div>; }
export function PhaseBanner({ phase, children }: { phase: string; children: ReactNode }) { return <div className="sdr-phase"><Tag>{phase}</Tag><div>{children}</div></div>; }
export function ClassificationBanner({ children }: { children: ReactNode }) { return <div className="sdr-classification">{children}</div>; }
export function Panel({ title, children }: { title: ReactNode; children?: ReactNode }) { return <div className="sdr-panel"><h2>{title}</h2>{children}</div>; }
export function EmptyState({ title, children, action }: { title: ReactNode; children: ReactNode; action?: ReactNode }) { return <div className="sdr-empty"><h3 className="sdr-heading-md">{title}</h3><div>{children}</div>{action}</div>; }
export function LoadingIndicator({ label }: { label: string }) { return <div className="sdr-loading" role="status">{label}</div>; }
export function Skeleton({ label, lines = 3 }: { label: string; lines?: number }) { return <div role="status" className="sdr-stack sdr-u-gap-3"><span className="sdr-visually-hidden">{label}</span>{Array.from({ length: lines }, (_, i) => <div className="sdr-skeleton" aria-hidden="true" key={i} />)}</div>; }
export function Progress({ label, value, max = 100 }: { label: string; value?: number; max?: number }) { const id = useId(); return <div className="sdr-progress"><label htmlFor={id}>{label}</label><progress id={id} value={value} max={max} /></div>; }
export function Toast({ children, returnFocusId, closeLabel }: { children: ReactNode; returnFocusId: string; closeLabel: string }) {
  const ref = useBehavior<HTMLDivElement>('dismiss');
  return <div ref={ref} className="sdr-toast" data-sdr-component="dismiss" data-sdr-owner="react" data-sdr-return-focus={returnFocusId}><div role="status">{children}</div><Button variant="tertiary" data-sdr-dismiss>{closeLabel}</Button></div>;
}
export function CookieBanner({ title, children, acceptLabel, rejectLabel, onAccept, onReject }: { title: string; children: ReactNode; acceptLabel: string; rejectLabel: string; onAccept: () => void; onReject: () => void }) {
  const id = useId();
  return <section className="sdr-cookie" aria-labelledby={id} data-sdr-component="actions" data-sdr-owner="react"><h2 id={id} className="sdr-heading-md">{title}</h2><div>{children}</div><div className="sdr-cluster"><Button onClick={onAccept} data-sdr-action="accept">{acceptLabel}</Button><Button variant="secondary" onClick={onReject} data-sdr-action="reject">{rejectLabel}</Button></div></section>;
}
export function Feedback({ question, yesLabel, noLabel, onAnswer }: { question: string; yesLabel: string; noLabel: string; onAnswer: (helpful: boolean) => void }) {
  return <section className="sdr-inset" data-sdr-component="actions" data-sdr-owner="react"><div className="sdr-cluster"><p>{question}</p><Button variant="secondary" onClick={() => onAnswer(true)} data-sdr-action="helpful">{yesLabel}</Button><Button variant="secondary" onClick={() => onAnswer(false)} data-sdr-action="unhelpful">{noLabel}</Button></div></section>;
}
