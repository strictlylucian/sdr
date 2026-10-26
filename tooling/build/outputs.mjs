import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';

/** Owned build outputs must be fresh so removed modules cannot survive in npm archives. */
export async function clearBuildOutputs() {
  const workspace = fileURLToPath(new URL('../../', import.meta.url));
  for (const directory of ['packages/core/dist', 'packages/react/dist', 'dist/types', 'dist/portable']) {
    const target = resolve(workspace, directory);
    if (!target.startsWith(resolve(workspace) + sep)) throw new Error(`Build output outside workspace: ${target}`);
    await rm(target, { recursive: true, force: true });
  }
}
