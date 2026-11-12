import { studyText as t } from '../i18n/messages';
import { isStudyFieldActive } from './conditional-fields';
import type { Field, Locale } from './study-types';
import type { StudyControl } from './study-values';

export function studyValidation(fields: Field[], locale: Locale, control: (name: string) => StudyControl) {

  function message(field: Field, inputs: StudyControl[]) {
    if (field.type === 'file' || !isStudyFieldActive(field, control)) return '';
    const input = inputs[0];
    const choice = field.type === 'radios' || field.type === 'checkbox';
    const empty = choice ? !inputs.some(item => (item as HTMLInputElement).checked) : !input.value.trim();
    const label = t(locale, field.key);
    if (empty) return field.required ? t(locale, 'required', { label }) : '';
    if (input.validity.typeMismatch || input.validity.patternMismatch) return t(locale, 'invalid', { label });
    return '';
  }

  function render(field: Field, check: boolean) {
    const input = control(field.name);
    const wrapper = input.closest<HTMLElement>('[data-study-field]')!;
    const inputs = [...wrapper.querySelectorAll<StudyControl>('input,select,textarea')];
    const errorId = `${input.id}-validation-error`;
    let error = wrapper.querySelector<HTMLElement>('[data-study-error]');
    const detail = check ? message(field, inputs) : '';
    if (detail && !error) {
      error = document.createElement('p');
      error.id = errorId;
      error.className = 'sdr-error';
      error.dataset.studyError = '';
      wrapper.prepend(error);
    }
    if (detail && error) error.textContent = detail;
    if (!detail) error?.remove();
    for (const item of inputs) {
      const descriptions = (item.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(id => id && id !== errorId);
      if (detail) {
        descriptions.push(errorId);
        item.setAttribute('aria-invalid', 'true');
      } else item.removeAttribute('aria-invalid');
      if (descriptions.length) item.setAttribute('aria-describedby', descriptions.join(' '));
      else item.removeAttribute('aria-describedby');
    }
    return detail ? input : undefined;
  }

  return {
    check() {
      return fields.map(field => render(field, true)).find(Boolean);
    },
    refresh() {
      for (const field of fields) {
        if (control(field.name).hasAttribute('aria-invalid')) render(field, true);
      }
    },
    clear() { for (const field of fields) render(field, false); },
  };
}
