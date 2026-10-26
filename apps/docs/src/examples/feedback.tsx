import { docsUrl } from '../docs-url';
import { componentText, countText } from './support';
import { useState } from 'react';
import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';
export function AlertExample({ locale }: P) { return <R.Stack><R.Alert title={tr(locale, "feedback.documentsReceived")} tone="success">{tr(locale, "feedback.youCanCheckYourApplicationStatusInYourAccount")}</R.Alert><R.Alert title={tr(locale, "feedback.checkTheDeadline")} tone="warning">{tr(locale, "feedback.submitYourApplicationByTheDateShownInThe")}</R.Alert></R.Stack>; }
export function NotificationBannerExample({ locale }: P) { return <R.NotificationBanner title={tr(locale, "feedback.serviceUpdated")}>{tr(locale, "feedback.youCanContinueYourSavedApplication")}</R.NotificationBanner>; }
export function ErrorMessageExample({ locale }: P) { return <R.TextInput label="Email" type="email" name="invalid-email" defaultValue="alex@" error={tr(locale, "feedback.enterACompleteEmailAddressForExampleNameExample")} />; }
export function ErrorSummaryExample({ locale }: P) { return <R.Stack><R.ErrorSummary errors={[{ href: '#example-name-error', message: tr(locale, "feedback.enterYourFullName") }]} title={componentText(locale, 'problem')} /><R.TextInput id="example-name-error" label={tr(locale, "feedback.fullName")} name="error-name" error={tr(locale, "feedback.enterYourFullName")} /></R.Stack>; }
export function TagExample({ locale }: P) { return <R.Cluster><R.Tag tone="success">{tr(locale, "feedback.approved")}</R.Tag><R.Tag tone="warning">{tr(locale, "feedback.underReview")}</R.Tag><R.Tag tone="danger">{tr(locale, "feedback.changesRequired")}</R.Tag></R.Cluster>; }
export function BadgeExample({ locale }: P) { return <p>{tr(locale, "feedback.unreadMessages")} <R.Badge>3</R.Badge></p>; }
export function ChipExample({ locale }: P) { return <R.Cluster><R.Chip>Brașov</R.Chip><R.Chip>{tr(locale, "feedback.localServices")}</R.Chip></R.Cluster>; }
export function WarningTextExample({ locale }: P) { return <R.WarningText>{tr(locale, "feedback.afterSubmittingYouCannotChangeTheDocumentsInThis")}</R.WarningText>; }
export function PhaseBannerExample({ locale }: P) { return <R.PhaseBanner phase="Propunere / Proposal">{tr(locale, "feedback.anIndependentInitiativeUnderDevelopment")}</R.PhaseBanner>; }
export function ClassificationBannerExample({ locale }: P) { return <R.ClassificationBanner>{tr(locale, "feedback.demonstrationFictionalData")}</R.ClassificationBanner>; }
export function PanelExample({ locale }: P) { return <R.Panel title={tr(locale, "feedback.applicationSubmitted")}><p>{tr(locale, "feedback.referenceNumber")}: <strong>SDR-2026-0042</strong></p></R.Panel>; }
export function EmptyStateExample({ locale }: P) { return <R.EmptyState title={tr(locale, "feedback.noSavedApplications")} action={<R.ButtonLink href={docsUrl(`/${locale}/patterns/start/`)}>{tr(locale, "feedback.startAnApplication")}</R.ButtonLink>}>{tr(locale, "feedback.applicationsYouStartWillAppearHere")}</R.EmptyState>; }
export function LoadingIndicatorExample({ locale }: P) { return <R.LoadingIndicator label={tr(locale, "feedback.checkingDocuments")} />; }
export function SkeletonExample({ locale }: P) { return <R.Skeleton label={tr(locale, "feedback.loadingApplications")} />; }
export function ProgressExample({ locale }: P) { return <R.Progress label={tr(locale, "feedback.documentUpload60")} value={60} />; }
export function ToastExample({ locale }: P) {
  const [show, setShow] = useState(false);
  const [generation, setGeneration] = useState(0);
  return <R.Stack>
    <R.Button id="toast-trigger" data-sdr-toast-show onClick={() => { setGeneration(value => value + 1); setShow(true); }}>{tr(locale, "feedback.showConfirmation")}</R.Button>
    <div hidden={!show} style={{ display: show ? 'contents' : undefined }} data-sdr-toast-example><R.Toast key={generation} returnFocusId="toast-trigger" closeLabel={componentText(locale, 'close')}>{tr(locale, "feedback.changesSaved")}</R.Toast></div>
  </R.Stack>;
}
export function CookieBannerExample({ locale }: P) { const [choice, setChoice] = useState(''); return <R.Stack>{!choice && <R.CookieBanner title={tr(locale, "feedback.cookiePreferences")} acceptLabel={tr(locale, "feedback.acceptAnalytics")} rejectLabel={tr(locale, "feedback.rejectAnalytics")} onAccept={() => setChoice(tr(locale, "feedback.analyticsAcceptedInThisDemonstration"))} onReject={() => setChoice(tr(locale, "feedback.analyticsRejectedInThisDemonstration"))}>{tr(locale, "feedback.optionalCookiesRemainOffUntilYouChoose")}</R.CookieBanner>}<p role="status" hidden={!choice}>{choice}</p></R.Stack>; }
export function FeedbackExample({ locale }: P) { const [answered, setAnswered] = useState(false); return <R.Stack><R.Feedback question={tr(locale, "feedback.wasThisPageHelpful")} yesLabel={tr(locale, "feedback.yes")} noLabel={tr(locale, "feedback.no")} onAnswer={() => setAnswered(true)} /><p role="status">{answered && tr(locale, "feedback.thankYouForYourFeedback")}</p></R.Stack>; }
