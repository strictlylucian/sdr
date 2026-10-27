import React from 'react';
import * as R from '../../../../packages/react/src';
import StudyField from './StudyField';
import StudyShell from './StudyShell';
import StudyReviewPanel from './StudyReviewPanel';
import StudyPricing from './StudyPricing';
import { getFormStudy, type Locale, type StudyId } from './forms';
import { studyText as t } from '../i18n/messages';

export default function StudyPanels({ id, locale }: { id: StudyId; locale: Locale }) {
  const study = getFormStudy(id), prefix = `study-${id}`;
  return <StudyShell study={study} locale={locale} panels>
    <div data-study-panel-navigation><R.Stepper label={t(locale, 'steps')} steps={[...study.steps.map((step, index) => ({
      label: t(locale, step.key), href: `#${prefix}-step-${index}`, current: index === 0,
    })), { label: t(locale, 'review'), href: `#${prefix}-step-review` }]} /></div>
    <form id={`${prefix}-form`} noValidate autoComplete="off" className="sdr-study-panels">
      {study.steps.map((step, index) => <section className="sdr-study-panel" data-study-panel={index} key={step.key}>
        <fieldset className="sdr-fieldset sdr-stack" data-study-step={index}>
          <legend id={`${prefix}-step-${index}`} className="sdr-legend sdr-heading-lg" tabIndex={-1}>
            <span className="sdr-caption sdr-study-panel__number">{t(locale, 'stepNumber', { number: index + 1 })}</span>
            {t(locale, step.key)}
          </legend>
          {step.fields.map(field => <StudyField key={field.name} field={field} locale={locale} prefix={prefix} />)}
          {study.pricing && step.fields.some(field => field.name === study.pricing!.countField) && <StudyPricing study={study} locale={locale} prefix={prefix} announce />}
        </fieldset>
      </section>)}
      <StudyReviewPanel study={study} locale={locale} prefix={prefix} />
    </form>
  </StudyShell>;
}
