import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { components } from '../../catalog/components';
import states from '../../catalog/data/component-states.json';
const receipt = vi.hoisted(() => ({ date: '2026-11-05', sourceFingerprint: 'tested-source', engine: 'axe-core', examples: {} as Record<string, { passed: boolean; scenarios: number; scans: number; review: string[] }> }));
vi.mock('../../catalog/accessibility/audit.json', () => ({ default: receipt }));
import { accessibilityStatus } from '../../catalog/accessibility/status';

beforeEach(() => {
  vi.stubEnv('SDR_ACCESSIBILITY_SOURCE', 'tested-source');
  receipt.sourceFingerprint = 'tested-source';
  receipt.examples = Object.fromEntries([...components.map(item => item.name), ...states.map(item => item.example)].map(name => [name, { passed: true, scenarios: 2, scans: 18, review: [] }]));
});
afterEach(() => vi.unstubAllEnvs());

it('shows an automated pass only for a complete, matching-source receipt', () => {
  expect(accessibilityStatus('Button').state).toBe('passed');
  receipt.sourceFingerprint = 'old-source';
  expect(accessibilityStatus('Button').state).toBe('pending');
});
it('keeps untested examples pending rather than assuming they passed', () => {
  delete receipt.examples.Button;
  expect(accessibilityStatus('Button').state).toBe('pending');
});
it('blocks a parent pass when any of its nested variants fails', () => {
  receipt.examples.ToggleButton.passed = false;
  expect(accessibilityStatus('Button').state).toBe('failed');
  expect(accessibilityStatus('Button', false).state).toBe('passed');
});
it('includes documented error, disabled and read-only states in a component result', () => {
  receipt.examples.TextInputError.passed = false;
  expect(accessibilityStatus('TextInput').state).toBe('failed');
  delete receipt.examples.TextInputError;
  expect(accessibilityStatus('TextInput').state).toBe('pending');
});
it('preserves unresolved human-review rules separately from automated results', () => {
  receipt.examples.Button.review = ['color-contrast'];
  expect(accessibilityStatus('Button')).toMatchObject({ state: 'passed', review: ['color-contrast'] });
});
it('rejects an unknown component instead of inventing an audit result', () => {
  expect(() => accessibilityStatus('Unknown')).toThrow('Unknown component');
});
