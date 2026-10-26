import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const directory = new URL('../../packages/core/assets/inter/', import.meta.url);
export const fontManifest = JSON.parse(await readFile(new URL('manifest.json', directory), 'utf8'));
const profile = JSON.parse(await readFile(new URL(fontManifest.subset, directory), 'utf8'));
const reports = JSON.parse(await readFile(new URL('subset-report.json', directory), 'utf8'));

export async function embeddedFontStyles() {
  const license = await readFile(new URL('LICENSE.txt', directory), 'utf8');
  const rules = await Promise.all(fontManifest.faces.map(async face => {
    const bytes = await readFile(new URL(face.file, directory));
    assert.equal(bytes.toString('ascii', 0, 4), 'wOF2', `${face.file} must be WOFF2`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), face.sha256, `${face.file} differs from the pinned font`);
    const report = reports.find(item => item.file === face.file);
    assert.equal(report.sha256, face.sha256, 'Subset verification report is stale');
    assert(report.romanianAndCombiningMarks && report.outlineComparisons >= 660, 'Romanian glyph verification is missing');
    const range = profile.unicodeRanges.map(value => 'U+' + value).join(',');
    return `@font-face{font-family:"Inter";font-style:${face.style};font-weight:${fontManifest.weightRange.join(' ')};font-display:swap;unicode-range:${range};src:url("data:font/woff2;base64,${bytes.toString('base64')}") format("woff2");}`;
  }));
  return `/*! Inter ${fontManifest.version} — ${fontManifest.source}\n${license}\n*/\n${rules.join('\n')}\n`;
}

export function checkEmbeddedFonts(css) {
  const urls = [...css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)].map(match => match[1]);
  const fontUrls = urls.filter(url => url.startsWith('data:font/woff2;base64,'));
  assert.equal(fontUrls.length, fontManifest.faces.length, 'CSS must contain the two embedded font URLs');
  for (const [index, url] of fontUrls.entries()) {
    assert(url.startsWith('data:font/woff2;base64,'), 'CSS must not request external assets');
    const bytes = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), fontManifest.faces[index].sha256, 'Embedded font must match its pinned asset');
  }
  assert(css.includes('SIL OPEN FONT LICENSE'), 'CSS must retain the Inter license');
  assert(css.includes('Copyright (c) 2016 The Inter Project Authors'), 'CSS must retain font attribution');
}
