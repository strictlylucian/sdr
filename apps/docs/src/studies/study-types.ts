import type messages from '../i18n/en/studies.json';
export type Key = keyof typeof messages;
export type StudyId = 'criminal-record' | 'income-tax' | 'petition' | 'online-igi' | 'online-payment';
export type Locale = 'ro' | 'en';
export interface Field {
  name: string; key: Key;
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'checkbox' | 'number' | 'select' | 'file';
  required?: boolean; pattern?: string; hint?: Key; autoComplete?: string;
  min?: string; max?: string; step?: string; defaultValue?: string; fixedValueKey?: Key;
  options?: ({ value: string; label: string } | { value: string; labelKey: Key })[];
  showWhen?: { field: string; value: string };
  matches?: string; accept?: string; maxBytes?: number;
}
export interface Step { key: Key; fields: Field[]; }
export interface FormStudy {
  id: StudyId; title: Key; institution: string; source: string; edition: Key;
  sourceType: 'pdf' | 'web'; capturedOn: string; image: { width: number; height: number };
  completionKey: Key; steps: Step[];
  pricing?: { unitAmount: number; countField: string; currency: 'RON' };
}
