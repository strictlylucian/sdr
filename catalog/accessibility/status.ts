import audit from './audit.json';
import { components } from '../components';
import { componentVariants } from '../component-variants';
import states from '../data/component-states.json';

export type AuditResult = {
  passed: boolean;
  scenarios: number;
  scans: number;
  review: string[];
};
export const auditResults = audit as {
  date: string | null;
  sourceFingerprint: string | null;
  engine: string | null;
  examples: Record<string, AuditResult>;
};

export function accessibilityStatus(name: string, includeVariants = true) {
  const current = auditResults.sourceFingerprint !== null && auditResults.sourceFingerprint === process.env.SDR_ACCESSIBILITY_SOURCE;
  if (!components.some(item => item.name === name)) throw new Error(`Unknown component: ${name}`);
  const names = [name, ...(includeVariants ? componentVariants.filter(item => item.parent === name).map(item => item.name) : [])];
  const examples = [...names, ...states.filter(item => names.includes(item.component)).map(item => item.example)];
  const results = examples.map(example => auditResults.examples[example]);
  const complete = results.every(Boolean);
  const passed = current && complete && results.every(result => result.passed);
  return {
    state: !current || !complete ? 'pending' : passed ? 'passed' : 'failed',
    date: auditResults.date,
    scenarios: results.reduce((sum, result) => sum + (result?.scenarios ?? 0), 0),
    review: [...new Set(results.flatMap(result => result?.review ?? []))],
  };
}
