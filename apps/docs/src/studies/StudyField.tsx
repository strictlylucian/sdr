import React from 'react';
import * as R from '../../../../packages/react/src';
import { studyText as t } from '../i18n/messages';
import type { Field, Locale } from './study-types';
export default function StudyField({ field, locale, prefix }: { field: Field; locale: Locale; prefix: string }) {
  const id = `${prefix}-${field.name}`;
  const label = t(locale, field.key) + (field.required ? '' : ` (${t(locale, 'optional')})`);
  const props = { id, name: field.name, label, hint: field.hint ? t(locale, field.hint) : undefined };
  let control: React.ReactNode;
  switch (field.type) {
    case 'radios':
    case 'checkboxes': {
      if (!field.options?.length) throw new Error(`Choice field ${field.name} needs options`);
      const Choice = field.type === 'radios' ? R.Radio : R.Checkbox;
      control = <R.Fieldset id={`${id}-group`} legend={label} hint={props.hint} className="sdr-stack">
        {field.options.map((option, index) => <Choice key={option.value} id={index === 0 ? id : `${id}-${index}`} name={field.name} value={option.value} label={'labelKey' in option ? t(locale, option.labelKey) : option.label} />)}
      </R.Fieldset>;
      break;
    }
    case 'checkbox': control = <R.Checkbox {...props} />; break;
    case 'textarea': control = <R.Textarea {...props} rows={6} />; break;
    case 'file': control = <R.FileUpload {...props} multiple={field.multiple} accept={field.accept} />; break;
    case 'select':
      if (!field.options?.length) throw new Error(`Select ${field.name} needs options`);
      control = <R.Select {...props} defaultValue=""><option value="">{t(locale, 'chooseOption')}</option>{field.options.map(option => <option value={option.value} key={option.value}>{'labelKey' in option ? t(locale, option.labelKey) : option.label}</option>)}</R.Select>;
      break;
    default: control = <R.TextInput {...props} type={field.type ?? 'text'} autoComplete={field.autoComplete} readOnly={!!field.fixedValueKey} defaultValue={field.fixedValueKey ? t(locale, field.fixedValueKey) : field.defaultValue} inputMode={field.pattern?.startsWith('[0-9]') ? 'numeric' : undefined} />;
  }
  return <div className="sdr-form-group" data-study-field={field.name} hidden={!!field.showWhen}>
    {control}
  </div>;
}
