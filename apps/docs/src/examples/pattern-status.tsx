import { docsUrl } from '../docs-url';
import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';

export function ServiceUnavailableExample({ locale }: P) {
  return <R.ServiceStatusPage title={tr(locale, "pattern-status.theServiceIsUndergoingMaintenance")} returnHref={docsUrl(`/${locale}/patterns/start/`)} returnLabel={tr(locale, "pattern-status.returnToTheServicePage")}>
    <p>{tr(locale, "pattern-status.inThisScenarioTheServiceIsClosedForPlanned")}</p>
    <p>{tr(locale, "pattern-status.ifYourRequestIsUrgentYouCanUseAnother")} <R.Link href={docsUrl(`/${locale}/patterns/contact/`)}>{tr(locale, "pattern-status.viewSupportOptions")}</R.Link></p>
  </R.ServiceStatusPage>;
}
export function PageNotFoundExample({ locale }: P) {
  return <R.ServiceStatusPage title={tr(locale, "pattern-status.pageNotFound")} returnHref={docsUrl(`/${locale}/patterns/start/`)} returnLabel={tr(locale, "pattern-status.goToTheServicePage")}>
    <p>{tr(locale, "pattern-status.checkThatTheAddressIsCompleteAndCorrectIf")}</p>
    <p><R.Link href={docsUrl(`/${locale}/patterns/contact/`)}>{tr(locale, "pattern-status.getHelpFindingTheInformation")}</R.Link></p>
  </R.ServiceStatusPage>;
}
export function ServiceProblemExample({ locale }: P) {
  return <R.ServiceStatusPage title={tr(locale, "pattern-status.weCouldNotSubmitYourApplication")} returnHref={docsUrl(`/${locale}/patterns/question/`)} returnLabel={tr(locale, "pattern-status.returnToTheForm")}>
    <p>{tr(locale, "pattern-status.thereWasATechnicalProblemYourApplicationWasNot")}</p>
    <p>{tr(locale, "pattern-status.ifTheProblemContinues")} <R.Link href={docsUrl(`/${locale}/patterns/contact/`)}>{tr(locale, "pattern-status.contactTheServiceTeam")}</R.Link>.</p>
  </R.ServiceStatusPage>;
}
export function SessionExpiredExample({ locale }: P) {
  return <R.ServiceStatusPage title={tr(locale, "pattern-status.yourSessionHasEnded")} returnHref={docsUrl(`/${locale}/patterns/tasks/#variant-resume`)} returnLabel={tr(locale, "pattern-status.seeHowToReturnToYourApplication")}>
    <p>{tr(locale, "pattern-status.aSessionEndsAfterInactivityToProtectPersonalInformation")}</p>
    <p>{tr(locale, "pattern-status.ifYouSavedYourApplicationYouCanReturnTo")} <R.Link href={docsUrl(`/${locale}/patterns/start/`)}>{tr(locale, "pattern-status.startANewApplication")}</R.Link></p>
  </R.ServiceStatusPage>;
}
export function ContactSupportExample({ locale }: P) {
  return <R.Stack><h3>{tr(locale, "pattern-status.doYouNeedHelpWithYourApplication")}</h3>
    <R.SummaryList items={[{ key: 'Email', value: 'ajutor@example.invalid' }, { key: tr(locale, "pattern-status.openingHours"), value: tr(locale, "pattern-status.mondayToFriday09001700") }, { key: tr(locale, "pattern-status.responseTime"), value: tr(locale, "pattern-status.within2WorkingDays") }]} />
    <p>{tr(locale, "pattern-status.includeYourApplicationReferenceIfYouHaveOneDo")}</p>
  </R.Stack>;
}
export function AssistedSupportExample({ locale }: P) {
  return <R.Stack><h3>{tr(locale, "pattern-status.helpCompletingTheOnlineForm")}</h3>
    <p>{tr(locale, "pattern-status.youCanGetHelpAtAServiceDeskIf")}</p>
    <R.SummaryList items={[{ key: tr(locale, "pattern-status.exampleLocation"), value: tr(locale, "pattern-status.serviceCentre1ExampleStreet") }, { key: tr(locale, "pattern-status.openingHours"), value: tr(locale, "pattern-status.mondayToFriday09001700") }, { key: tr(locale, "pattern-status.cost"), value: tr(locale, "pattern-status.freeSupport") }]} />
  </R.Stack>;
}
