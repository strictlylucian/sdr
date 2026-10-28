import { docsUrl } from '../docs-url';
import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';
export function CardExample({ locale }: P) { return <R.Card title={tr(locale, "layout.localServices")} footer={<R.Link href={docsUrl(`/${locale}/patterns/start/`)}>{tr(locale, "layout.viewTheSteps")}</R.Link>}>{tr(locale, "layout.findTheInformationAndDocumentsYouNeed")}</R.Card>; }
export function HeroExample({ locale }: P) { return <R.Hero kicker="SDR · Propunere / Proposal" title={tr(locale, "layout.clearerServicesForEveryone")} description={tr(locale, "layout.aSharedLanguageForRomanianDigitalExperiences")}><R.ButtonLink href={docsUrl(`/${locale}/getting-started/`)}>{tr(locale, "layout.exploreSDR")}</R.ButtonLink></R.Hero>; }
export function PageHeaderExample({ locale }: P) { return <R.PageHeader title={tr(locale, "layout.yourApplications")} description={tr(locale, "layout.trackProgressAndContinueWhereYouLeftOff")} />; }
export function InsetTextExample({ locale }: P) { return <R.InsetText>{tr(locale, "layout.keepYourReferenceNumber")}</R.InsetText>; }
export function DividerExample({ locale }: P) { return <R.Stack><p>{tr(locale, "layout.personalDetails")}</p><R.Divider /><p>{tr(locale, "layout.contactDetails")}</p></R.Stack>; }
export function MotifExample({ locale }: P) {
  return <R.Stack gap={5}>
    <R.Stack gap={2}><R.Text size="xs">{tr(locale, "layout.small24px")}</R.Text><R.Motif size="sm" /></R.Stack>
    <R.Stack gap={2}><R.Text size="xs">{tr(locale, "layout.medium48pxDefault")}</R.Text><R.Motif /></R.Stack>
    <R.Stack gap={2}><R.Text size="xs">{tr(locale, "layout.large64px")}</R.Text><R.Motif size="lg" /></R.Stack>
    <R.Stack gap={2}><R.Text size="xs">{tr(locale, "layout.extraLarge96px")}</R.Text><R.Motif size="xl" /></R.Stack>
  </R.Stack>;
}
export function HeadingExample({ locale }: P) { return <R.Stack><R.Heading level={2}>{tr(locale, "layout.aSharedLanguage")}</R.Heading><R.Heading level={3}>{tr(locale, "layout.clarityInEveryDetail")}</R.Heading><R.Heading level={4}>{tr(locale, "layout.knowledgeTrustAccessibility")}</R.Heading></R.Stack>; }
export function TextExample({ locale }: P) { return <R.Stack><R.Text size="lg">{tr(locale, "layout.digitalServicesForEveryone")}</R.Text><R.Text>{tr(locale, "layout.romanianDiacriticsArePreservedBraOvIaIT")}</R.Text><R.Text size="xs">{tr(locale, "layout.supportingInformationAtAReadableSize")}</R.Text></R.Stack>; }
export function ProseExample({ locale }: P) { return <R.Prose><h2>{tr(locale, "layout.beforeYouStart")}</h2><p>{tr(locale, "layout.prepareTheDocumentsRequiredByTheServiceYouCan")}</p><ul><li>{tr(locale, "layout.checkEligibility")}</li><li>{tr(locale, "layout.haveAnEmailAddressReady")}</li></ul></R.Prose>; }
export function GridExample({ locale }: P) { return <R.Grid columns={2}><R.Card title={tr(locale, "layout.individuals")}>{tr(locale, "layout.servicesForYouAndYourFamily")}</R.Card><R.Card title={tr(locale, "layout.organisations")}>{tr(locale, "layout.servicesForCommunitiesAndOrganisations")}</R.Card></R.Grid>; }
export function StackExample({ locale }: P) { return <R.Stack gap={5}><R.Text>{tr(locale, "layout.oneGroupOneRhythm")}</R.Text><R.Text>{tr(locale, "layout.spacingComesFromToken524PxAt16")}</R.Text></R.Stack>; }
export function ClusterExample({ locale }: P) { return <R.Cluster><R.Button>{tr(locale, "layout.continue")}</R.Button><R.Button variant="secondary">{tr(locale, "layout.saveForLater")}</R.Button></R.Cluster>; }
export function ContainerExample({ locale }: P) { return <R.Container><R.InsetText>{tr(locale, "layout.consistentGuttersAtEveryWidth")}</R.InsetText></R.Container>; }
export function SectionExample({ locale }: P) { return <R.Section aria-label={tr(locale, "layout.sectionExample")}><R.Text>{tr(locale, "layout.verticalSpacingFromTheSectionToken")}</R.Text></R.Section>; }
export function SidebarLayoutExample({ locale }: P) { return <R.SidebarLayout sidebar={<R.SideNavigation label={tr(locale, "layout.sections")} items={[{ label: tr(locale, "layout.overview"), href: '#overview', current: true }]} />}><R.Text>{tr(locale, "layout.onNarrowScreensNavigationPrecedesTheContent")}</R.Text></R.SidebarLayout>; }
