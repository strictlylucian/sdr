import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx, useBehavior } from './shared';
export interface NavigationItem { label: string; href: string; current?: boolean; }
export function Header({ serviceName, href = '/', emblem, children }: { serviceName: string; href?: string; emblem?: ReactNode; children?: ReactNode }) {
  return <header className="sdr-header"><div className="sdr-width-container sdr-header__inner"><a className="sdr-brand" href={href}>{emblem && <span className="sdr-brand__emblem">{emblem}</span>}{serviceName}</a>{children}</div></header>;
}
function ResponsiveNavigation({ items, label, menuLabel }: { items: NavigationItem[]; label: string; menuLabel: string }) {
  const id = useId();
  const ref = useBehavior<HTMLElement>('service-navigation', [items]);
  return <nav ref={ref} className="sdr-navigation" aria-label={label} data-sdr-component="service-navigation" data-sdr-owner="react">
    <div className="sdr-width-container">
      <button type="button" className="sdr-navigation__toggle" data-sdr-navigation-toggle aria-controls={id} hidden>{menuLabel}</button>
      <ul id={id} data-sdr-navigation-links>{items.map(item => <li key={item.href}><a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a></li>)}</ul>
    </div>
  </nav>;
}
type ServiceNavigationProps = { items: NavigationItem[]; label: string } & (
  { side: true; menuLabel?: never } | { side?: false; menuLabel: string }
);
export function ServiceNavigation(props: ServiceNavigationProps) {
  if (!props.side) return <ResponsiveNavigation items={props.items} label={props.label} menuLabel={props.menuLabel} />;
  return <nav className="sdr-navigation sdr-navigation--side" aria-label={props.label}>
    <ul>{props.items.map(item => <li key={item.href}><a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a></li>)}</ul>
  </nav>;
}
export function SideNavigation(props: { items: NavigationItem[]; label: string }) { return <ServiceNavigation {...props} side />; }
export function Breadcrumbs({ items, label }: { items: NavigationItem[]; label: string }) {
  return <nav className="sdr-breadcrumbs" aria-label={label}><ol>{items.map(item => <li key={item.href}>{item.current ? <span aria-current="page">{item.label}</span> : <a href={item.href}>{item.label}</a>}</li>)}</ol></nav>;
}
export function Footer({ children, className, ...props }: HTMLAttributes<HTMLElement>) { return <footer {...props} className={cx('sdr-footer', className)}>{children}</footer>; }
export function LanguageNavigation({ items, label }: { label: string; items: { label: string; lang: string; href: string; current?: boolean }[] }) {
  return <nav className="sdr-language" aria-label={label}><ul>{items.map(item => <li key={item.lang}><a href={item.href} lang={item.lang} hrefLang={item.lang} aria-current={item.current ? 'page' : undefined}>{item.label}</a></li>)}</ul></nav>;
}
export function Pagination({ page, pages, href, label, previousLabel, nextLabel }: { page: number; pages: number; href: (page: number) => string; label: string; previousLabel: string; nextLabel: string }) {
  if (!Number.isInteger(page) || !Number.isInteger(pages) || page < 1 || page > pages) throw new Error('SDR Pagination requires page within 1..pages.');
  const visible = new Set([1, pages, page - 1, page, page + 1].filter(value => value >= 1 && value <= pages));
  const numbers = [...visible].sort((a, b) => a - b);
  return <nav className="sdr-pagination" aria-label={label}><ul>
    {page > 1 && <li><a href={href(page - 1)} rel="prev">← {previousLabel}</a></li>}
    {numbers.map((number, index) => <li key={number}>{index > 0 && number - numbers[index - 1] > 1 && <span aria-hidden="true">…</span>}{number === page ? <span aria-current="page">{number}</span> : <a href={href(number)} aria-label={`${label}: ${number}`}>{number}</a>}</li>)}
    {page < pages && <li><a href={href(page + 1)} rel="next">{nextLabel} →</a></li>}
  </ul></nav>;
}
export function Stepper({ steps, label }: { steps: { label: string; href?: string; current?: boolean; status?: string }[]; label: string }) {
  return <nav aria-label={label}><ol className="sdr-stepper">{steps.map((step, index) => <li key={index} aria-current={step.current ? 'step' : undefined}>
    {step.href ? <a href={step.href}>{step.label}</a> : <span>{step.label}</span>}{step.status && <span className="sdr-visually-hidden">{step.status}</span>}
  </li>)}</ol></nav>;
}
export function TableOfContents({ items, label }: { items: NavigationItem[]; label: string }) { return <SideNavigation items={items} label={label} />; }
export interface TreeNode { label: string; href?: string; children?: TreeNode[]; }
export function TreeView({ items, label }: { items: TreeNode[]; label: string }) {
  const branch = (nodes: TreeNode[]) => <ul>{nodes.map((node, index) => <li key={index}>{node.children ? <details><summary>{node.label}</summary>{node.href && <a href={node.href}>{node.label}</a>}{branch(node.children)}</details> : <a href={node.href}>{node.label}</a>}</li>)}</ul>;
  return <nav className="sdr-tree" aria-label={label}>{branch(items)}</nav>;
}
