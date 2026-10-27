import StudyField from './StudyField';
import { studyTotal } from './study-values';
import React from 'react';
import StudyShell from './StudyShell';
import * as R from '../../../../packages/react/src';
import { studyText as t } from '../i18n/messages';
import { getFormStudy, type Locale, type StudyId } from './forms';
export default function StudyForm({ id, locale, standalone = false }: { id: StudyId; locale: Locale; standalone?: boolean }) {
  const study = getFormStudy(id);
  const prefix = `study-${id}`;
  return <StudyShell study={study} locale={locale}>
    {standalone && <h1>{t(locale, study.title)}</h1>}
    <p data-study-no-js>{t(locale, 'noJs')}</p>
    <form id={`${prefix}-form`} noValidate className="sdr-stack" autoComplete="off">
      {study.steps.length > 1 && <div data-study-stepper><R.Stepper label={t(locale, 'steps')} steps={[...study.steps.map((step, index) => ({ label: t(locale, step.key), current: index === 0 })), { label: t(locale, 'review') }]} /></div>}
      <p className="sdr-visually-hidden" data-study-progress role="status" aria-live="polite">{t(locale, 'progress', { current: 1, total: study.steps.length + 1 })}</p>
      {study.steps.map((step, index) => <fieldset className="sdr-fieldset sdr-stack" data-study-step={index} key={step.key} hidden={index !== 0} disabled={index !== 0}>
        <legend className="sdr-legend sdr-heading-lg" tabIndex={-1}>{t(locale, step.key)}</legend>
        {step.fields.map(field => <StudyField key={field.name} field={field} locale={locale} prefix={prefix} />)}
      </fieldset>)}
      <section data-study-review tabIndex={-1} hidden aria-labelledby={`${prefix}-review-title`} className="sdr-stack">
        <h2 id={`${prefix}-review-title`} className="sdr-heading-lg">{t(locale, 'review')}</h2><div data-study-answers className="sdr-stack" />
      </section>
      {study.pricing && <section data-study-pricing hidden className="sdr-stack">
        <p>{t(locale, 'priceSnapshot', { amount: study.pricing.unitAmount })}</p>
        <p role="status" aria-live="polite">{t(locale, 'demonstrationTotal')}: <strong data-study-total>{studyTotal(study, '1', locale)}</strong></p>
      </section>}
      <div className="sdr-cluster" data-study-controls>
        <R.Button variant="secondary" type="button" data-study-back hidden disabled>{t(locale, 'back')}</R.Button>
        <R.Button type="button" data-study-next disabled>{t(locale, 'continue')}</R.Button>
        <R.Button type="button" data-study-finish hidden disabled>{t(locale, 'complete')}</R.Button>
      </div>
      <section data-study-done tabIndex={-1} hidden aria-labelledby={`${prefix}-done-title`} className="sdr-stack">
        <h2 id={`${prefix}-done-title`} className="sdr-heading-lg">{t(locale, 'completed')}</h2>
        <p>{t(locale, study.completionKey)}</p>
        <div><R.Button type="button" variant="secondary" data-study-restart disabled>{t(locale, 'restart')}</R.Button></div>
      </section>
    </form>
  </StudyShell>;
}
