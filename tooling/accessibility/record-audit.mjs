import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { accessibilityFingerprint } from './source-fingerprint.mjs';

const file = process.argv[2];
if (!file) throw new Error('Supply the complete Playwright JSON report from the WCAG matrix run.');
const report = JSON.parse(readFileSync(file, 'utf8'));
if (report.errors.length || report.stats.unexpected || report.stats.skipped || report.stats.flaky) throw new Error('The audit run contains errors, failures, skips or retries.');
const fingerprint = accessibilityFingerprint();
if (report.config.metadata.accessibilitySource !== fingerprint) throw new Error('Component source changed since this audit. Rebuild and rerun it.');
const components = JSON.parse(readFileSync('catalog/data/components.json', 'utf8'));
const states = JSON.parse(readFileSync('catalog/data/component-states.json', 'utf8'));
const expected = [...components.map(item => item.name), ...states.map(item => item.example)];
const results = new Map();
function visit(suite) {
  for (const spec of suite.specs ?? []) {
    const match = /^WCAG matrix: (\w+) \/ (react|html)$/.exec(spec.title);
    if (!match) continue;
    for (const test of spec.tests) {
      if (test.projectName !== 'chromium') throw new Error('The matrix receipt requires Chromium results.');
      const key = `${match[1]}:${match[2]}`;
      if (results.has(key)) throw new Error(`Duplicate result: ${key}`);
      if (test.results.length !== 1 || test.results[0].status !== 'passed') throw new Error(`Audit did not pass without retries: ${key}`);
      const scans = test.results[0].attachments.filter(item => item.contentType === 'application/json').map(item => JSON.parse(
        item.body ? Buffer.from(item.body, 'base64').toString('utf8') : readFileSync(resolve(item.path), 'utf8'),
      ));
      const matrix = ['light', 'dark', 'heritage', 'contrast'].flatMap(theme => ['comfortable', 'compact'].map(density => `${theme}-${density}`));
      for (const state of [...matrix, 'initial', 'expanded']) if (!scans.some(scan => scan.state === state)) throw new Error(`Missing ${state}: ${key}`);
      if (scans.some(scan => scan.violations.length)) throw new Error(`Unresolved violations: ${key}`);
      results.set(key, scans);
    }
  }
  for (const child of suite.suites ?? []) visit(child);
}
for (const suite of report.suites) visit(suite);
if (results.size !== expected.length * 2) throw new Error('The report does not cover the complete current inventory.');
const examples = Object.fromEntries(expected.map(name => {
  const scans = ['react', 'html'].flatMap(edition => {
    const result = results.get(`${name}:${edition}`);
    if (!result) throw new Error(`Missing edition: ${name}/${edition}`);
    return result;
  });
  return [name, { passed: true, scenarios: 2, scans: scans.length, review: [...new Set(scans.flatMap(scan => scan.incomplete.map(item => item.id)))].sort() }];
}));
const first = results.values().next().value[0];
const output = {
  date: new Date(report.stats.startTime).toISOString().slice(0, 10),
  sourceFingerprint: fingerprint,
  engine: `${first.engine.name} ${first.engine.version}`,
  examples,
};
writeFileSync('catalog/accessibility/audit.json', JSON.stringify(output, null, 2) + '\n');
console.log(`Recorded ${expected.length} examples, ${results.size} React/HTML scenarios. Manual evaluation remains separate.`);
