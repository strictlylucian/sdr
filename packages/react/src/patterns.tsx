import type { ReactNode } from 'react';
import { TextInput, PasswordInput, type FieldProps } from './fields';
import { Fieldset } from './choices';
import { Stack, Prose } from './layout';
import { SummaryList, type SummaryItem } from './data';
import { Button, ButtonLink } from './actions';
import { Panel } from './feedback';
export function NameFields({ name = 'full-name', ...props }: Parameters<typeof TextInput>[0]) {
  return <TextInput {...props} name={name} autoComplete="name" />;
}
export interface AddressLabels {
  line1: string; line2: string; city: string; region: string; postcode: string; country: string;
}
export function AddressFields({ prefix = 'address', international = false, legend, labels }: {
  prefix?: string; international?: boolean; legend: ReactNode; labels: AddressLabels;
}) {
  return <Fieldset legend={legend}>
    <TextInput name={`${prefix}-line1`} label={labels.line1} autoComplete="address-line1" />
    <TextInput name={`${prefix}-line2`} label={labels.line2} autoComplete="address-line2" />
    <TextInput name={`${prefix}-city`} label={labels.city} autoComplete="address-level2" />
    <TextInput name={`${prefix}-region`} label={labels.region} autoComplete="address-level1" />
    <TextInput name={`${prefix}-postcode`} label={labels.postcode} autoComplete="postal-code" />
    {international && <TextInput name={`${prefix}-country`} label={labels.country} autoComplete="country-name" />}
  </Fieldset>;
}
export function ContactFields({ prefix = 'contact', emailLabel, phoneLabel, phoneHint }: {
  prefix?: string; emailLabel: ReactNode; phoneLabel: ReactNode; phoneHint?: ReactNode;
}) {
  return <Stack><TextInput name={`${prefix}-email`} label={emailLabel} type="email" autoComplete="email" />
    <TextInput name={`${prefix}-phone`} label={phoneLabel} type="tel" autoComplete="tel" hint={phoneHint} /></Stack>;
}
export function BankDetailsFields({ prefix = 'bank', legend, holderLabel, ibanLabel, ibanHint }: {
  prefix?: string; legend: ReactNode; holderLabel: ReactNode; ibanLabel: ReactNode; ibanHint?: ReactNode;
}) {
  return <Fieldset legend={legend}><TextInput label={holderLabel} name={`${prefix}-holder`} autoComplete="name" />
    <TextInput label={ibanLabel} name={`${prefix}-iban`} autoCapitalize="characters" spellCheck={false} hint={ibanHint} /></Fieldset>;
}
export function IdentityFields({ name = 'identity', kind = 'cnp', ...props }: FieldProps & { name?: string; kind?: 'cnp' | 'other' }) {
  return <TextInput {...props} name={name} inputMode={kind === 'cnp' ? 'numeric' : 'text'} />;
}
export function PasswordCreationFields({ name = 'password', ...props }: Parameters<typeof PasswordInput>[0]) {
  return <PasswordInput {...props} name={name} autoComplete="new-password" />;
}
export function CheckAnswers({ title, items, children }: { title: string; items: SummaryItem[]; children?: ReactNode }) { return <Stack><h2>{title}</h2><SummaryList items={items} />{children}</Stack>; }
export function QuestionPage({ title, hint, children, onSubmit, submitLabel }: { title: string; hint?: string; children: ReactNode; onSubmit: React.FormEventHandler<HTMLFormElement>; submitLabel: string }) { return <form onSubmit={onSubmit} className="sdr-stack"><h1>{title}</h1>{hint && <p className="sdr-lead">{hint}</p>}{children}<div><Button type="submit">{submitLabel}</Button></div></form>; }
export function ConfirmationPage({ title, reference, referenceLabel, children }: { title: string; reference: string; referenceLabel: ReactNode; children: ReactNode }) { return <Stack><Panel title={title}><p>{referenceLabel}: <strong>{reference}</strong></p></Panel><Prose>{children}</Prose></Stack>; }
export function ServiceStatusPage({ title, children, returnHref, returnLabel }: { title: string; children: ReactNode; returnHref?: string; returnLabel?: string }) { return <Stack><h1>{title}</h1><Prose>{children}</Prose>{returnHref && <div><ButtonLink href={returnHref}>{returnLabel}</ButtonLink></div>}</Stack>; }
export function StartPage({ title, children, startHref, startLabel }: { title: string; children: ReactNode; startHref: string; startLabel: string }) { return <Stack><h1>{title}</h1><Prose>{children}</Prose><div><ButtonLink href={startHref}>{startLabel}</ButtonLink></div></Stack>; }
export function StepByStep({ title, steps }: { title: string; steps: { title: string; content: ReactNode }[] }) { return <Stack><h2>{title}</h2><ol className="sdr-stack sdr-step-by-step">{steps.map((step, index) => <li key={index}><h3>{step.title}</h3><div>{step.content}</div></li>)}</ol></Stack>; }
