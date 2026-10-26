import { useId, useState, type ReactNode } from 'react';
import { createComparator } from '../../core/src/sorting';
import { Tag, type Tone } from './feedback';
export interface SummaryItem { key: string; value: ReactNode; actions?: ReactNode; }
export function SummaryList({ items }: { items: SummaryItem[] }) { return <dl className="sdr-summary">{items.map(item => <div key={item.key} className="sdr-summary__row"><dt>{item.key}</dt><dd>{item.value}</dd>{item.actions && <dd className="sdr-summary__actions">{item.actions}</dd>}</div>)}</dl>; }
export const DataList = SummaryList;
export interface TableColumn { key: string; label: string; sortable?: boolean; type?: 'text' | 'number'; }
export interface TableRow { id: string; cells: Record<string, ReactNode>; sortValues?: Record<string, string | number>; }
export function Table({ caption, columns, rows }: { caption: string; columns: TableColumn[]; rows: TableRow[] }) {
  const id = useId();
  return <div className="sdr-table-wrapper" role="region" aria-labelledby={id} tabIndex={0}><table className="sdr-table"><caption id={id}>{caption}</caption><thead><tr>{columns.map(column => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id}>{columns.map((column, index) => index === 0 ? <th scope="row" key={column.key}>{row.cells[column.key]}</th> : <td key={column.key}>{row.cells[column.key]}</td>)}</tr>)}</tbody></table></div>;
}
export function DataTable({ caption, columns, rows, compareText }: { caption: string; columns: TableColumn[]; rows: TableRow[]; compareText?: (left: string, right: string) => number }) {
  const id = useId();
  const [sort, setSort] = useState<{ key: string; ascending: boolean } | null>(null);
  const column = columns.find(item => item.key === sort?.key);
  const value = (row: TableRow, key: string) => {
    const cell = row.sortValues?.[key] ?? row.cells[key];
    if (typeof cell !== 'string' && typeof cell !== 'number') throw new Error('SDR sortable rich cells require sortValues.');
    return cell;
  };
  const sorted = [...rows];
  if (column && sort) {
    const compare = createComparator(column.type ?? 'text', compareText);
    sorted.sort((a, b) => compare(value(a, column.key), value(b, column.key)) * (sort.ascending ? 1 : -1));
  }
  return <div data-sdr-component="data-table" data-sdr-owner="react" className="sdr-table-wrapper" role="region" aria-labelledby={id} tabIndex={0}>
    <table className="sdr-table"><caption id={id}>{caption}</caption><thead><tr>{columns.map(column => <th key={column.key} scope="col" data-sdr-sort-type={column.type ?? 'text'} aria-sort={column.key === sort?.key ? sort.ascending ? 'ascending' : 'descending' : undefined}>{column.sortable ? <button type="button" data-sdr-sort onClick={() => setSort({ key: column.key, ascending: sort?.key !== column.key || !sort.ascending })}>{column.label}</button> : column.label}</th>)}</tr></thead>
      <tbody>{sorted.map(row => <tr key={row.id}>{columns.map(column => <td key={column.key} data-sdr-value={row.sortValues?.[column.key]}>{row.cells[column.key]}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}
export function TaskList({ items, label }: { label: string; items: { title: string; href?: string; status: string; tone?: Tone }[] }) {
  const id = useId(); return <ol className="sdr-task-list" aria-label={label}>{items.map((item, index) => <li key={index}>{item.href ? <a href={item.href} aria-describedby={`${id}-${index}`}>{item.title}</a> : <span>{item.title}</span>}<Tag id={`${id}-${index}`} tone={item.tone}>{item.status}</Tag></li>)}</ol>;
}
export function Timeline({ items, label }: { label: string; items: { title: string; date: string; dateTime: string; description?: ReactNode }[] }) {
  return <ol className="sdr-timeline" aria-label={label}>{items.map(item => <li key={item.dateTime}><div className="sdr-stack sdr-u-gap-2"><time dateTime={item.dateTime} className="sdr-caption">{item.date}</time><h3 className="sdr-heading-sm">{item.title}</h3>{item.description}</div></li>)}</ol>;
}
