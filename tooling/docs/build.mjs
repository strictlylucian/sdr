import { spawnSync } from 'node:child_process';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { publishDocs } from './publish.mjs';

const workspace = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const output = process.env.SDR_DOCS_OUTPUT ? resolve(workspace, process.env.SDR_DOCS_OUTPUT) : resolve(workspace, 'apps/docs/dist');
if (!output.startsWith(workspace + sep)) throw new Error('Documentation output must be inside the workspace');
const root = new URL('../../apps/docs/', import.meta.url);
const astroPackage = createRequire(new URL('package.json', root)).resolve('astro/package.json');
const staging = new URL('.astro/sdr-build/', root);
const result = spawnSync(process.execPath, [
  resolve(dirname(astroPackage), 'bin/astro.mjs'),
  'build', '--outDir', fileURLToPath(staging),
], { cwd: fileURLToPath(root), stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
await publishDocs(fileURLToPath(staging), output);
console.log('Documentation published; existing pages stayed available during the build.');
