import { expect, it } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const extensions = new Set(['.md', '.mdx', '.ts', '.tsx', '.mjs', '.mts', '.js', '.json', '.astro', '.css', '.py']);
const excluded = new Set(['dist', 'node_modules', '.astro']);

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return excluded.has(entry.name) ? [] : sourceFiles(path);
    return extensions.has(extname(path)) && !path.endsWith('generated.css') ? [path] : [];
  }));
  return files.flat();
}

it('keeps documentation and examples free of replacement characters and UTF-8 mojibake', async () => {
  const roots = ['catalog', 'packages', 'tooling', 'apps/docs/src'];
  const files = ['README.md', 'README.ro.md', 'DESIGN.md', 'I18N.md', 'TESTING.md', 'CHANGELOG.md', 'apps/docs/astro.config.mjs',
    ...(await Promise.all(roots.map(sourceFiles))).flat()];
  const malformed = /\u00c3|\u00c4\u0192|\u00e2\u20ac|\u00c8[\u2122\u203a]|\ufffd/;
  for (const file of files) expect(await readFile(file, 'utf8'), file).not.toMatch(malformed);
});
