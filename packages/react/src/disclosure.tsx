import { useId, type ReactNode } from 'react';
import { cx, useBehavior } from './shared';
import { Button } from './actions';

export function Details({ summary, children, open }: { summary: ReactNode; children: ReactNode; open?: boolean }) { return <details className="sdr-details" open={open}><summary><span>{summary}</span></summary><div className="sdr-details__content">{children}</div></details>; }
export function Accordion({ items, label, expandAllLabel, collapseAllLabel }: { items: { id: string; title: ReactNode; content: ReactNode; open?: boolean }[]; label: string; expandAllLabel: string; collapseAllLabel: string }) {
  const ref = useBehavior<HTMLElement>('accordion', [items]);
  return <section ref={ref} className="sdr-accordion" data-sdr-expand-label={expandAllLabel} data-sdr-collapse-label={collapseAllLabel} aria-label={label} data-sdr-component="accordion" data-sdr-owner="react"><Button variant="tertiary" data-sdr-accordion-toggle hidden>{expandAllLabel}</Button>{items.map(item => <Details key={item.id} summary={item.title} open={item.open}>{item.content}</Details>)}</section>;
}
export function Tabs({ items, label, defaultSelected = 0 }: { items: { id: string; label: string; content: ReactNode }[]; label: string; defaultSelected?: number }) {
  const id = useId(); const ref = useBehavior<HTMLDivElement>('tabs', [items, defaultSelected]);
  return <div className="sdr-tabs" ref={ref} data-sdr-component="tabs" data-sdr-owner="react" data-sdr-selected={defaultSelected}>
    <div className="sdr-tabs__list" data-sdr-tablist aria-label={label}>{items.map(item => <a key={item.id} className="sdr-tabs__tab" data-sdr-tab id={`${id}-${item.id}-tab`} href={`#${id}-${item.id}`}>{item.label}</a>)}</div>
    {items.map(item => <section key={item.id} className="sdr-tabs__panel" id={`${id}-${item.id}`} data-sdr-panel><h3 className="sdr-visually-hidden">{item.label}</h3>{item.content}</section>)}
  </div>;
}
export function Dialog({ trigger, title, children, closeLabel, drawer = false }: { trigger: string; title: string; children: ReactNode; closeLabel: string; drawer?: boolean }) {
  const id = useId(); const ref = useBehavior<HTMLDivElement>('dialog');
  return <div ref={ref} data-sdr-component="dialog" data-sdr-owner="react"><Button data-sdr-dialog-open aria-haspopup="dialog" aria-controls={id} hidden>{trigger}</Button>
    <dialog id={id} className={cx('sdr-dialog', drawer && 'sdr-dialog--drawer')} aria-labelledby={`${id}-title`}>
      <div className="sdr-dialog__header"><h2 id={`${id}-title`} className="sdr-heading-md">{title}</h2><Button variant="tertiary" data-sdr-dialog-close>{closeLabel}</Button></div>
      <div className="sdr-dialog__body">{children}</div>
    </dialog></div>;
}
export function Drawer(props: Omit<Parameters<typeof Dialog>[0], 'drawer'>) { return <Dialog {...props} drawer />; }
export function PopoverMenu({ label, children }: { label: string; children: ReactNode }) {
  const ref = useBehavior<HTMLDetailsElement>('disclosure');
  return <details className="sdr-menu" ref={ref} data-sdr-component="disclosure" data-sdr-owner="react"><summary className="sdr-button sdr-button--secondary">{label} <span aria-hidden="true">⌄</span></summary><div className="sdr-menu__content">{children}</div></details>;
}
export function Tooltip({ label, content }: { label: string; content: string }) {
  const id = useId(); const ref = useBehavior<HTMLSpanElement>('tooltip');
  return <span className="sdr-tooltip" ref={ref} data-sdr-component="tooltip" data-sdr-owner="react"><button type="button" className="sdr-button sdr-button--secondary" data-sdr-tooltip-trigger aria-describedby={id}>{label}</button><span className="sdr-tooltip__content" role="tooltip" id={id} hidden>{content}</span></span>;
}
