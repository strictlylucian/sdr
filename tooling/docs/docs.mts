import { writeFormStudies } from './docs-form-studies.mts';
import { formStudies } from '../../apps/docs/src/studies/forms';
import { writeGenerated } from './write-generated.mts';
import { uiText } from '../../apps/docs/src/i18n/messages';
import { mkdir } from 'node:fs/promises';
import { components, orderedComponents } from '../../catalog/components';
import { componentVariants } from '../../catalog/component-variants';
import { componentHref } from '../../catalog/component-navigation';
import { patterns, patternEntries } from '../../catalog/patterns';
import { patternHref, patternExampleSlug } from '../../catalog/pattern-navigation';
import { prunePages } from './prune-pages.mts';
import { writePatternDocs } from './docs-patterns.mts';
import { readExamples, exampleHtml, writePortablePage } from './doc-examples.mts';
import { readApi } from './api.mts';
import { formatExample } from './format-example.mts';
import states from '../../catalog/data/component-states.json';
import './docs-guides.mts';
const snippets = await readExamples();
const api = readApi();
const root = 'apps/docs/src/content/docs';
const code = (language: string, content: string) => `\n~~~${language}\n${content}\n~~~\n`;
const safe = (text: string) => text.replaceAll('|', '\\|').replaceAll('\n', ' ');
const inline = (text: string) => String.fromCharCode(96) + safe(text) + String.fromCharCode(96);
function apiTable(name: string, locale: 'ro' | 'en') {
  const ro = locale === 'ro';
  const props = api[name] ?? [];
  return props.length ? `| ${uiText(locale, "docs.property")} | ${uiText(locale, "docs.type")} | ${uiText(locale, "docs.required")} |\n|---|---|---|\n${props.map(prop => `| ${inline(prop.name)} | ${inline(prop.type)} | ${prop.required ? (uiText(locale, "docs.yes")) : (uiText(locale, "docs.no"))} |`).join('\n')}` : (uiText(locale, "docs.acceptsHTMLAttributesForItsNativeElementSee"));
}
async function page(locale: string, path: string, title: string, content: string, sidebar?: { order?: number; hidden?: boolean }) {
  const target = `${root}/${locale}/${path}.mdx`;
  await mkdir(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  await writeGenerated(target, `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(`${title} — SDR. ${uiText(locale, "docs.independentProposal")}`)}\n${sidebar ? `sidebar: ${JSON.stringify(sidebar)}\n` : ''}---\n${content}\n`);
}
for (const locale of ['ro', 'en'] as const) {
  const ordered = orderedComponents(locale);
  const sourceTabs = async (name: string) => `
<div className="sdr-example-code">
<Tabs>
<TabItem label="React">

${code('tsx', snippets[locale][name])}
</TabItem>
<TabItem label="HTML">

${code('html', await formatExample(exampleHtml(name, locale), 'html'))}
[${uiText(locale, "docs.initialSetup")}](/${locale}/getting-started/)

</TabItem>
</Tabs>
</div>
`;
  const controlStates = async (name: string, nested = false) => (await Promise.all(states.filter(item => item.component === name).map(async state => {
    const copy = {
      error: { title: 'docs.errorState', guidance: 'docs.errorStateGuidance' },
      disabled: { title: 'docs.disabledState', guidance: 'docs.disabledStateGuidance' },
      readOnly: { title: 'docs.readOnlyState', guidance: 'docs.readOnlyStateGuidance' },
    } as const;
    const key = state.state as keyof typeof copy;
    if (!Object.hasOwn(copy, key)) throw new Error('Unknown form state: ' + state.state);
    const guidance = state.native ? copy[key].guidance : 'docs.staticStateGuidance';
    return `\n${nested ? '###' : '##'} ${uiText(locale, copy[key].title)}\n\n${uiText(locale, guidance)}\n\n<Preview name="${state.example}" locale="${locale}" />\n\n${await sourceTabs(state.example)}\n\n[${uiText(locale, 'docs.openThePortableExample')}](/examples/${locale}/${state.slug}.html)\n`;
  }))).join('\n');
  const imports = `import Preview from '../../../../components/Preview.astro';\nimport { Tabs, TabItem } from '@astrojs/starlight/components';`;
  const index = ordered.map(item => `- [${item.title[locale]}](${componentHref(item.name, locale)}) — ${item.description[locale]}${componentVariants.filter(variant => variant.parent === item.name).map(variant => '\n  - [' + variant.title[locale] + '](' + componentHref(variant.name, locale) + ')').join('')}`).join('\n');
  await page(locale, 'components/index', uiText(locale, "docs.components"), `${ordered.length} ${uiText(locale, "docs.documentedComponentsAndExamplesIncludingVariantsAndReact")}\n\n${index}`, { hidden: true });
  for (const [position, item] of ordered.entries()) {
    if (!snippets[locale][item.name]) throw new Error(`Missing source example ${item.name}`);
    const table = apiTable(item.name, locale);
    const variants = await Promise.all(componentVariants.filter(variant => variant.parent === item.name).map(async variant => `
<div id="${variant.anchor[locale]}" className="sdr-component-variant">

## ${variant.title[locale]}

${variant.guidance[locale]}

<Preview name="${variant.name}" locale="${locale}" />

${await sourceTabs(variant.name)}

[${uiText(locale, "docs.openThePortableVariant")}](/examples/${locale}/${components.find(component => component.name === variant.name)!.slug}.html)

${await controlStates(variant.name, true)}

### API · ${variant.apiName ?? variant.name}

${apiTable(variant.apiName ?? variant.name, locale)}

</div>
`));
    await page(locale, `components/${item.slug}`, item.title[locale], `
${imports}

${item.description[locale]}

## ${uiText(locale, "docs.example")}

<Preview name="${item.name}" locale="${locale}" />

${await sourceTabs(item.name)}

[${uiText(locale, "docs.openThePortableExample")}](/examples/${locale}/${item.slug}.html)

${await controlStates(item.name)}

## ${uiText(locale, "docs.usage")}

${item.caution[locale]}

${item.name === 'Header' ? `${uiText(locale, "docs.theEmblemIsOptionalOmittingItLeavesNo")}
${code('tsx', await formatExample('<R.Header serviceName="Servicii pentru comunitate" emblem={<img src="/institution-emblem.svg" alt="" width={48} height={48} />} />', 'tsx'))}` : ''}

## ${item.name === 'Page' ? uiText(locale, "docs.composition") : 'API'}

${item.name === 'Page' ? uiText(locale, "docs.pageIsACompleteExampleRatherThanA") : table}

${uiText(locale, "docs.nativeHTMLAriaAndDataAttributesAreAvailable")}

${variants.join('\n')}

## ${uiText(locale, "docs.accessibility")}

${uiText(locale, "docs.compositionAccessibilityDependsOnLabelsElementSemanticsFocus")} [${uiText(locale, "docs.theAccessibilityGuide")}](/${locale}/accessibility/).

## ${uiText(locale, "docs.versionAndContributions")}

0.1.0-alpha.2 · ${uiText(locale, "docs.experimentalAPIExamplesUseTheSameVersionAs")} [${uiText(locale, "docs.contributing")}](/${locale}/contributing/).
`, { order: position + 1 });
    await writePortablePage(item.name, item.slug, locale);
  }
  for (const variant of componentVariants) {
    const item = components.find(component => component.name === variant.name)!;
    await writePortablePage(item.name, item.slug, locale);
  }
  for (const state of states) await writePortablePage(state.example, state.slug, locale);
  await prunePages(root + '/' + locale + '/components', ['index', ...ordered.map(item => item.slug)], '.mdx');
  await writePatternDocs(locale, page, sourceTabs, imports);
  await prunePages('apps/docs/public/examples/' + locale, [
    ...formStudies.map(item => 'study-' + item.id), ...components.map(item => item.slug), ...states.map(item => item.slug), ...patternEntries.map(item => patternExampleSlug(item.slug)),
  ], '.html');
}
await mkdir('apps/docs/src/data', { recursive: true });
await writeGenerated('apps/docs/src/data/api.json', JSON.stringify(api));
await writeGenerated('apps/docs/public/qa-manifest.json', JSON.stringify({ states: states.map(state => ({ name: state.example, slug: state.slug, state: state.state, native: state.native, docsPath: { ro: componentHref(state.component, 'ro'), en: componentHref(state.component, 'en') } })), components: components.map(item => {
  const docsPath = Object.fromEntries((['ro', 'en'] as const).map(locale => [locale, componentHref(item.name, locale)]));
  return { name: item.name, slug: item.slug, docsPath };
}), patterns: patterns.map(item => item.slug), patternExamples: patternEntries.map(item => ({ name: item.example, slug: patternExampleSlug(item.slug), docsPath: { ro: patternHref(item.slug, 'ro'), en: patternHref(item.slug, 'en') } })) }));
console.log(`Generated ${orderedComponents('en').length} component pages, ${componentVariants.length} nested variants and ${patterns.length} pattern pages in each language.`);

await writeFormStudies();
