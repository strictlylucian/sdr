import { it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { checkConsumer, reactVersions, writeConsumerManifest } from "../support/package-consumer";

it("installs real npm archives into an isolated TypeScript and SSR consumer", async () => {
  const directory = resolve("output/packages");
  await mkdir(directory, { recursive: true });
  const npm = process.env.npm_execpath;
  if (!npm)
    throw new Error("Run package checks through npm run check:packages.");
  const manifests = Object.fromEntries(
    await Promise.all(
      ["core", "react"].map(async (name) => [
        name,
        JSON.parse(await readFile(`packages/${name}/package.json`, "utf8")),
      ]),
    ),
  );
  type PackedArchive = {
    name: string;
    filename: string;
    files: { path: string }[];
  };
  const packs: PackedArchive[] = [];
  for (const name of ["core", "react"]) {
    const result: PackedArchive[] = JSON.parse(
      execFileSync(
        process.execPath,
        [
          npm,
          "pack",
          `--workspace=${manifests[name].name}`,
          `--pack-destination=${directory}`,
          "--json",
        ],
        { encoding: "utf8" },
      ),
    );
    for (const path of [
      "README.md",
      "README.ro.md",
      "LICENSE",
      "dist/index.js",
      "dist/index.d.ts",
    ])
      assert(
        result[0].files.some((file) => file.path === path),
        `Missing packed file: ${name}/${path}`,
      );
    if (name === "core")
      for (const path of [
        "dist/sdr.css",
        "dist/sdr.js",
        "dist/INTER-LICENSE.txt",
      ])
        assert(
          result[0].files.some((file) => file.path === path),
          `Missing packed asset: ${path}`,
        );
    if (name === "react")
      assert(
        (await readFile("packages/react/dist/index.js", "utf8")).startsWith(
          '"use client";',
        ),
        "React entry must preserve its client boundary",
      );
    assert(!result[0].files.some(file => /(?:locales?\/|locale\.d\.ts|i18n\/)/.test(file.path)), 'Library archives must not ship translation modules');
    assert(!Object.keys(manifests[name].dependencies ?? {}).some(name => /i18next/.test(name)), 'i18next is documentation-only');
    assert(!result[0].files.some(file => /provenance/i.test(file.path)), 'Internal provenance must not ship in npm archives');
    packs.push(result[0]);
  }
  const archives = Object.fromEntries(packs.map(pack => [pack.name,
    `file:${resolve(directory, pack.filename).replaceAll("\\", "/")}`]));
  const consumers = [];
  for (const version of reactVersions) consumers.push(await checkConsumer(npm, archives, version));
  await writeConsumerManifest(consumers);
  console.log(`Packed both packages; TypeScript and full-catalogue SSR passed on React ${reactVersions.join(', ')}.`);
}, 240000);
