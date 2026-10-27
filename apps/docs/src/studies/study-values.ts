import { studyChoices } from './study-choice-values';
import type { Field, FormStudy, Locale } from './study-types';
import { studyText as t } from '../i18n/messages';
export type StudyControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export function studyAnswer(field: Field, input: StudyControl, locale: Locale) {
  if (field.type === 'radios' || field.type === 'checkboxes') return studyChoices(input).filter(choice => choice.checked).map(choice => choice.labels?.[0]?.textContent?.trim()).join(', ') || t(locale, 'empty');
  if (field.type === 'checkbox') return t(locale, (input as HTMLInputElement).checked ? 'yes' : 'no');
  if (field.type === 'file') return [...(input as HTMLInputElement).files!].map(file => file.name).join(', ') || t(locale, 'empty');
  if (field.type === 'select') return input.value ? (input as HTMLSelectElement).selectedOptions[0].text : t(locale, 'empty');
  return input.value || t(locale, 'empty');
}
export function studyTotal(study: FormStudy, count: string, locale: Locale) {
  if (!study.pricing) throw new Error('A total requires study pricing');
  const quantity = Number(count), amount = quantity * study.pricing.unitAmount;
  if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isSafeInteger(amount)) return t(locale, 'enterQuantity');
  return new Intl.NumberFormat(locale === 'ro' ? 'ro-RO' : 'en-GB', { style: 'currency', currency: study.pricing.currency }).format(amount);
}
