import React from 'react';
import * as R from '../../../../packages/react/src';
import { studyText as t } from '../i18n/messages';
import type { Field, Locale } from './study-types';
export default function StudyField({ field, locale, prefix }: { field: Field; locale: Locale; prefix: string }) {
  const id = `${prefix}-${field.name}`;
  const label = t(locale, field.key) + (field.required ? '' : ` (${t(locale, 'optional')})`);
  const props = { id, name: field.name, label, required: field.required, hint: field.hint ? t(locale, field.hint) : undefined };
  let control: React.ReactNode;
  switch (field.type) {
    case 'checkbox': control = <R.Checkbox {...props} />; break;
    case 'textarea': control = <R.Textarea {...props} rows={6} />; break;
    case 'file': control = <R.FileUpload {...props} accept={field.accept} />; break;
    case 'select':
      if (!field.options?.length) throw new Error(`Select ${field.name} needs options`);
      control = <R.Select {...props} defaultValue=""><option value="">{t(locale, 'chooseOption')}</option>{field.options.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</R.Select>;
      break;
    default: control = <R.TextInput {...props} type={field.type ?? 'text'} autoComplete={field.autoComplete} pattern={field.pattern} min={field.min} max={field.max} step={field.step} readOnly={!!field.fixedValueKey} defaultValue={field.fixedValueKey ? t(locale, field.fixedValueKey) : field.defaultValue} inputMode={field.pattern?.startsWith('[0-9]') ? 'numeric' : undefined} />;
  }
  return <div data-study-field={field.name}>
    {control}
    <p id={`${id}-validation`} className="sdr-error" data-study-error hidden />
  </div>;
}
