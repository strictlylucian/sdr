import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cx, useBehavior } from './shared';
import { FieldGroup } from './field-group';

export interface FieldProps { label: ReactNode; hint?: ReactNode; error?: ReactNode; id?: string; }
function Field({ label, hint, error, id, children }: FieldProps & { id: string; children: ReactNode }) {
  return <div className={cx('sdr-field', !!error && 'sdr-field--error')}>
    <label className="sdr-label" htmlFor={id}>{label}</label>
    {hint && <div id={`${id}-hint`} className="sdr-hint">{hint}</div>}
    {error && <div id={`${id}-error`} className="sdr-error">{error}</div>}{children}
  </div>;
}
function fieldAttributes(id: string, hint: ReactNode, error: ReactNode, described?: string, invalid?: InputHTMLAttributes<HTMLInputElement>['aria-invalid']) {
  return { id, 'aria-invalid': error ? true as const : invalid,
    'aria-describedby': [hint && `${id}-hint`, error && `${id}-error`, described].filter(Boolean).join(' ') || undefined };
}
export const TextInput = forwardRef<HTMLInputElement, FieldProps & InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ label, hint, error, id: given, className, 'aria-describedby': described, ...props }, ref) {
    const generated = useId(); const id = given ?? generated;
    return <Field {...{ label, hint, error, id }}><input {...props} {...fieldAttributes(id, hint, error, described, props['aria-invalid'])} aria-invalid={error ? true : props['aria-invalid']} ref={ref} className={cx('sdr-input', className)} /></Field>;
  });
export const Textarea = forwardRef<HTMLTextAreaElement, FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ label, hint, error, id: given, className, 'aria-describedby': described, ...props }, ref) {
    const generated = useId(); const id = given ?? generated;
    return <Field {...{ label, hint, error, id }}><textarea {...props} {...fieldAttributes(id, hint, error, described, props['aria-invalid'])} ref={ref} className={cx('sdr-textarea', className)} /></Field>;
  });
export const Select = forwardRef<HTMLSelectElement, FieldProps & SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ label, hint, error, id: given, className, children, 'aria-describedby': described, ...props }, ref) {
    const generated = useId(); const id = given ?? generated;
    return <Field {...{ label, hint, error, id }}><select {...props} {...fieldAttributes(id, hint, error, described, props['aria-invalid'])} ref={ref} className={cx('sdr-select', className)}>{children}</select></Field>;
  });
export const FileUpload = forwardRef<HTMLInputElement, FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>>(
  function FileUpload({ label, hint, error, id: given, className, 'aria-describedby': described, ...props }, ref) {
    const generated = useId(); const id = given ?? generated;
    return <Field {...{ label, hint, error, id }}><input {...props} {...fieldAttributes(id, hint, error, described, props['aria-invalid'])} ref={ref} type="file" className={cx('sdr-file', className)} /></Field>;
  });

export function PasswordInput({ label, hint, error, id: given, className, showLabel, hideLabel, ...props }: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { showLabel: string; hideLabel: string }) {
  const generated = useId(); const id = given ?? generated;
  const ref = useBehavior<HTMLDivElement>('password');
  return <div ref={ref} data-sdr-show-label={showLabel} data-sdr-hide-label={hideLabel} data-sdr-component="password" data-sdr-owner="react">
    <Field {...{ label, hint, error, id }}><div className="sdr-input-group">
      <input autoComplete="current-password" {...props} {...fieldAttributes(id, hint, error, props['aria-describedby'], props['aria-invalid'])} type="password" className={cx('sdr-input', className)} />
      <button type="button" disabled={props.disabled} className="sdr-button sdr-button--secondary" data-sdr-password-toggle aria-controls={id} aria-pressed="false" hidden>{showLabel}</button>
    </div></Field>
  </div>;
}

export function CharacterCount({ limit, label, hint, error, id: given, formatCount, ...props }: FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength'> & { limit: number; formatCount: (remaining: number) => string }) {
  const generated = useId(); const id = given ?? generated;
  const ref = useBehavior<HTMLDivElement>('character-count', [limit], { formatCount });
  return <div ref={ref} data-sdr-component="character-count" data-sdr-owner="react" data-sdr-limit={limit} className="sdr-stack sdr-u-gap-2">
    <Textarea {...props} {...{ label, hint, error, id }} aria-describedby={[`${id}-count`, props['aria-describedby']].filter(Boolean).join(' ')} />
    <p id={`${id}-count`} className="sdr-character-count" data-sdr-count aria-live="polite" aria-atomic="true">{formatCount(limit - [...String(props.value ?? props.defaultValue ?? '')].length)}</p>
  </div>;
}

export interface DateInputProps { legend: ReactNode; name: string; hint?: ReactNode; error?: ReactNode; id?: string; labels: { day: string; month: string; year: string }; disabled?: boolean; readOnly?: boolean; defaultValue?: { day: string; month: string; year: string }; }
export function DateInput({ legend, name, hint, error, id: given, labels, disabled, readOnly, defaultValue }: DateInputProps) {
  const generated = useId(); const id = given ?? generated;
  return <FieldGroup error={error}><fieldset disabled={disabled} className="sdr-fieldset" aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}>
    <legend className="sdr-legend">{legend}</legend>
    {hint && <p id={`${id}-hint`} className="sdr-hint">{hint}</p>}{error && <p id={`${id}-error`} className="sdr-error">{error}</p>}
    <div className="sdr-date">{(['day', 'month', 'year'] as const).map(part => <TextInput key={part} label={labels[part]} name={`${name}-${part}`} id={`${id}-${part}`} inputMode="numeric" autoComplete={`bday-${part}`} readOnly={readOnly} defaultValue={defaultValue?.[part]} aria-invalid={error ? true : undefined} aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined} maxLength={part === 'year' ? 4 : 2} />)}</div>
  </fieldset></FieldGroup>;
}

export function DatePicker(props: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) { return <TextInput {...props} type="date" />; }
export function TimeInput(props: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) { return <TextInput {...props} type="time" />; }
export function SearchBar({ action, label, buttonLabel, name = 'q', ...props }: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { action: string; buttonLabel: string }) {
  return <form role="search" action={action} method="get" className="sdr-input-group"><TextInput {...props} label={label} name={name} type="search" /><button className="sdr-button" type="submit" disabled={props.disabled}>{buttonLabel}</button></form>;
}
export function RangeInput({ label, hint, error, id: given, className, ...props }: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const generated = useId(); const id = given ?? generated;
  return <Field {...{ label, hint, error, id }}><input {...props} {...fieldAttributes(id, hint, error, props['aria-describedby'], props['aria-invalid'])} className={cx('sdr-range', className)} type="range" /></Field>;
}
