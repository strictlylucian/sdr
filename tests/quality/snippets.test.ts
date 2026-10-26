import { expect, it } from 'vitest';
import ts from 'typescript';
import { localiseExample } from '../../tooling/docs/localised-example.mts';
import { countSnippet } from '../../tooling/docs/count-snippet.mts';

function snippet(body: string, locale: 'ro' | 'en') {
  const source = ts.createSourceFile('example.tsx', `export function Example({locale}: P) { ${body} }`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const node = source.statements[0];
  if (!ts.isFunctionDeclaration(node)) throw new Error('Expected example function');
  return localiseExample(node, source, locale);
}

it.each([['ro', 'Salvează cererea'], ['en', 'Save application']] as const)('prints readable %s JSX with working event handlers and no docs helper dependency', (locale, expected) => {
  const output = snippet(`return <R.Button onClick={() => setSaved(true)} title={tr(locale, 'actions.saveApplication')}>{tr(locale, 'actions.saveApplication')}</R.Button>;`, locale);
  expect(output).toContain(expected);
  expect(output).toContain('setSaved(true)');
  expect(output).not.toContain('tr(');
  expect(output).not.toContain('actions.saveApplication');
  expect(output).not.toContain('{locale}');
  const parsed = ts.createSourceFile('result.tsx', output, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  expect((parsed as ts.SourceFile & { parseDiagnostics: unknown[] }).parseDiagnostics).toEqual([]);
});

it('retains parameter expressions when localising dynamic copy', () => {
  const output = snippet(`return <p>{uiText(locale, 'demo.results', {count: visible.length})}</p>;`, 'ro');
  expect(output).toContain('Rezultate: ${visible.length}');
  expect(output).not.toContain('uiText(');
});

it('fails on missing snippet translations and parameters', () => {
  expect(() => snippet(`return tr(locale, 'unknown');`, 'en')).toThrow('Missing snippet translation');
  expect(() => snippet(`return uiText(locale, 'demo.results');`, 'en')).toThrow('Missing snippet interpolation');
});

it('resolves explicit component labels without exposing docs translation helpers', () => {
  const output = snippet(`return <R.PasswordInput label="Parolă" showLabel={componentText(locale, 'show')} hideLabel={componentText(locale, 'hide')} />;`, 'ro');
  expect(output).toContain('Afișează parola');
  expect(output).toContain('Ascunde parola');
  expect(output).not.toContain('componentText');
});
it('shows a self-contained application-owned formatter rather than a hidden library translator', () => {
  const body = snippet(`return <R.CharacterCount label="Message" limit={3} formatCount={remaining => countText(locale, remaining)} />;`, 'en');
  const source = countSnippet('en') + body;
  expect(source).toContain("from 'i18next'");
  expect(source).toContain('formatCount(remaining)');
  expect(source).not.toContain('countText(');
  const parsed = ts.createSourceFile('result.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  expect((parsed as ts.SourceFile & { parseDiagnostics: unknown[] }).parseDiagnostics).toEqual([]);
});
