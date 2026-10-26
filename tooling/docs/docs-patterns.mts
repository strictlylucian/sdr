import { uiText } from '../../apps/docs/src/i18n/messages';
import { patterns, patternEntries } from '../../catalog/patterns';
import { patternHref, patternExampleSlug } from '../../catalog/pattern-navigation';
import { prunePages } from './prune-pages.mts';
import { writePortablePage } from './doc-examples.mts';

type Locale = 'ro' | 'en';
type WritePage = (locale: Locale, path: string, title: string, content: string, sidebar?: { hidden?: boolean; order?: number }) => Promise<void>;
export async function writePatternDocs(locale: Locale, writePage: WritePage, sourceTabs: (name: string) => Promise<string>, imports: string) {
  const ordered = [...patterns].sort((a,b) => new Intl.Collator(locale).compare(a.title[locale],b.title[locale]));
  const links = ordered.map(item => `- [${item.title[locale]}](${patternHref(item.slug, locale)})${item.variants.map(variant => `\n  - [${variant.title[locale]}](${patternHref(variant.slug,locale)})`).join('')}`).join('\n');
  await writePage(locale, 'patterns/index', uiText(locale, "docs-patterns.servicePatterns"), `${uiText(locale, "docs-patterns.patternsCombineComponentsForSpecificTasksVariantsShare")}\n\n${links}`, { hidden: true });
  for (const item of ordered) {
    const scenario = async (entry: typeof patternEntries[number], variant: boolean) => `
${variant ? `<div id="variant-${entry.slug}" className="sdr-component-variant">` : ''}

## ${item.variants.length ? entry.title[locale] : uiText(locale, "docs-patterns.example")}

${entry.guidance[locale]}

<Preview name="${entry.example}" locale="${locale}" />

${await sourceTabs(entry.example)}

[${uiText(locale, "docs-patterns.openThePortableExample")}](/examples/${locale}/${patternExampleSlug(entry.slug)}.html)

${variant ? '</div>' : ''}
`;
    const primary = patternEntries.find(entry => entry.slug === item.primarySlug);
    if (!primary) throw new Error('Pattern primary example missing: ' + item.slug);
    const overview = item.variants.length ? uiText(locale, "docs-patterns.thisPageGroupsRelatedScenariosWithinOnePattern") : '';
    await writePage(locale, 'patterns/' + item.slug, item.title[locale], `
${imports}

${overview}
${await scenario(primary, false)}
${(await Promise.all(item.variants.map(variant => scenario(variant,true)))).join('\n')}

## ${uiText(locale, "docs-patterns.serviceIntegration")}

${uiText(locale, "docs-patterns.examplesUseLibraryComponentsServerValidationMessagingPayment")} [${uiText(locale, "docs-patterns.getStarted")}](/${locale}/getting-started/). ${uiText(locale, "docs-patterns.accessibilityDetailsAreIn")} [${uiText(locale, "docs-patterns.theAccessibilityGuide")}](/${locale}/accessibility/).
`);
  }
  await prunePages('apps/docs/src/content/docs/' + locale + '/patterns', ['index', ...patterns.map(item => item.slug)], '.mdx');
  for (const item of patternEntries) {
    await writePortablePage(item.example, patternExampleSlug(item.slug), locale);
  }
}
