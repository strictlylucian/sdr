import React, { useEffect, useState } from 'react';
import { SummaryList } from '../../../../packages/react/src';
import { studyText as t } from '../i18n/messages';
import { isStudyFieldActive } from './conditional-fields';
import { studyAnswer, type StudyControl } from './study-values';
import type { FormStudy, Locale } from './forms';
import StudyPricing from './StudyPricing';

export default function StudyReviewPanel({ study, locale, prefix }: { study: FormStudy; locale: Locale; prefix: string }) {
  const [sections, setSections] = useState(() => study.steps.map(step => ({
    title: t(locale, step.key),
    items: step.fields.filter(field => !field.showWhen).map(field => ({ key: t(locale, field.key), value: field.defaultValue || t(locale, 'empty') })),
  })));
  useEffect(() => {
    const form = document.getElementById(`${prefix}-form`);
    if (!(form instanceof HTMLFormElement)) throw new Error('Review preview requires its study form');
    const control = (name: string) => {
      const input = form.querySelector<StudyControl>(`[name="${name}"]`);
      if (!input) throw new Error(`Missing review control: ${name}`);
      return input;
    };
    const refresh = () => setSections(study.steps.map(step => ({
      title: t(locale, step.key),
      items: step.fields.filter(field => isStudyFieldActive(field, control)).map(field => ({ key: t(locale, field.key), value: studyAnswer(field, control(field.name), locale) })),
    })));
    const abort = new AbortController();
    form.addEventListener('input', refresh, { signal: abort.signal });
    form.addEventListener('change', refresh, { signal: abort.signal });
    refresh();
    return () => abort.abort();
  }, [study, locale, prefix]);
  return <section className="sdr-study-panel sdr-stack" data-study-review-panel data-study-panel={study.steps.length}>
    <h2 id={`${prefix}-step-review`} className="sdr-heading-lg" tabIndex={-1}>
      <span className="sdr-caption sdr-study-panel__number">{t(locale, 'stepNumber', { number: study.steps.length + 1 })}</span>
      {t(locale, 'review')}
    </h2>
    {sections.map((section, index) => <section className="sdr-stack" key={index}>
      <h3 className="sdr-heading-md">{section.title}</h3>
      <SummaryList items={section.items} />
    </section>)}
    {study.pricing && <StudyPricing study={study} locale={locale} prefix={prefix} />}
  </section>;
}
