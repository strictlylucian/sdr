import { it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, writeFile, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { resolve } from "node:path";

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
        "dist/MOTIF-PROVENANCE.json",
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
    packs.push(result[0]);
  }
  // A new project per run prevents an old lockfile or installed tarball hiding a packaging regression.
  const consumer = await mkdtemp(resolve("output/consumer-"));
  const archive = (name: string) =>
    `file:${resolve(directory, packs.find((pack) => pack.name === manifests[name].name)!.filename).replaceAll("\\", "/")}`;
  await writeFile(
    `${consumer}/package.json`,
    JSON.stringify({
      private: true,
      type: "module",
      dependencies: {
        [manifests.core.name]: archive("core"),
        [manifests.react.name]: archive("react"),
        react: "19.2.0",
        "react-dom": "19.2.0",
        "@types/react": "^19.2.0",
        "@types/react-dom": "^19.2.0",
      },
    }),
  );
  execFileSync(
    process.execPath,
    [npm, "install", "--ignore-scripts", "--no-audit", "--no-fund"],
    { cwd: consumer, stdio: "pipe" },
  );
  await writeFile(
    `${consumer}/example.tsx`,
    `import { SdrProvider, TextInput, Button, DataTable, PasswordInput, CharacterCount } from ${JSON.stringify(manifests.react.name)};\nimport { init } from ${JSON.stringify(manifests.core.name)};\nexport const Example = () => <SdrProvider><TextInput label="Nume" /><Button>Continuă</Button><DataTable caption="Date" columns={[{key:'name',label:'Nume'}]} rows={[]} /></SdrProvider>;\ninit(document, { formatCount: remaining => String(remaining) });\nexport const Translated = () => <SdrProvider lang="fr"><PasswordInput label="Mot de passe" showLabel="Afficher" hideLabel="Masquer" /><CharacterCount label="Message" limit={20} formatCount={remaining => String(remaining)} /></SdrProvider>;\n// @ts-expect-error Language selection is not a library API.\nconst invalidLocale = <SdrProvider locale="ro">Content</SdrProvider>;\n// @ts-expect-error Application-owned action labels are required.\nconst missingCopy = <PasswordInput label="Password" />;\n`,
  );
  execFileSync(
    process.execPath,
    [
      resolve("node_modules/typescript/bin/tsc"),
      "--noEmit",
      "--strict",
      "--jsx",
      "react-jsx",
      "--moduleResolution",
      "Bundler",
      "--module",
      "ESNext",
      "--target",
      "ES2022",
      "--typeRoots",
      `${consumer}/node_modules/@types`,
      `${consumer}/example.tsx`,
    ],
    { stdio: "inherit" },
  );
  execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import {SdrProvider,Button} from ${JSON.stringify(manifests.react.name)}; const html=renderToStaticMarkup(React.createElement(SdrProvider,{lang:'fr'},React.createElement(Button,null,'Continuer'))); if(!html.includes('Continuer')||!html.includes('lang="fr"'))throw Error('SSR failed');`,
    ],
    { cwd: consumer, stdio: "inherit" },
  );
  console.log(
    `Packed both packages; isolated consumer type-check and React server rendering passed. Archives: ${packs.map((pack) => pack.filename).join(", ")}`,
  );
}, 90000);
