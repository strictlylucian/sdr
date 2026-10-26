import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { DataTable, SdrProvider } from '../../packages/react/src';
import { init } from '../../packages/core/src/portable';

it('sorts portable tables by numeric and rich-cell values and restores source order on disposal', () => {
  document.body.innerHTML = renderToStaticMarkup(<SdrProvider lang="en"><DataTable caption="Records" columns={[
    { key: 'name', label: 'Name', sortable: true }, { key: 'count', label: 'Count', type: 'number', sortable: true },
  ]} rows={[
    { id: 'b', cells: { name: <a href="/b">Bee</a>, count: 20 }, sortValues: { name: 'B' } },
    { id: 'a', cells: { name: <a href="/a">Aye</a>, count: 3 }, sortValues: { name: 'A' } },
  ]} compareText={new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare} /></SdrProvider>).replaceAll(' data-sdr-owner="react"', '');
  const body = document.querySelector('tbody')!, original = [...body.rows];
  const [name, count] = [...document.querySelectorAll<HTMLButtonElement>('button')];
  const dispose = init();
  count.click(); expect(body.rows[0]).toHaveTextContent('Aye3');
  expect(count.closest('th')).toHaveAttribute('aria-sort', 'ascending');
  count.click(); expect(body.rows[0]).toHaveTextContent('Bee20');
  name.click(); expect(body.rows[0]).toHaveTextContent('Aye3');
  expect(count.closest('th')).not.toHaveAttribute('aria-sort');
  dispose(); expect([...body.rows]).toEqual(original);
  expect(name.closest('th')).not.toHaveAttribute('aria-sort');
  name.click(); expect([...body.rows]).toEqual(original);
});
