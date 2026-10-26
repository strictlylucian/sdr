import React from 'react';
import { docsUrl } from '../docs-url';
import * as R from '../../../../packages/react/src';
import { studyText as t } from '../i18n/messages';
import { getFormStudy, type Field, type Locale, type StudyId } from './forms';
function StudyField({ field, locale, prefix }: { field: Field; locale: Locale; prefix: string }) {
  const id = `${prefix}-${field.name}`;
  const label = t(locale, field.key) + (field.required ? '' : ` (${t(locale, 'optional')})`);
  const props = { id, name: field.name, label, required: field.required, hint: field.hint ? t(locale, field.hint) : undefined };
  return <div data-study-field={field.name}>
    {field.type === 'checkbox' ? <R.Checkbox {...props} /> : field.type === 'textarea' ? <R.Textarea {...props} rows={6} /> : <R.TextInput {...props} type={field.type ?? 'text'} autoComplete={field.autoComplete} pattern={field.pattern} min={field.min} max={field.max} step={field.step} inputMode={field.pattern === '[0-9]{13}' || field.pattern === '[0-9]+' ? 'numeric' : undefined} />}
    <p id={`${id}-validation`} className="sdr-error" data-study-error hidden />
  </div>;
}
export default function StudyForm({ id, locale, standalone = false }: { id: StudyId; locale: Locale; standalone?: boolean }) {
  const study = getFormStudy(id);
  const prefix = `study-${id}`;
  return <div data-form-study={id} lang={locale}>
    <R.Header serviceName={t(locale, study.title)} href={`#${prefix}-form`}><span>{t(locale, 'demoInstitution')}</span></R.Header>
    <R.ServiceNavigation label={t(locale, 'formNavigation')} menuLabel={t(locale, 'menu')} items={[
      { label: t(locale, 'application'), href: `#${prefix}-form`, current: true },
      { label: t(locale, 'help'), href: `#${prefix}-help` },
    ]} />
    <R.Container className="sdr-main-wrapper sdr-stack">
    <div><R.BackLink href={docsUrl(`/${locale}/reality/`)}>{t(locale, 'back')}</R.BackLink></div>
    {standalone && <h1>{t(locale, study.title)}</h1>}
    <p data-study-no-js>{t(locale, 'noJs')}</p>
    <div data-study-errors className="sdr-error-summary" tabIndex={-1} role="region" aria-labelledby={`${prefix}-error-title`} hidden>
      <h2 id={`${prefix}-error-title`} className="sdr-heading-md">{t(locale, 'errors')}</h2><ul />
    </div>
    <form id={`${prefix}-form`} noValidate className="sdr-stack" autoComplete="off">
      <p data-study-progress role="status" aria-live="polite">{t(locale, 'progress', { current: 1, total: study.steps.length })}</p>
      {study.steps.map((step, index) => <fieldset className="sdr-fieldset sdr-stack" data-study-step={index} key={step.key} hidden={index !== 0} disabled={index !== 0}>
        <legend className="sdr-legend sdr-heading-lg" tabIndex={-1}>{t(locale, step.key)}</legend>
        {step.fields.map(field => <StudyField key={field.name} field={field} locale={locale} prefix={prefix} />)}
      </fieldset>)}
      <section data-study-review tabIndex={-1} hidden aria-labelledby={`${prefix}-review-title`} className="sdr-stack">
        <h2 id={`${prefix}-review-title`} className="sdr-heading-lg">{t(locale, 'review')}</h2><div data-study-answers className="sdr-stack" />
      </section>
      <div className="sdr-cluster" data-study-controls>
        <R.Button variant="secondary" type="button" data-study-back hidden disabled>{t(locale, 'back')}</R.Button>
        <R.Button type="button" data-study-next disabled>{t(locale, 'continue')}</R.Button>
        <R.Button type="button" data-study-finish hidden disabled>{t(locale, 'complete')}</R.Button>
      </div>
      <section data-study-done tabIndex={-1} hidden aria-labelledby={`${prefix}-done-title`} className="sdr-stack">
        <h2 id={`${prefix}-done-title`} className="sdr-heading-lg">{t(locale, 'completed')}</h2>
        <p>{t(locale, 'completedText')}</p>
        <div><R.Button type="button" variant="secondary" data-study-restart disabled>{t(locale, 'restart')}</R.Button></div>
      </section>
    </form>
    <section id={`${prefix}-help`} className="sdr-stack">
      <h2 className="sdr-heading-md">{t(locale, 'help')}</h2>
      <p><a href={study.source}>{t(locale, 'openOriginal')}</a></p>
    </section>
    </R.Container>
  </div>;
}
