import { existsSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

/** Avoid unnecessary rewrites and replace complete generated files in one operation. */
export async function writeGenerated(path: string, content: string) {
  await mkdir(dirname(path), { recursive: true });
  if (existsSync(path) && await readFile(path, 'utf8') === content) return;
  const pending = path + '.sdr-generated';
  await writeFile(pending, content, 'utf8');
  await rename(pending, path);
}
