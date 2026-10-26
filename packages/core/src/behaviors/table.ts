import { lifecycle, requireElement } from './lifecycle';
import type { EnhancementOptions } from './options';
import { createComparator } from '../sorting';

export function sortableTable(root: HTMLElement, { compareText }: EnhancementOptions = {}) {
  const life = lifecycle();
  const table = requireElement<HTMLTableElement>(root, 'table');
  const body = requireElement<HTMLTableSectionElement>(table, 'tbody');
  const original = [...body.rows];
  life.add(() => { body.append(...original); });
  table.querySelectorAll<HTMLButtonElement>('[data-sdr-sort]').forEach(button => {
    life.on(button, 'click', () => {
      const th = button.closest('th')!;
      const index = th.cellIndex;
      const ascending = th.getAttribute('aria-sort') !== 'ascending';
      const compare = createComparator(th.dataset.sdrSortType === 'number' ? 'number' : 'text', compareText);
      table.querySelectorAll('th').forEach(header => life.set(header, 'aria-sort', header === th ? ascending ? 'ascending' : 'descending' : null));
      const rows = [...body.rows].sort((a, b) => {
        const left = a.cells[index].dataset.sdrValue ?? a.cells[index].textContent ?? '';
        const right = b.cells[index].dataset.sdrValue ?? b.cells[index].textContent ?? '';
        return compare(left, right) * (ascending ? 1 : -1);
      });
      body.append(...rows);
    });
  });
  return life.destroy;
}
