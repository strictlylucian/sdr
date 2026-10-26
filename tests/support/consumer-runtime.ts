import { build, type Plugin } from 'esbuild';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

export async function buildConsumerRuntime(directory: string) {
  const consumerRequire = createRequire(resolve(directory, 'package.json'));
  const plugin: Plugin = {
    name: 'isolated-consumer-runtime',
    setup(builder) {
      builder.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, args => ({ path: consumerRequire.resolve(args.path) }));
      builder.onResolve({ filter: /(?:packages\/react\/src(?:\/index)?|@strictlylucian\/sdr-react)$/ }, args => {
        if (args.pluginData?.isolated) return;
        return builder.resolve('@strictlylucian/sdr-react', { resolveDir: directory, kind: 'import-statement', pluginData: { isolated: true } });
      });
    },
  };
  const options = { bundle: true, jsx: 'automatic' as const, plugins: [plugin],
    define: { 'process.env.NODE_ENV': '"development"', 'process.env.SDR_DOCS_BASE': '"/"' } };
  const app = resolve('tests/support/react-compat-app.tsx').replaceAll('\\', '/');
  const examples = resolve('apps/docs/src/examples/index.ts').replaceAll('\\', '/');
  const server = `import React from 'react';
import {renderToString} from 'react-dom/server';
import {writeFileSync} from 'node:fs';
import {CompatibilityApp} from ${JSON.stringify(app)};
import * as examples from ${JSON.stringify(examples)};
import {SdrProvider} from '@strictlylucian/sdr-react';
for (const locale of ['ro','en']) for (const [name,Example] of Object.entries(examples)) {
  if (!name.endsWith('Example')) continue;
  const html=renderToString(React.createElement(SdrProvider,{lang:locale},React.createElement(Example,{locale})));
  if (!html.length) throw new Error('Empty SSR example: '+name);
}
writeFileSync('fixture.html',renderToString(React.createElement(CompatibilityApp)), 'utf8');
console.log('SSR catalogue passed for React '+React.version);`;
  const rendered = await build({ ...options, metafile: true, stdin: { contents: server, resolveDir: directory }, platform: 'node', format: 'cjs', outfile: resolve(directory, 'server.cjs') });
  for (const input of Object.keys(rendered.metafile!.inputs)) {
    assert(!input.startsWith('packages/react/src/'), 'Compatibility check must use the installed library');
    if (/node_modules\/(react|react-dom)\//.test(input)) assert(resolve(input).startsWith(directory), 'Compatibility check must use the consumer React runtime');
  }
  execFileSync(process.execPath, ['server.cjs'], { cwd: directory, stdio: 'inherit' });
  const client = `import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import {CompatibilityApp} from ${JSON.stringify(app)};
window.compatErrors=[];
const root=hydrateRoot(document.getElementById('root'), React.createElement(CompatibilityApp), {onRecoverableError(error){window.compatErrors.push(String(error));}});
window.compatUnmount=()=>root.unmount();
window.compatVersion=React.version;`;
  await build({ ...options, stdin: { contents: client, resolveDir: directory }, platform: 'browser', format: 'iife', outfile: resolve(directory, 'client.js') });
  await writeFile(resolve(directory, 'runtime.json'), JSON.stringify({ react: consumerRequire.resolve('react'), dom: consumerRequire.resolve('react-dom/client') }), 'utf8');
}
