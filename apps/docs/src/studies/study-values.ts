import type { Field, FormStudy, Locale } from './study-types';
import { studyText as t } from '../i18n/messages';
export type StudyControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export function validateStudyField(field: Field, input: StudyControl, control: (name: string) => StudyControl, locale: Locale, pricing?: FormStudy['pricing']) {
  input.setCustomValidity('');
  if (field.matches && input.value.trim() !== control(field.matches).value.trim()) input.setCustomValidity(t(locale, 'emailMismatch'));
  if (field.type === 'file') {
    const file = (input as HTMLInputElement).files?.[0];
    if (file) {
      if (!field.accept || field.maxBytes === undefined) throw new Error('File field needs type and size limits');
      const allowed = field.accept.split(',').some(extension => file.name.toLowerCase().endsWith(extension));
      if (!allowed) input.setCustomValidity(t(locale, 'fileType'));
      else if (file.size > field.maxBytes) input.setCustomValidity(t(locale, 'fileTooLarge'));
    }
  }
  if (pricing?.countField === field.name && input.value && (!Number.isSafeInteger(Number(input.value) * pricing.unitAmount) || !Number.isSafeInteger(Number(input.value)))) input.setCustomValidity(t(locale, 'invalid', { label: t(locale, field.key) }));
}
export function studyAnswer(field: Field, input: StudyControl, locale: Locale) {
  if (field.type === 'checkbox') return t(locale, (input as HTMLInputElement).checked ? 'yes' : 'no');
  if (field.type === 'file') return (input as HTMLInputElement).files?.[0]?.name ?? t(locale, 'empty');
  if (field.type === 'select') return (input as HTMLSelectElement).selectedOptions[0].text;
  return input.value || t(locale, 'empty');
}
export function studyTotal(study: FormStudy, count: string, locale: Locale) {
  if (!study.pricing) throw new Error('A total requires study pricing');
  const quantity = Number(count), amount = quantity * study.pricing.unitAmount;
  if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isSafeInteger(amount)) return t(locale, 'enterQuantity');
  return new Intl.NumberFormat(locale === 'ro' ? 'ro-RO' : 'en-GB', { style: 'currency', currency: study.pricing.currency }).format(amount);
}
