import { it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { extname } from "node:path";
import postcss from "postcss";

it("keeps source modular, spacing tokenised and documentation bilingual", async () => {
  const ignored = new Set([
    "node_modules",
    "dist",
    ".astro",
    ".git",
    ".codebase-memory",
    ".playwright-cli",
    "output",
    "test-results",
    "playwright-report",
    "coverage",
  ]);
  async function files(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    return (
      await Promise.all(
        entries
          .filter((entry) => !ignored.has(entry.name))
          .map((entry) =>
            entry.isDirectory()
              ? files(`${directory}/${entry.name}`)
              : [`${directory}/${entry.name}`],
          ),
      )
    ).flat();
  }
  const all = await files(".");
  const errors = [];
  for (const path of all) {
    if (
      ![".ts", ".tsx", ".js", ".mjs", ".mts", ".css", ".astro"].includes(
        extname(path),
      )
    )
      continue;
    const source = await readFile(path, "utf8");
    const lines = source.trimEnd().split("\n").length;
    if (lines > 300) errors.push(`${path}: ${lines} lines exceeds 300`);
    if (path.endsWith(".css") && !path.endsWith("/generated.css")) {
      postcss.parse(source, { from: path }).walkDecls((declaration) => {
        if (
          !/^(margin|padding|gap|row-gap|column-gap)(-|$)/.test(
            declaration.prop,
          )
        )
          return;
        if (
          declaration.parent?.type === "rule" &&
          declaration.parent.selector.startsWith(".sdr-visually-hidden")
        )
          return;
        const withoutTokens = declaration.value
          .replace(/var\([^)]*\)/g, "")
          .replace(/\bauto\b/g, "")
          .replace(/\b0\b/g, "")
          .trim();
        if (withoutTokens)
          errors.push(
            `${path}:${declaration.source!.start!.line}: spacing must use SDR tokens: ${declaration.prop}:${declaration.value}`,
          );
      });
    }
  }
  const docs = "apps/docs/src/content/docs/";
  const localePaths = (locale: string) =>
    new Set(
      all
        .filter((path) => path.startsWith(`./${docs}${locale}/`))
        .map((path) => path.replace(`./${docs}${locale}/`, "")),
    );
  const ro = localePaths("ro");
  const en = localePaths("en");
  for (const path of all.filter(
    (path) => path.startsWith(`./${docs}`) && path.endsWith(".mdx"),
  )) {
    if (/gov\.uk|govuk|\bGDS\b/i.test(await readFile(path, "utf8")))
      errors.push(
        `Public documentation contains a prohibited external comparison: ${path}`,
      );
  }
  for (const path of new Set([...ro, ...en]))
    if (!ro.has(path) || !en.has(path))
      errors.push(`Missing translated document: ${path}`);
  if (!ro.size)
    errors.push("No documentation generated. Run npm run docs:generate.");
  if (errors.length) throw new Error(errors.join("\n"));
  else
    console.log(
      `Source files ≤300 lines; spacing uses tokens; ${ro.size} documentation routes have RO/EN parity.`,
    );
}, 30000);
