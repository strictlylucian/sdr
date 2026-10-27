import type messages from '../i18n/en/studies.json';
export type Key = keyof typeof messages;
export type StudyId = 'criminal-record' | 'income-tax' | 'petition' | 'online-igi' | 'online-payment' | 'online-gruiu' | 'online-fishing' | 'lighting-clearance' | 'street-crossing';
export type Locale = 'ro' | 'en';
export interface FieldCondition { field: string; value: string | string[] | boolean; }
export interface Field {
  name: string; key: Key;
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'checkbox' | 'number' | 'select' | 'file' | 'radios' | 'checkboxes';
  required?: boolean; pattern?: string; hint?: Key; autoComplete?: string;
  min?: string; max?: string; step?: string; defaultValue?: string; fixedValueKey?: Key;
  options?: ({ value: string; label: string } | { value: string; labelKey: Key })[];
  showWhen?: FieldCondition | FieldCondition[];
  matches?: string; multiple?: boolean; accept?: string; maxBytes?: number;
}
export interface Step { key: Key; fields: Field[]; }
export interface FormStudy {
  id: StudyId; title: Key; institution: string; source: string; edition: Key;
  sourceType: 'paper' | 'web'; sourcePreview?: 'publication'; capturedOn: string; image: { width: number; height: number };
  completionKey: Key; steps: Step[];
  fileTotalBytes?: number;
  pricing?: { unitAmount: number; countField: string; currency: 'RON' };
}
