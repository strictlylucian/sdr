import { mkdir, readFile } from 'node:fs/promises';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { SdrProvider } from '../../packages/react/src';
import StudyForm from '../../apps/docs/src/studies/StudyForm';
import { formStudies } from '../../apps/docs/src/studies/forms';
import { uiText, studyText as t } from '../../apps/docs/src/i18n/messages';
import { docsUrl } from '../../apps/docs/src/docs-url';
import { writeGenerated } from './write-generated.mts';
import { prunePages } from './prune-pages.mts';
export async function writeFormStudies() {
  for (const locale of ['ro', 'en'] as const) {
    const root = `apps/docs/src/content/docs/${locale}/reality`;
    await mkdir(root, { recursive: true });
    const intro = await readFile(`catalog/content/${locale}/reality.md`, 'utf8');
    await writeGenerated(`${root}/index.mdx`, `---\ntitle: ${JSON.stringify(t(locale, 'section'))}\nsidebar: { order: 0 }\n---\n${intro}\n`);
    for (const [index, study] of formStudies.entries()) {
      const content = await readFile(`catalog/content/${locale}/study-${study.id}.md`, 'utf8');
      await writeGenerated(`${root}/${study.id}.mdx`, `---\ntitle: ${JSON.stringify(t(locale, study.title))}\nsidebar: { order: ${index + 1} }\n---\nimport FormStudy from '../../../../components/FormStudy.astro';\n\n${content}\n\n## ${t(locale, 'original')}\n\n<FormStudy id="${study.id}" locale="${locale}" part="original" />\n\n## ${t(locale, 'proposal')}\n\n<FormStudy id="${study.id}" locale="${locale}" part="proposal" />\n`);
      const body = renderToStaticMarkup(createElement(SdrProvider, { lang: locale, children: createElement(StudyForm, { id: study.id, locale, standalone: true }) })).replaceAll(' data-sdr-owner="react"', '');
      const title = t(locale, study.title);
      const page = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · SDR</title><link rel="icon" href="${docsUrl('/favicon.svg')}"><link rel="stylesheet" href="${docsUrl('/portable/sdr.css')}"><script src="${docsUrl('/portable/sdr.js')}" defer></script><script src="${docsUrl('/portable-demo.js')}" defer></script></head><body class="sdr"><main>${body}</main><footer class="sdr-container sdr-u-padding-block-4"><p class="sdr-doc-notice sdr-caption">${uiText(locale, 'DocsNotice.disclaimer')}</p></footer></body></html>`;
      await writeGenerated(`apps/docs/public/examples/${locale}/study-${study.id}.html`, page);
    }
    await prunePages(root, ['index', ...formStudies.map(study => study.id)], '.mdx');
  }
}
