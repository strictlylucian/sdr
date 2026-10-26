import { docsUrl } from '../docs-url';
import { componentText, countText } from './support';
import { useState } from 'react';
import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';

export function AccountCreationExample({ locale }: P) {
  const [done, setDone] = useState(false);
  return <form data-sdr-pattern-demo="account" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <h3>{tr(locale, "pattern-account.createAnAccountForYourApplications")}</h3>
    <R.InsetText>{tr(locale, "pattern-account.demonstrationAccountUseFictionalDetailsNoRealAccountIs")}</R.InsetText>
    <R.TextInput label="Email" type="email" autoComplete="username" name="account-email" required />
    <R.PasswordCreationFields required showLabel={componentText(locale, 'show')} hideLabel={componentText(locale, 'hide')} label={componentText(locale, 'patterns.chooseAPassword')} hint={componentText(locale, 'patterns.useAUniquePasswordAPasswordManagerCanHelp')} />
    <div><R.Button type="submit">{tr(locale, "pattern-account.simulateAccountCreation")}</R.Button></div>
    <p role="status" data-sdr-pattern-result tabIndex={-1} hidden={!done}>{tr(locale, "pattern-account.exampleCompletedNoAccountsWereCreatedAndNoPasswords")}</p>
  </form>;
}
export function UsernameCreationExample({ locale }: P) {
  const [done, setDone] = useState(false);
  return <form data-sdr-pattern-demo="username" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <R.TextInput label={tr(locale, "pattern-account.username")} name="new-username" autoComplete="username" required hint={tr(locale, "pattern-account.chooseATestUsernameALiveServiceChecksAvailability")} />
    <div><R.Button type="submit">{tr(locale, "pattern-account.continue")}</R.Button></div>
    <p role="status" data-sdr-pattern-result tabIndex={-1} hidden={!done}>{tr(locale, "pattern-account.exampleCompletedTheUsernameWasNotRegistered")}</p>
  </form>;
}
export function TaskProgressExample({ locale }: P) {
  return <R.Stack><h3>{tr(locale, "pattern-account.prepareYourApplication")}</h3>
    <R.TaskList label={tr(locale, "pattern-account.applicationTasks")} items={[
      { title: tr(locale, "pattern-account.personalDetails"), href: docsUrl(`/${locale}/patterns/question/`), status: tr(locale, "pattern-account.completed"), tone: 'success' },
      { title: tr(locale, "pattern-account.documents"), href: docsUrl(`/${locale}/patterns/uploads/`), status: tr(locale, "pattern-account.inProgress"), tone: 'warning' },
      { title: tr(locale, "pattern-account.checkAndSubmit"), status: tr(locale, "pattern-account.completeTheDocumentsFirst") },
    ]} />
    <p>{tr(locale, "pattern-account.linksOpenTheCorrespondingStepExamplesTheTaskStatuses")}</p>
  </R.Stack>;
}
export function SaveReturnExample({ locale }: P) {
  const [done, setDone] = useState(false);
  return <form data-sdr-pattern-demo="resume" className="sdr-stack" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; setDone(true); requestAnimationFrame(() => form.closest('[data-sdr-pattern-demo]')!.querySelector<HTMLElement>('[data-sdr-pattern-result]')!.focus()); }}>
    <h3>{tr(locale, "pattern-account.continueLater")}</h3>
    <R.TextInput id="saved-example-name" name="saved-name" label={tr(locale, "pattern-account.testName")} defaultValue="Ana Șerban" autoComplete="off" />
    <div><R.Button type="submit">{tr(locale, "pattern-account.saveForLater")}</R.Button></div>
    <div data-sdr-pattern-result tabIndex={-1} hidden={!done}><R.Alert tone="success" title={tr(locale, "pattern-account.theExampleIsReadyToResume")}>
      <R.Stack gap={3}><p>{tr(locale, "pattern-account.detailsRemainOnlyOnThisPageTheyAreNot")}</p>
      <R.Link href="#saved-example-name">{tr(locale, "pattern-account.continueEditing")}</R.Link></R.Stack>
    </R.Alert></div>
  </form>;
}
