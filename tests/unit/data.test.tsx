import { expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

const columns: R.TableColumn[] = [{ key: 'name', label: 'Name', sortable: true }, { key: 'count', label: 'Count', type: 'number', sortable: true }];
const rows: R.TableRow[] = [{ id: 'a', cells: { name: 'Zoe', count: 20 } }, { id: 'b', cells: { name: 'Ana', count: 3 } }];
const bodyRows = () => screen.getAllByRole('row').slice(1).map(row => row.textContent);

it('renders a caption, labelled scroll region and scoped row/column headers', () => {
  renderSdr(<R.Table caption="Applications" columns={columns} rows={rows} />);
  expect(screen.getByRole('region', { name: 'Applications' })).toHaveAttribute('tabindex', '0');
  expect(screen.getByRole('table', { name: 'Applications' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col');
  expect(screen.getByRole('rowheader', { name: 'Zoe' })).toHaveAttribute('scope', 'row');
});

it('sorts numerically in both directions, switches columns and does not mutate host rows', async () => {
  const frozen = rows.map(row => Object.freeze(row));
  renderSdr(<R.DataTable caption="Applications" columns={columns} rows={Object.freeze(frozen) as unknown as R.TableRow[]} compareText={new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare} />);
  await userEvent.click(screen.getByRole('button', { name: 'Count' }));
  expect(bodyRows()).toEqual(['Ana3', 'Zoe20']);
  expect(screen.getByRole('columnheader', { name: 'Count' })).toHaveAttribute('aria-sort', 'ascending');
  await userEvent.click(screen.getByRole('button', { name: 'Count' }));
  expect(bodyRows()).toEqual(['Zoe20', 'Ana3']);
  await userEvent.click(screen.getByRole('button', { name: 'Name' }));
  expect(bodyRows()).toEqual(['Ana3', 'Zoe20']);
  expect(screen.getByRole('columnheader', { name: 'Count' })).not.toHaveAttribute('aria-sort');
  expect(rows[0].id).toBe('a');
});

it('sorts rich cells by explicit sortValues and supports non-sortable headers', async () => {
  renderSdr(<R.DataTable caption="Rich records" columns={[{ key: 'name', label: 'Name', sortable: true }, { key: 'status', label: 'Status' }]} rows={[
    { id: 'b', cells: { name: <a href="/b">Record B</a>, status: 'Ready' }, sortValues: { name: 'B' } },
    { id: 'a', cells: { name: <a href="/a">Record A</a>, status: 'Ready' }, sortValues: { name: 'A' } },
  ]} compareText={new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare} />);
  await userEvent.click(screen.getByRole('button', { name: 'Name' }));
  expect(within(screen.getAllByRole('row')[1]).getByRole('link')).toHaveAttribute('href', '/a');
  expect(screen.queryByRole('button', { name: 'Status' })).not.toBeInTheDocument();
});

it('retains active sorting when the host replaces row data', async () => {
  const { rerender } = renderSdr(<R.DataTable caption="Records" columns={columns} rows={rows} compareText={new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare} />);
  await userEvent.click(screen.getByRole('button', { name: 'Count' }));
  rerender(<R.DataTable caption="Records" columns={columns} rows={[
    { id: 'c', cells: { name: 'Dan', count: 12 } }, { id: 'd', cells: { name: 'Ioana', count: 2 } },
  ]} compareText={new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare} />);
  expect(bodyRows()).toEqual(['Ioana2', 'Dan12']);
});

it.each(['SummaryList', 'DataList'] as const)('%s keeps terms, values and change actions associated', name => {
  const Component = R[name];
  renderSdr(<Component items={[{ key: 'Name', value: 'Ana', actions: <a href="/name">Change name</a> }, { key: 'County', value: 'Cluj' }]} />);
  expect(screen.getAllByRole('term').map(node => node.textContent)).toEqual(['Name', 'County']);
  expect(screen.getByRole('link', { name: 'Change name' })).toHaveAttribute('href', '/name');
});

it('exposes task status as the link description and preserves timeline machine dates', () => {
  renderSdr(<><R.TaskList label="Your tasks" items={[{ title: 'Identity', href: '/identity', status: 'Complete', tone: 'success' }, { title: 'Payment', status: 'Not started' }]} /><R.Timeline label="History" items={[{ title: 'Submitted', date: '25 October', dateTime: '2026-10-25', description: 'Received' }]} /></>);
  expect(screen.getByRole('link', { name: 'Identity' })).toHaveAccessibleDescription('Complete');
  expect(screen.getByRole('list', { name: 'History' }).querySelector('time')).toHaveAttribute('datetime', '2026-10-25');
});
