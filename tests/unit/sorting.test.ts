import { expect, it } from 'vitest';
import { createComparator } from '../../packages/core/src/sorting';

it('uses application-provided collation for natural text sorting', () => {
  const compare = new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare;
  expect(['Record 10', 'Record 2', ' Record 1 '].sort(createComparator('text', compare))).toEqual([' Record 1 ', 'Record 2', 'Record 10']);
});
it('compares trimmed scalar text without a language policy', () => {
  const compare = createComparator('text');
  expect(compare(' a ', 'b')).toBe(-1);
  expect(compare('b', 'a')).toBe(1);
  expect(compare('same', ' same ')).toBe(0);
});
it.each(['', ' ', 'NaN', 'Infinity', '1,2'])('rejects invalid numeric sort data %j', value => {
  expect(() => createComparator('number')(value, 1)).toThrow('finite numeric values');
  expect(() => createComparator('number')(1, value)).toThrow('finite numeric values');
});
