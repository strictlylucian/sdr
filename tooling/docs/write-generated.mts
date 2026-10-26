import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

/** Leave identical generated pages untouched, including their timestamps. */
export async function writeGenerated(path: string, content: string) {
  if (existsSync(path) && await readFile(path, 'utf8') === content) return;
  await writeFile(path, content, 'utf8');
}
