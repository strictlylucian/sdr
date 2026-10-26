import { copyFile, mkdir, readdir, rename, rm, rmdir } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';

async function files(root, prefix = '') {
  const entries = await readdir(join(root, prefix), { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const path = join(prefix, entry.name);
    return entry.isDirectory() ? files(root, path) : [path];
  }))).flat();
}

async function pruneEmptyDirectories(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const child = join(root, entry.name);
    await pruneEmptyDirectories(child);
    if ((await readdir(child)).length === 0) await rmdir(child);
  }
}

/** Publish assets before pages, then retain only the completed build's inventory. */
export async function publishDocs(staging, destination) {
  const source = resolve(staging);
  const target = resolve(destination);
  if (source === target || source.startsWith(target + sep) || target.startsWith(source + sep)) {
    throw new Error('Documentation staging and destination must be separate directories');
  }
  const next = await files(source);
  if (!next.includes(join('ro', 'index.html')) || !next.includes(join('en', 'index.html'))) {
    throw new Error('Incomplete documentation build: both language homepages are required');
  }
  await mkdir(target, { recursive: true });
  const previous = await files(target);
  next.sort((a, b) => Number(a.endsWith('.html')) - Number(b.endsWith('.html')));
  for (const path of next) {
    const output = join(target, path);
    await mkdir(dirname(output), { recursive: true });
    const pending = output + '.sdr-publish';
    await copyFile(join(source, path), pending);
    await rename(pending, output);
  }
  const current = new Set(next);
  for (const path of previous) {
    if (!current.has(path)) {
      const obsolete = resolve(target, path);
      if (!obsolete.startsWith(target + sep)) throw new Error('Page outside documentation output');
      await rm(obsolete);
    }
  }
  await pruneEmptyDirectories(target);
}
