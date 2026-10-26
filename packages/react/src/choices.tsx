import { createContext, forwardRef, useContext, useId, type InputHTMLAttributes, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx, useBehavior } from './shared';
import { FieldGroup } from './field-group';
const ChoiceGroup = createContext<{ invalid?: boolean; described?: string }>({});
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetHTMLAttributes<HTMLFieldSetElement> & { legend: ReactNode; hint?: ReactNode; error?: ReactNode }>(
  function Fieldset({ legend, hint, error, id: given, children, className, ...props }, ref) {
    const generated = useId(); const id = given ?? generated;
    const described = [hint && `${id}-hint`, error && `${id}-error`, props['aria-describedby']].filter(Boolean).join(' ') || undefined;
    return <FieldGroup error={error}><fieldset {...props} id={id} ref={ref} className={cx('sdr-fieldset', className)} aria-describedby={described}>
      <legend className="sdr-legend">{legend}</legend>{hint && <div className="sdr-hint" id={`${id}-hint`}>{hint}</div>}
      {error && <div className="sdr-error" id={`${id}-error`}>{error}</div>}
      <ChoiceGroup.Provider value={{ invalid: !!error, described }}>{children}</ChoiceGroup.Provider>
    </fieldset></FieldGroup>;
  });
export type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> & {
  label: ReactNode; hint?: ReactNode; error?: ReactNode;
  /** Related fields, revealed when selected. Values remain mounted while inactive. */
  children?: ReactNode;
  conditionalId?: string;
};
function Choice({ label, hint, error, children, conditionalId, id: given, className, kind, ...props }: ChoiceProps & { kind: 'checkbox' | 'radio' | 'switch' }, ref: React.ForwardedRef<HTMLInputElement>) {
  const generated = useId(); const id = given ?? generated;
  const group = useContext(ChoiceGroup);
  const hasChildren = children !== undefined && children !== null && children !== false;
  const panelId = conditionalId ?? `${id}-conditional`;
  const behavior = useBehavior<HTMLDivElement>(hasChildren ? 'conditional-choice' : null, [panelId]);
  return <div ref={behavior} data-sdr-component={hasChildren ? 'conditional-choice' : undefined} data-sdr-owner={hasChildren ? 'react' : undefined} className={cx('sdr-choice-field', !!error && 'sdr-field', !!error && 'sdr-field--error', className)}>
    {error && <p id={`${id}-error`} className="sdr-error">{error}</p>}
    <label className={cx('sdr-choice', kind === 'switch' && 'sdr-choice--switch')} htmlFor={id}>
      <span className="sdr-choice__control"><input {...props} id={id} ref={ref} className="sdr-choice__input" type={kind === 'radio' ? 'radio' : 'checkbox'} role={kind === 'switch' ? 'switch' : undefined}
        aria-controls={[props['aria-controls'], hasChildren && panelId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error || group.invalid ? true : props['aria-invalid']} aria-describedby={[hint && `${id}-hint`, error && `${id}-error`, group.described, props['aria-describedby']].filter(Boolean).join(' ') || undefined} /></span>
      <span className="sdr-choice__content"><span id={hasChildren ? `${id}-label` : undefined} className="sdr-choice__label">{label}</span>{hint && <span id={`${id}-hint`} className="sdr-hint">{hint}</span>}</span>
    </label>
    {hasChildren && <fieldset id={panelId} className="sdr-choice__conditional" data-sdr-conditional disabled={props.disabled} aria-labelledby={`${id}-label`}>
      <ChoiceGroup.Provider value={{}}>{children}</ChoiceGroup.Provider>
    </fieldset>}
  </div>;
}
export const Checkbox = forwardRef<HTMLInputElement, ChoiceProps>((props, ref) => Choice({ ...props, kind: 'checkbox' }, ref));
export const Radio = forwardRef<HTMLInputElement, ChoiceProps>((props, ref) => Choice({ ...props, kind: 'radio' }, ref));
export const Switch = forwardRef<HTMLInputElement, ChoiceProps>((props, ref) => Choice({ ...props, kind: 'switch' }, ref));
export function SegmentedControl({ legend, name, options, defaultValue, ...props }: { legend: string; name: string; options: { value: string; label: string }[]; defaultValue?: string; hint?: ReactNode; error?: ReactNode; id?: string; disabled?: boolean }) {
  return <Fieldset {...props} legend={legend}><div className="sdr-segmented">{options.map(option => <Radio key={option.value} name={name} value={option.value} label={option.label} defaultChecked={defaultValue === option.value} />)}</div></Fieldset>;
}
