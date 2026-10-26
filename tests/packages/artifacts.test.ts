import { it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
import { motifMask } from "../../tooling/build/motif.mjs";
import { checkEmbeddedFonts } from "../../tooling/build/fonts.mjs";

it("ships portable assets, verified embedded fonts, embedded vector decoration and usable ESM exports", async () => {
  assert.deepEqual((await readdir("dist/portable")).sort(), [
    "sdr.css",
    "sdr.js",
  ]);
  for (const [name, budget] of [
    ["sdr.css", 340000],
    ["sdr.js", 25000],
  ] as const) {
    const source = await readFile(`dist/portable/${name}`);
    assert(
      gzipSync(source).length <= budget,
      `${name} exceeds its gzip budget`,
    );
    if (name.endsWith(".css")) {
      checkEmbeddedFonts(source.toString());
      const allowedMasks = ['R', 'B'].map(thread => motifMask(thread).slice(5, -2));
      const urls = [...source.toString().matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)].map(match => match[1]);
      assert(urls.every(url => url.startsWith('data:font/woff2;base64,') || allowedMasks.includes(url)), 'Only pinned fonts and the two authored SVG masks may be embedded');
      assert(allowedMasks.every(mask => urls.includes(mask)), 'Both motif thread masks must be embedded');
      assert(source.toString().includes('.sdr-motif'), "Portable CSS must include the motif");
      assert(source.toString().includes('.sdr-choice__conditional'), 'Portable CSS must include conditional field layout');
      const withoutFontData = source
        .toString()
        .replace(/url\([^)]*\)/g, "url()");
      assert(
        gzipSync(withoutFontData).length <= 40000,
        "Component CSS exceeds its original gzip budget",
      );
    } else
      assert(
        !/\bfetch\(|\bimport\(/.test(source.toString()),
        "Portable JavaScript must not fetch chunks or resources",
      );
    console.log(
      `${name}: ${source.length} bytes, ${gzipSync(source).length} bytes gzip`,
    );
  }
  const core = await import("../../packages/core/dist/index.js");
  const react = await import("../../packages/react/dist/index.js");
  assert.equal(typeof core.init, "function");
  for (const name of ['messages', 'formatDate', 'formatMoney']) assert(!(name in core), `Library must not export ${name}`);
  for (const file of ['dist/portable/sdr.js', 'packages/react/dist/index.js']) {
    const source = await readFile(file, 'utf8');
    assert(!/i18next|Afișează parola|Ascunde parola|caractere rămase|characters remaining/.test(source), 'Library runtime must not contain translation code or dictionaries');
  }
  assert.equal(typeof react.SdrProvider, "function");
  const declaration = await readFile("packages/react/dist/shared.d.ts", "utf8");
  assert(
    !declaration.includes("../../core/src"),
    "React types must be portable",
  );
  console.log(
    `ESM imports work without a browser. React exports: ${Object.keys(react).length}.`,
  );
}, 30000);
