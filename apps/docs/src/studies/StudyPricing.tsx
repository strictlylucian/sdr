import React, { useEffect, useState } from 'react';
import { studyText as t } from '../i18n/messages';
import { studyTotal } from './study-values';
import type { FormStudy, Locale } from './forms';

export default function StudyPricing({ study, locale, prefix, announce = false }: { study: FormStudy; locale: Locale; prefix: string; announce?: boolean }) {
  if (!study.pricing) throw new Error('Pricing preview requires study pricing');
  const quantity = study.steps.flatMap(step => step.fields).find(field => field.name === study.pricing!.countField);
  if (!quantity) throw new Error('Study pricing must reference a quantity field');
  const [total, setTotal] = useState(() => studyTotal(study, quantity.defaultValue ?? '', locale));
  useEffect(() => {
    const form = document.getElementById(`${prefix}-form`);
    if (!(form instanceof HTMLFormElement)) throw new Error('Pricing preview requires its study form');
    const input = form.querySelector<HTMLInputElement>(`[name="${study.pricing!.countField}"]`);
    if (!input) throw new Error('Pricing preview requires its quantity field');
    const update = () => setTotal(studyTotal(study, input.value, locale));
    const abort = new AbortController();
    input.addEventListener('input', update, { signal: abort.signal });
    update();
    return () => abort.abort();
  }, [study, locale, prefix]);
  return <section data-study-price className="sdr-stack">
    <p>{t(locale, 'priceSnapshot', { amount: study.pricing.unitAmount })}</p>
    <p aria-live={announce ? 'polite' : undefined}>{t(locale, 'demonstrationTotal')}: <strong>{total}</strong></p>
  </section>;
}
