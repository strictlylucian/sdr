import { docsUrl } from '../docs-url';
import { useState } from 'react';
import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';

export function PhoneNumberExample({ locale }: P) {
  const [done, setDone] = useState(false);
  return <form data-sdr-pattern-demo="phone" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <h3>{tr(locale, "pattern-contact.whichNumberCanWeContactYouOn")}</h3>
    <R.TextInput label={tr(locale, "pattern-contact.phoneNumber")} type="tel" name="phone" autoComplete="tel" required hint={tr(locale, "pattern-contact.weWillOnlyCallAboutYourApplicationIncludeThe")} />
    <div><R.Button type="submit">{tr(locale, "pattern-contact.continue")}</R.Button></div>
    <R.Link href={docsUrl(`/${locale}/patterns/contact-details/#variant-email`)}>{tr(locale, "pattern-contact.iPreferAnEmailResponse")}</R.Link>
    <p role="status" data-sdr-pattern-result tabIndex={-1} hidden={!done}>{tr(locale, "pattern-contact.exampleCompletedNoPhoneNumberWasStoredAndNo")}</p>
  </form>;
}
export function EmailAddressExample({ locale }: P) {
  const [done, setDone] = useState(false);
  return <form data-sdr-pattern-demo="email" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <h3>{tr(locale, "pattern-contact.whereShouldWeSendYourResponse")}</h3>
    <R.TextInput label={tr(locale, "pattern-contact.emailAddress")} name="email-address" type="email" autoComplete="email" required spellCheck={false} hint={tr(locale, "pattern-contact.useATestAddressForExampleAnaExampleInvalid")} />
    <div><R.Button type="submit">{tr(locale, "pattern-contact.continue")}</R.Button></div>
    <p role="status" data-sdr-pattern-result tabIndex={-1} hidden={!done}>{tr(locale, "pattern-contact.exampleCompletedNoEmailWasSent")}</p>
  </form>;
}
export function PhoneConfirmationExample({ locale }: P) {
  const [done, setDone] = useState(false);
  return <form data-sdr-pattern-demo="phone-code" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <h3>{tr(locale, "pattern-contact.enterTheCodeFromYourTextMessage")}</h3>
    <R.TextInput label={tr(locale, "pattern-contact.securityCode")} name="security-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="123456" title={tr(locale, "pattern-contact.theTestCodeIs123456")} required />
    <div><R.Button type="submit">{tr(locale, "pattern-contact.verifyNumber")}</R.Button></div>
    <R.Details summary={tr(locale, "pattern-contact.haveYouNotReceivedACode")}>{tr(locale, "pattern-contact.thisExampleDoesNotSendATextMessageUse")}</R.Details>
    <p role="status" data-sdr-pattern-result tabIndex={-1} hidden={!done}>{tr(locale, "pattern-contact.theTestCodeIsCorrectNoRealNumberWas")}</p>
  </form>;
}
export function EmailConfirmationExample({ locale }: P) {
  const [done, setDone] = useState(false);
  return <form data-sdr-pattern-demo="email-confirm" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <h3>{tr(locale, "pattern-contact.checkYourEmailAddress")}</h3>
    <p>{tr(locale, "pattern-contact.inALiveServiceTheConfirmationLinkIsSent")} <strong>ana@example.invalid</strong>.</p>
    <div><R.Button type="submit">{tr(locale, "pattern-contact.simulateConfirmation")}</R.Button></div>
    <p role="status" data-sdr-pattern-result tabIndex={-1} hidden={!done}>{tr(locale, "pattern-contact.testConfirmationSucceededYouCanContinueYourApplication")}</p>
  </form>;
}
