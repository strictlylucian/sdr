import { readdir, unlink } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

/** Generated directories contain only the current catalogue's pages. */
export async function prunePages(directory: string, names: string[], extension: '.mdx' | '.html') {
  const target = resolve(directory);
  const workspace = resolve('.');
  if (!target.startsWith(workspace + sep)) throw new Error('Generated pages outside workspace');
  const expected = new Set(names.map(name => name + extension));
  for (const entry of await readdir(target, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(extension) && !expected.has(entry.name)) {
      await unlink(join(target, entry.name));
    }
  }
}
