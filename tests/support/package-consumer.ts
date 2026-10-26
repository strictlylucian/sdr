import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildConsumerRuntime } from './consumer-runtime';

export const reactVersions = ['18.3.0', '18.3.1', '19.0.0', '19.2.0'];

export async function checkConsumer(npm: string, archives: Record<string, string>, version: string) {
  const directory = await mkdtemp(resolve(`output/consumer-react-${version}-`));
  const types = version.startsWith('18.') ? '^18.3.0' : '^19.0.0';
  await writeFile(`${directory}/package.json`, JSON.stringify({ private: true, type: 'module', dependencies: {
    ...archives, react: version, 'react-dom': version, '@types/react': types, '@types/react-dom': types,
  } }), 'utf8');
  execFileSync(process.execPath, [npm, 'install', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: directory, stdio: 'pipe' });
  await writeFile(`${directory}/example.tsx`, `import { SdrProvider, TextInput, Button, DataTable, PasswordInput, CharacterCount, Radio, Checkbox } from '@strictlylucian/sdr-react';
import { init } from '@strictlylucian/sdr-core';
export const Example = () => <SdrProvider><TextInput label="Nume" /><Button>Continuă</Button><DataTable caption="Date" columns={[{key:'name',label:'Nume'}]} rows={[]} /><Radio label="Telefon"><TextInput label="Număr" /></Radio><Checkbox label="Email"><TextInput label="Adresă" /></Checkbox></SdrProvider>;
init(document, { formatCount: remaining => String(remaining) });
export const Translated = () => <SdrProvider lang="fr"><PasswordInput label="Mot de passe" showLabel="Afficher" hideLabel="Masquer" /><CharacterCount label="Message" limit={20} formatCount={remaining => String(remaining)} /></SdrProvider>;
// @ts-expect-error Language selection is not a library API.
const invalidLocale = <SdrProvider locale="ro">Content</SdrProvider>;
// @ts-expect-error Application-owned action labels are required.
const missingCopy = <PasswordInput label="Password" />;
`, 'utf8');
  execFileSync(process.execPath, [resolve('node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--jsx', 'react-jsx',
    '--moduleResolution', 'Bundler', '--module', 'ESNext', '--target', 'ES2022', '--typeRoots', `${directory}/node_modules/@types`, `${directory}/example.tsx`], { stdio: 'inherit' });
  await buildConsumerRuntime(directory);
  return { version, directory };
}

export async function writeConsumerManifest(consumers: { version: string; directory: string }[]) {
  await mkdir('output/compatibility', { recursive: true });
  await writeFile('output/compatibility/consumers.json', JSON.stringify(consumers), 'utf8');
}
