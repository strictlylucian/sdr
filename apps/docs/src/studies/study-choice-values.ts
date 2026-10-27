import type { StudyControl } from './study-values';

export function studyChoices(input: StudyControl) {
  const wrapper = input.closest('[data-study-field]');
  if (!wrapper) throw new Error(`Missing field wrapper: ${input.name}`);
  return [...wrapper.querySelectorAll<HTMLInputElement>('input[type="checkbox"],input[type="radio"]')];
}

export function studyValue(input: StudyControl) {
  return input.type === 'radio' ? studyChoices(input).find(choice => choice.checked)?.value ?? '' : input.value;
}
