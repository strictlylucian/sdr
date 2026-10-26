import { spawnSync } from 'node:child_process';

const env = { ...process.env, SDR_DOCS_BASE: '/sdr/', SDR_DOCS_SITE: 'https://strictlylucian.github.io', SDR_DOCS_OUTPUT: 'output/pages/sdr' };
for (const args of [['tooling/build/build.mjs'], ['node_modules/tsx/dist/cli.mjs', 'tooling/docs/docs.mts'], ['tooling/docs/build.mjs']]) {
  const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
