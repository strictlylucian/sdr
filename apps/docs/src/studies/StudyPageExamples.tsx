import React from 'react';
import * as R from '../../../../packages/react/src';
import StudyField from './StudyField';
import StudyShell from './StudyShell';
import { getFormStudy, type Locale, type StudyId } from './forms';
import { studyText as t } from '../i18n/messages';
import { studyTotal } from './study-values';
import { docsUrl } from '../docs-url';

export default function StudyPageExamples({ id, locale }: { id: StudyId; locale: Locale }) {
  const study = getFormStudy(id), prefix = `study-${id}`;
  const pagePrefix = (index: number) => `${prefix}-page-${index}`;
  const heading = (index: number) => `${pagePrefix(index)}-title`;
  const pages = [...study.steps.map(step => t(locale, step.key)), t(locale, 'review')];
  return <div data-form-study={id} data-study-mode="examples" lang={locale} className="sdr-study-examples">
    {pages.map((title, index) => {
      const step = study.steps[index], reviewing = index === study.steps.length;
      const total = study.pricing && (reviewing || step.fields.some(field => field.name === study.pricing!.countField));
      return <section key={index} aria-labelledby={`${pagePrefix(index)}-caption`}>
        <h3 id={`${pagePrefix(index)}-caption`} className="sdr-heading-md">{t(locale, 'stepNumber', { number: index + 1 })}: {title}</h3>
        <div className="sdr-study-example">
          <StudyShell study={study} locale={locale} prefix={pagePrefix(index)} exampleIndex={index}
            backHref={index ? `#${heading(index - 1)}` : docsUrl(`/${locale}/reality/`)}>
            <div data-study-stepper><R.Stepper label={`${t(locale, 'steps')}: ${title}`} steps={pages.map((label, target) => ({ label, href: `#${heading(target)}`, current: target === index }))} /></div>
            {reviewing ? <form noValidate id={`${pagePrefix(index)}-form`} data-study-review className="sdr-stack">
              <h2 id={heading(index)} tabIndex={-1} className="sdr-heading-lg">{title}</h2>
              <div data-study-answers className="sdr-stack" />
              {total && <p>{t(locale, 'demonstrationTotal')}: <strong data-study-total>{studyTotal(study, '1', locale)}</strong></p>}
              <div><R.Button type="submit">{t(locale, 'submit')}</R.Button></div>
            </form> : <form id={`${pagePrefix(index)}-form`} noValidate autoComplete="off" className="sdr-stack">
              <fieldset data-study-step={index} className="sdr-fieldset sdr-stack">
                <legend id={heading(index)} tabIndex={-1} className="sdr-legend sdr-heading-lg">{title}</legend>
                {step.fields.map(field => <StudyField key={field.name} field={field} prefix={pagePrefix(index)} locale={locale} />)}
              </fieldset>
              {total && <p aria-live="polite">{t(locale, 'demonstrationTotal')}: <strong data-study-total>{studyTotal(study, '1', locale)}</strong></p>}
              <div><a className="sdr-button" href={`#${heading(index + 1)}`}>{t(locale, index === study.steps.length - 1 ? 'review' : 'continue')}</a></div>
            </form>}
          </StudyShell>
        </div>
      </section>;
    })}
  </div>;
}
