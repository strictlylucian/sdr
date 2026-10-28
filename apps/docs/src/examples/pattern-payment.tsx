import { useState } from 'react';
import * as R from '../../../../packages/react/src';
import { tr, uiText, type P } from './support';

export function PaymentCardExample({ locale }: P) {
  const [done, setDone] = useState(false);
  const amount = new Intl.NumberFormat(uiText(locale, "formats.numberLocale"), { style: 'currency', currency: 'RON' }).format(25);
  return <form data-sdr-pattern-demo="payment" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <h3>{tr(locale, "pattern-payment.payTheDocumentFee")}</h3>
    <R.SummaryList items={[{ key: tr(locale, "pattern-payment.amountDue"), value: amount }]} />
    <R.TextInput label={tr(locale, "pattern-payment.cardNumber")} name="card-number" inputMode="numeric" autoComplete="cc-number" defaultValue="4242 4242 4242 4242" pattern={"4242(?:\\s|\\x2D)*4242(?:\\s|\\x2D)*4242(?:\\s|\\x2D)*4242"} title={tr(locale, "pattern-payment.useTestCard4242424242424242")} required />
    <R.Fieldset legend={tr(locale, "pattern-payment.expiryDate")} hint={tr(locale, "pattern-payment.forExample122030")}><div className="sdr-date">
      <R.TextInput label={tr(locale, "pattern-payment.month")} name="card-exp-month" inputMode="numeric" autoComplete="cc-exp-month" defaultValue="12" pattern="0[1-9]|1[0-2]" maxLength={2} required />
      <R.TextInput label={tr(locale, "pattern-payment.year")} name="card-exp-year" inputMode="numeric" autoComplete="cc-exp-year" defaultValue="2030" pattern="20[0-9]{2}" maxLength={4} required />
    </div></R.Fieldset>
    <R.TextInput label={tr(locale, "pattern-payment.nameOnCard")} name="card-name" autoComplete="cc-name" defaultValue="ANA ȘERBAN" required />
    <R.TextInput label={tr(locale, "pattern-payment.cardSecurityCode")} name="card-security" inputMode="numeric" autoComplete="cc-csc" defaultValue="123" pattern="[0-9]{3,4}" maxLength={4} hint={tr(locale, "pattern-payment.the3DigitsOnTheBackOr4Digits")} required />
    <div><R.Button type="submit">{tr(locale, "pattern-payment.simulatePaymentOf2500RON")}</R.Button></div>
    <p role="status" data-sdr-pattern-result tabIndex={-1} hidden={!done}>{tr(locale, "pattern-payment.testPaymentConfirmedNoMoneyWasTaken")}</p>
  </form>;
}
