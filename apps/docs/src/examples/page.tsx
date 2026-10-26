import { docsUrl } from '../docs-url';
import { componentText, countText } from './support';
import { useState } from 'react';
import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';

export function PageExample({ locale }: P) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <R.SkipLink href="#page-main" children={componentText(locale, 'skip')} />
      <R.SdrProvider lang={locale} theme="dark">
        <R.Header serviceName={tr(locale, "page.communityServices")} href="#page-main">
          <R.LanguageNavigation label={tr(locale, "page.language")} items={[
            { lang: 'ro', label: 'Română', href: docsUrl('/examples/ro/page.html'), current: locale === 'ro' },
            { lang: 'en', label: 'English', href: docsUrl('/examples/en/page.html'), current: locale === 'en' },
          ]} />
        </R.Header>
      </R.SdrProvider>
      <R.ServiceNavigation label={tr(locale, "page.mainNavigation")} items={[
        { label: tr(locale, "page.requestADocument"), href: '#page-main', current: true },
        { label: tr(locale, "page.requiredDocuments"), href: '#page-documents' },
        { label: tr(locale, "page.help"), href: '#page-help' },
      ]} menuLabel={componentText(locale, 'menu')} />
      <R.Container>
        <div className="sdr-u-padding-top-4">
          <R.Breadcrumbs label={tr(locale, "page.breadcrumb")} items={[
            { label: tr(locale, "page.services"), href: '#page-main' },
            { label: tr(locale, "page.requestADocument"), href: '#page-request', current: true },
          ]} />
        </div>
        <main id="page-main" tabIndex={-1} className="sdr-main-wrapper sdr-stack">
          <R.PageHeader className="sdr-u-padding-block-0" title={tr(locale, "page.requestADocument")} description={tr(locale, "page.completeTheDetailsBelowAndCheckYourInformationBefore")} />
          <R.Alert title={tr(locale, "page.demonstrationExample")}>
            {tr(locale, "page.useFictionalDetailsThisExampleDoesNotSubmitOr")}
          </R.Alert>
          <div className="sdr-grid-row">
            <section className="sdr-grid-column-two-thirds-from-desktop" id="page-request" aria-labelledby="page-request-title">
              <R.Stack>
                <h2 id="page-request-title">{tr(locale, "page.applicationDetails")}</h2>
                <form className="sdr-stack" data-sdr-page-form onSubmit={event => {
                  event.preventDefault();
                  setSubmitted(true);
                  requestAnimationFrame(() => document.getElementById('page-confirmation')?.focus());
                }}>
                  <R.TextInput id="full-name" name="full-name" label={tr(locale, "page.fullName")} autoComplete="name" required />
                  <R.TextInput id="email" name="email" label="Email" type="email" autoComplete="email" hint={tr(locale, "page.weWillUseThisAddressToContactYouAbout")} required />
                  <R.Select id="document-type" name="document-type" label={tr(locale, "page.documentType")} required defaultValue="">
                    <option value="">{tr(locale, "page.chooseADocument")}</option>
                    <option value="certificate">{tr(locale, "page.certificate")}</option>
                    <option value="copy">{tr(locale, "page.documentCopy")}</option>
                  </R.Select>
                  <R.Checkbox id="confirm-details" name="confirm-details" label={tr(locale, "page.iConfirmThatTheDetailsAreCorrect")} required />
                  <div><R.Button type="submit">{tr(locale, "page.submitApplication")}</R.Button></div>
                </form>
                <section id="page-confirmation" data-sdr-page-result hidden={!submitted} tabIndex={-1} aria-label={tr(locale, "page.demonstrationConfirmation")}>
                  <R.Panel title={tr(locale, "page.exampleCompleted")}>
                    <p>{tr(locale, "page.yourDetailsWereCheckedInTheBrowserNoInformation")}</p>
                  </R.Panel>
                </section>
              </R.Stack>
            </section>
            <aside className="sdr-grid-column-one-third-from-desktop sdr-stack" aria-label={tr(locale, "page.serviceInformation")}>
              <R.Card title={tr(locale, "page.beforeYouStart")}>
                <R.Stack gap={3}>
                  <p>{tr(locale, "page.inARealServiceThisSectionExplainsEligibilityCost")}</p>
                  <R.Cluster><R.Tag>{tr(locale, "page.demonstration")}</R.Tag></R.Cluster>
                </R.Stack>
              </R.Card>
              <section id="page-documents" aria-labelledby="page-documents-title">
                <R.Stack gap={3}>
                  <h2 id="page-documents-title" className="sdr-heading-md">{tr(locale, "page.requiredDocuments")}</h2>
                  <ul>
                    <li>{tr(locale, "page.theApplicantSIdentityDocument")}</li>
                    <li>{tr(locale, "page.theOriginalDocumentIfYouAreRequestingACopy")}</li>
                    <li>{tr(locale, "page.authorisationIfYouAreApplyingOnSomeoneElseS")}</li>
                  </ul>
                </R.Stack>
              </section>
            </aside>
          </div>
        </main>
      </R.Container>
      <R.Footer className="sdr-u-padding-inline-0">
        <R.Container>
          <R.Stack gap={3}>
            <h2 id="page-help" className="sdr-heading-sm">{tr(locale, "page.needHelp")}</h2>
            <p>{tr(locale, "page.aRealServiceProvidesContactDetailsOpeningHoursAnd")}</p>
            <R.Cluster>
              <R.Link href={docsUrl(`/${locale}/accessibility/`)}>{tr(locale, "page.accessibility")}</R.Link>
              <R.Link href={docsUrl(`/${locale}/patterns/cookies/`)}>{tr(locale, "page.cookies")}</R.Link>
            </R.Cluster>
            <p>{tr(locale, "page.sdrIndependentProposalExampleWithFictionalData")}</p>
          </R.Stack>
        </R.Container>
      </R.Footer>
    </>
  );
}
