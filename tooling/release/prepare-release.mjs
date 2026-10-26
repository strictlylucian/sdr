import { mkdir, readFile, writeFile, copyFile, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const manifests = await Promise.all(['core', 'react'].map(async name => JSON.parse(await readFile(`packages/${name}/package.json`, 'utf8'))));
assert.equal(manifests[0].version, manifests[1].version, 'Package versions must stay aligned');
const version = manifests[0].version;
assert.equal(JSON.parse(await readFile('package.json', 'utf8')).version, version, 'Workspace and package versions must match');
const stage = /^(?:\d+\.){2}\d+-(alpha|beta|rc)\.\d+$/.exec(version)?.[1];
assert(stage, 'An explicit alpha, beta or rc version is required');
for (const manifest of manifests) assert.equal(manifest.publishConfig.tag, stage, 'Publication tag must match the prerelease stage');
assert.deepEqual((await readdir('dist/portable')).sort(), ['sdr.css', 'sdr.js']);
const directory = `output/release/${version}`;
await mkdir(`${directory}/portable`, { recursive: true });
const files = [];
for (const manifest of manifests) {
  const filename = `${manifest.name.replace(/^@/, '').replace('/', '-')}-${version}.tgz`;
  await copyFile(`output/packages/${filename}`, `${directory}/${filename}`);
  files.push(filename);
}
for (const filename of ['sdr.css', 'sdr.js']) {
  await copyFile(`dist/portable/${filename}`, `${directory}/portable/${filename}`);
  files.push(`portable/${filename}`);
}
const hashes = [];
for (const filename of await readdir(directory)) {
  if (filename.endsWith('.tgz') && !files.includes(filename)) await unlink(`${directory}/${filename}`);
}
for (const file of files) hashes.push(`${createHash('sha256').update(await readFile(`${directory}/${file}`)).digest('hex')}  ${file}`);
await writeFile(`${directory}/SHA256SUMS`, hashes.join('\n') + '\n');
console.log(`Prepared ${version}: two npm archives, two portable runtime files and SHA256SUMS in ${directory}. Nothing was published.`);
