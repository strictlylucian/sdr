import { writeGenerated } from './write-generated.mts';
import { uiText } from '../../apps/docs/src/i18n/messages';
import { mkdir } from 'node:fs/promises';
import { guidesEn } from '../../catalog/guides-en';
import { guidesRo } from '../../catalog/guides-ro';
import { orderedComponents } from '../../catalog/components';
import { componentVariants } from '../../catalog/component-variants';
import { componentHref } from '../../catalog/component-navigation';
import { patterns } from '../../catalog/patterns';
import { formatGuide } from './format-example.mts';
import { layoutGuide } from '../../catalog/layout-guide';
import { portableCountSnippet } from './portable-count-snippet.mts';
const root = 'apps/docs/src/content/docs';
for (const locale of ['ro', 'en'] as const) {
  const ro = locale === 'ro';
  const guides = { ...(ro ? guidesRo : guidesEn) };
  guides['getting-started'] = { ...guides['getting-started'], body: guides['getting-started'].body.replace('PORTABLE_COUNT_EXAMPLE', portableCountSnippet(locale)) };
  guides['foundations/spacing'] = { ...guides['foundations/spacing'], body: guides['foundations/spacing'].body + layoutGuide(locale) };
  guides['foundations/themes'] = { ...guides['foundations/themes'], body: guides['foundations/themes'].body + `
## ${uiText(locale, "docs-guides.flagColours")}

${uiText(locale, "docs-guides.theHeaderIdentityUsesTheRomanianFlagRGB")}

| Token | Hex | ${uiText(locale, "docs-guides.role")} |
|---|---|---|
| --sdr-flag-blue | #002B7F | ${uiText(locale, "docs-guides.headerBackground")} |
| --sdr-flag-yellow | #FCD116 | ${uiText(locale, "docs-guides.focusAndPressedStates")} |
| --sdr-flag-red | #CE1126 | ${uiText(locale, "docs-guides.headerRule")} |

${uiText(locale, "docs-guides.theValuesAreDefinedIn")} [${uiText(locale, "docs-guides.theAnnexToLaw1762023")}](https://legislatie.just.ro/public/DetaliiDocument/271454). ${uiText(locale, "docs-guides.theFlagColoursExportFromSdrCoreExposesThe")}

${uiText(locale, "docs-guides.buttonsUseFlagYellowForKeyboardFocusAnd")}
` };
  guides.coverage = {
    title: uiText(locale, "docs-guides.featuresAndImplementationStatus"),
    body: `${uiText(locale, "docs-guides.statusReviewedOn25October2026AllComponents")}

## ${uiText(locale, "docs-guides.library")}

${orderedComponents(locale).length} ${uiText(locale, "docs-guides.documentedComponentsAndExamplesWithVariantsIncludedOn")}

| ${uiText(locale, "docs-guides.component")} | ${uiText(locale, "docs-guides.purpose")} |
|---|---|
${orderedComponents(locale).map(item => `| [${item.title[locale]}](${componentHref(item.name, locale)}) | ${item.description[locale]} |${componentVariants.filter(variant => variant.parent === item.name).map(variant => '\n| ↳ [' + variant.title[locale] + '](' + componentHref(variant.name, locale) + ') | ' + (uiText(locale, "docs-guides.variant")) + ' · ' + item.title[locale] + ' |').join('')}`).join('\n')}

## ${uiText(locale, "docs-guides.servicePatterns")}

${patterns.length} ${uiText(locale, "docs-guides.patternsCoverQuestionsValidationNavigationDocumentsCheckingAnswers")}

${uiText(locale, "docs-guides.variantsAreGroupedWithinTheirParentPatternsWith")}

## ${uiText(locale, "docs-guides.knownBoundaries")}

${uiText(locale, "docs-guides.thereIsNoEditableOrVirtualisedGridCustom")}
`,
  };
  for (const [path, guide] of Object.entries(guides)) {
    const target = `${root}/${locale}/${path}.mdx`;
    await mkdir(target.slice(0, target.lastIndexOf('/')), { recursive: true });
    await writeGenerated(target, `---\ntitle: ${JSON.stringify(guide.title)}\ndescription: ${JSON.stringify(`${guide.title} — SDR. ${uiText(locale, "docs-guides.independentProposal")}`)}\n---\n${await formatGuide(guide.body)}\n`);
  }
  await writeGenerated(`${root}/${locale}/index.mdx`, `---
title: ${uiText(locale, "docs-guides.romanianDesignSystem")}
description: ${uiText(locale, "docs-guides.componentsPatternsAndGuidanceForRomanianDigitalServices")}
template: splash
hero:
  title: SDR
---
import Identity from '../../../components/Identity.astro';

<Identity locale="${locale}" />
`);
}
