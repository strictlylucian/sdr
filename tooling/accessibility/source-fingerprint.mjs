import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, relative } from 'node:path';

const workspace = fileURLToPath(new URL('../../', import.meta.url));
const sources = [
  'packages/core/src', 'packages/react/src', 'apps/docs/src/examples',
  'apps/docs/src/demo', 'apps/docs/src/components/ComponentDemo.tsx',
  'apps/docs/src/i18n/messages.ts', 'apps/docs/astro.config.mjs',
  'apps/docs/src/styles', 'tooling/accessibility/source-fingerprint.mjs',
  'apps/docs/src/i18n/en/examples.json', 'apps/docs/src/i18n/ro/examples.json',
  'apps/docs/src/i18n/en/components.json', 'apps/docs/src/i18n/ro/components.json',
  'catalog/data/components.json', 'catalog/data/component-variants.json',
  'catalog/data/component-states.json', 'tooling/docs/doc-examples.mts',
  'tooling/build',
  'tests/e2e/accessibility-audit.spec.ts', 'tests/e2e/support/accessibility-audit.ts',
  'tests/e2e/support/fixtures.ts', 'playwright.config.ts', 'package-lock.json',
];

/** A successful old audit must never silently certify changed component code. */
export function accessibilityFingerprint() {
  const hash = createHash('sha256');
  function visit(path) {
    if (statSync(path).isDirectory()) {
      for (const entry of readdirSync(path).sort()) visit(resolve(path, entry));
    } else {
      hash.update(relative(workspace, path).replaceAll('\\', '/') + '\0');
      hash.update(readFileSync(path, 'utf8').replaceAll('\r\n', '\n'));
    }
  }
  for (const source of sources) visit(resolve(workspace, source));
  return hash.digest('hex');
}
