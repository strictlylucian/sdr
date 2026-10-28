import { docsUrl } from '../docs-url';
import { componentText, countText } from './support';
import { useState } from 'react';
import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';

export function EqualityInformationExample({ locale }: P) {
  const [done, setDone] = useState(false);
  return <form data-sdr-pattern-demo="equality" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <R.Fieldset legend={tr(locale, "pattern-forms.ageGroupOptional")} hint={tr(locale, "pattern-forms.anExampleMonitoringQuestionYourAnswerDoesNotAffect")}>
      <R.Radio name="age-group" value="under18" label={tr(locale, "pattern-forms.under18")} />
      <R.Radio name="age-group" value="adult" label={tr(locale, "pattern-forms.1864")} />
      <R.Radio name="age-group" value="older" label={tr(locale, "pattern-forms.65OrOlder")} />
      <R.Radio name="age-group" value="private" label={tr(locale, "pattern-forms.preferNotToSay")} />
    </R.Fieldset>
    <div><R.Button type="submit">{tr(locale, "pattern-forms.continue")}</R.Button></div>
    <p role="status" data-sdr-pattern-result tabIndex={-1} hidden={!done}>{tr(locale, "pattern-forms.exampleCompletedNoDetailsWereStored")}</p>
  </form>;
}
export function EligibilityExample({ locale }: P) {
  const [answer, setAnswer] = useState('');
  return <form data-sdr-pattern-demo="eligibility" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setAnswer(String(new FormData(form).get('resident'))); requestAnimationFrame(() => form.querySelector<HTMLElement>('[data-sdr-pattern-outcome]:not([hidden])')!.focus()); }}>
    <R.Fieldset legend={tr(locale, "pattern-forms.doYouLiveInTheAreaWhereYouAre")}>
      <R.Radio name="resident" value="yes" label={tr(locale, "pattern-forms.yes")} required />
      <R.Radio name="resident" value="no" label={tr(locale, "pattern-forms.no")} required />
    </R.Fieldset>
    <div><R.Button type="submit">{tr(locale, "pattern-forms.check")}</R.Button></div>
    <div data-sdr-pattern-outcome="yes" tabIndex={-1} hidden={answer !== 'yes'}><R.Alert tone="success" title={tr(locale, "pattern-forms.youCanContinueInThisExample")}><R.Link href={docsUrl(`/${locale}/patterns/start/`)}>{tr(locale, "pattern-forms.viewRequiredDocumentsAndSteps")}</R.Link></R.Alert></div>
    <div data-sdr-pattern-outcome="no" tabIndex={-1} hidden={answer !== 'no'}><R.Alert tone="warning" title={tr(locale, "pattern-forms.thereIsAnotherOption")}><R.Stack gap={3}><p>{tr(locale, "pattern-forms.youCanGetHelpFindingTheRightInstitution")}</p><R.Link href={docsUrl(`/${locale}/patterns/contact/`)}>{tr(locale, "pattern-forms.viewContactOptions")}</R.Link></R.Stack></R.Alert></div>
  </form>;
}
export function ValidationRecoveryExample({ locale }: P) {
  const [done, setDone] = useState(false);
  return <form data-sdr-pattern-demo="validation" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <div data-sdr-pattern-summary hidden={done}><R.ErrorSummary errors={[{ href: '#pattern-full-name', message: tr(locale, "pattern-forms.enterYourFullName") }]} title={componentText(locale, 'problem')} /></div>
    <R.TextInput id="pattern-full-name" name="full-name" label={tr(locale, "pattern-forms.fullName")} autoComplete="name" required error={done ? undefined : tr(locale, "pattern-forms.enterYourFullName")} hint={tr(locale, "pattern-forms.useAFictionalNameInThisExample")} />
    <div><R.Button type="submit">{tr(locale, "pattern-forms.continue")}</R.Button></div>
    <p role="status" data-sdr-pattern-result tabIndex={-1} hidden={!done}>{tr(locale, "pattern-forms.theExampleErrorWasCorrectedNoRealApplicationWas")}</p>
  </form>;
}
