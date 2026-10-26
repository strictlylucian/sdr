import { expect, it } from 'vitest';
import roComponents from '../../apps/docs/src/i18n/ro/components.json';
import enComponents from '../../apps/docs/src/i18n/en/components.json';
import roExamples from '../../apps/docs/src/i18n/ro/examples.json';
import enExamples from '../../apps/docs/src/i18n/en/examples.json';
import roUi from '../../apps/docs/src/i18n/ro/ui.json';
import enUi from '../../apps/docs/src/i18n/en/ui.json';
import { exampleText, uiText, countText } from '../../apps/docs/src/i18n/messages';

const placeholders = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
it.each([['examples', roExamples, enExamples], ['interface', roUi, enUi]] as const)('%s documentation translations have matching nonempty keys and placeholders', (_, first, second) => {
  const romanian = first as Record<string, string>, english = second as Record<string, string>;
  expect(Object.keys(romanian).sort()).toEqual(Object.keys(english).sort());
  for (const key of Object.keys(english)) {
    expect(romanian[key].trim(), key).not.toBe('');
    expect(english[key].trim(), key).not.toBe('');
    expect(placeholders(romanian[key]), key).toEqual(placeholders(english[key]));
  }
});
it.each([['ro', roComponents], ['en', enComponents]] as const)('%s documentation supplies native plural categories to i18next', (locale, catalog) => {
  const data = catalog as Record<string, string>;
  const categories = new Intl.PluralRules(locale).resolvedOptions().pluralCategories.sort();
  for (const key of ['remaining', 'over']) {
    expect(Object.keys(data).filter(name => name.startsWith(key + '_')).map(name => name.slice(key.length + 1)).sort()).toEqual(categories);
    for (const category of categories) expect(placeholders(data[`${key}_${category}`])).toEqual(['count']);
  }
  const common = (input: object) => Object.keys(input).filter(key => !/^(remaining|over)_/.test(key)).sort();
  expect(common(roComponents)).toEqual(common(enComponents));
});
it('i18next interpolates documentation copy and fails on missing keys, values or languages', () => {
  expect(uiText('ro', 'demo.results', { count: 2 })).toBe('Rezultate: 2');
  expect(uiText('en', 'demo.results', { count: 0 })).toBe('Results: 0');
  expect(() => uiText('fr', 'demo.results', { count: 2 })).toThrow('Unsupported documentation locale');
  expect(() => uiText('ro', 'demo.results')).toThrow('Missing translation value');
  expect(() => exampleText('en', 'missing.key' as never)).toThrow('Missing documentation translation');
});
it.each([[1, '1 caracter rămas'], [2, '2 caractere rămase'], [20, '20 de caractere rămase']] as const)('i18next uses Romanian plurals for %s in documentation examples', (count, message) => {
  expect(countText('ro', count)).toBe(message);
  expect(countText('ro', -count)).toContain(String(count));
});
it('keeps interleaved server-rendered languages independent', () => {
  expect(countText('en', 1)).toBe('1 character remaining');
  expect(countText('ro', 1)).toBe('1 caracter rămas');
  expect(countText('en', -2)).toBe('You are 2 characters over the limit');
  expect(uiText('ro', 'demo.results', { count: 1 })).toBe('Rezultate: 1');
});
