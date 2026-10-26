import { expect, it } from 'vitest';
import { withDocsBase } from '../../apps/docs/src/docs-url';
import docsBaseLinks from '../../apps/docs/remark-docs-base.mjs';

it('prefixes deployment destinations exactly once without changing external or local anchors', () => {
  expect(withDocsBase('/ro/components/', '/sdr/')).toBe('/sdr/ro/components/');
  for (const path of ['/sdr/ro/', '/sdr', '//example.com/a', 'https://example.com/a', '#main', '?page=2']) {
    expect(withDocsBase(path, '/sdr/')).toBe(path);
  }
  expect(withDocsBase('/ro/', '/')).toBe('/ro/');
  expect(() => withDocsBase('/ro/', 'sdr')).toThrow('Invalid documentation base path');
});

it('prefixes Markdown destinations without rewriting developer code samples', () => {
  const tree = { type: 'root', children: [
    { type: 'link', url: '/ro/' }, { type: 'image', url: '/studies/blue.png' },
    { type: 'definition', url: '/en/' }, { type: 'code', value: 'href="/application/"' },
  ] };
  docsBaseLinks({ base: '/sdr/' })(tree);
  expect(tree.children.map(node => node.url ?? node.value)).toEqual([
    '/sdr/ro/', '/sdr/studies/blue.png', '/sdr/en/', 'href="/application/"',
  ]);
});
