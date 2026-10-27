import type { Field, FormStudy } from './study-types';
import type { StudyControl } from './study-values';

export function isStudyFieldActive(field: Field, control: (name: string) => StudyControl) {
  return !field.showWhen || control(field.showWhen.field).value === field.showWhen.value;
}

export function syncStudyFields(root: HTMLElement, study: FormStudy, control: (name: string) => StudyControl) {
  for (const field of study.steps.flatMap(step => step.fields)) {
    if (!field.showWhen) continue;
    const input = control(field.name);
    const wrapper = input.closest<HTMLElement>('[data-study-field]');
    if (!wrapper) throw new Error(`Missing study field wrapper: ${field.name}`);
    const active = isStudyFieldActive(field, control);
    wrapper.hidden = !active;
    input.disabled = !active;
    if (!active) input.setCustomValidity('');
  }
}
