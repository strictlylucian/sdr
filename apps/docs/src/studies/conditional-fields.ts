import { studyValue } from './study-choice-values';
import type { Field, FormStudy } from './study-types';
import type { StudyControl } from './study-values';

export function isStudyFieldActive(field: Field, control: (name: string) => StudyControl) {
  if (!field.showWhen) return true;
  const conditions = Array.isArray(field.showWhen) ? field.showWhen : [field.showWhen];
  return conditions.every(condition => {
    const input = control(condition.field), expected = condition.value;
    if (typeof expected === 'boolean') return (input as HTMLInputElement).checked === expected;
    return Array.isArray(expected) ? expected.includes(studyValue(input)) : studyValue(input) === expected;
  });
}

export function syncStudyFields(root: HTMLElement, study: FormStudy, control: (name: string) => StudyControl) {
  for (const field of study.steps.flatMap(step => step.fields)) {
    if (!field.showWhen) continue;
    const input = control(field.name);
    const wrapper = input.closest<HTMLElement>('[data-study-field]');
    if (!wrapper) throw new Error(`Missing study field wrapper: ${field.name}`);
    const active = isStudyFieldActive(field, control);
    wrapper.hidden = !active;
    wrapper.querySelectorAll<StudyControl>('input,select,textarea').forEach(item => { item.disabled = !active; });
    if (!active) input.setCustomValidity('');
  }
}

export function studyFieldDependencies(field: Field) {
  if (!field.showWhen) return [];
  return (Array.isArray(field.showWhen) ? field.showWhen : [field.showWhen]).map(condition => condition.field);
}
