import { afterEach, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { publishDocs } from '../../tooling/docs/publish.mjs';

const roots: string[] = [];
afterEach(async () => {
  for (const root of roots.splice(0)) {
    if (!resolve(root).startsWith(join(tmpdir(), 'sdr-docs-publish-'))) throw new Error('Test output outside owned directory');
    await rm(root, { recursive: true });
  }
});
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'sdr-docs-publish-'));
  roots.push(root);
  const staging = join(root, 'staging'), destination = join(root, 'live');
  for (const path of [staging, destination]) await mkdir(path);
  return { staging, destination };
}
async function put(root: string, path: string, text: string) {
  const segments = path.split('/');
  await mkdir(join(root, ...segments.slice(0, -1)), { recursive: true });
  await writeFile(join(root, path), text);
}

it('leaves published pages untouched when a build is incomplete', async () => {
  const { staging, destination } = await fixture();
  await put(destination, 'ro/components/dialog/index.html', 'working dialog');
  await put(staging, 'ro/index.html', 'unfinished build');
  await expect(publishDocs(staging, destination)).rejects.toThrow('Incomplete');
  expect(await readFile(join(destination, 'ro/components/dialog/index.html'), 'utf8')).toBe('working dialog');
});

it('publishes only the complete current build and removes obsolete pages, assets and empty folders', async () => {
  const { staging, destination } = await fixture();
  await put(destination, 'ro/obsolete/index.html', 'obsolete');
  await put(destination, '_astro/old.js', 'cached page dependency');
  await put(destination, 'ro/index.html', 'old homepage');
  await put(staging, 'ro/index.html', 'new homepage');
  await put(staging, 'en/index.html', 'English homepage');
  await put(staging, '_astro/new.js', 'new dependency');
  await publishDocs(staging, destination);
  expect(await readFile(join(destination, 'ro/index.html'), 'utf8')).toBe('new homepage');
  await expect(readFile(join(destination, '_astro/old.js'))).rejects.toThrow();
  expect(await readFile(join(destination, '_astro/new.js'), 'utf8')).toBe('new dependency');
  await expect(readFile(join(destination, 'ro/obsolete/index.html'))).rejects.toThrow();
  await expect(stat(join(destination, 'ro/obsolete'))).rejects.toThrow();
});

it('rejects overlapping build and published directories', async () => {
  const { staging } = await fixture();
  await expect(publishDocs(staging, staging)).rejects.toThrow('separate');
  await expect(publishDocs(staging, join(staging, 'nested'))).rejects.toThrow('separate');
});
