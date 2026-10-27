import { isStudyFieldActive, syncStudyFields } from './conditional-fields';
import { getFormStudy, type Locale } from './forms';
import { studyText as t } from '../i18n/messages';
import { validateStudyField, studyAnswer, studyTotal, type StudyControl as Control } from './study-values';
export function mountFormStudy(root: HTMLElement) {
  const study = getFormStudy(root.dataset.formStudy!);
  const locale = root.lang as Locale;
  function get<T extends Element = HTMLElement>(selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Form study ${study.id} requires ${selector}`);
    return element;
  }
  const steps = [...root.querySelectorAll<HTMLFieldSetElement>('[data-study-step]')];
  const summary = get('[data-study-errors]');
  const form = get<HTMLFormElement>('form');
  const next = get<HTMLButtonElement>('[data-study-next]');
  const back = get<HTMLButtonElement>('[data-study-back]');
  const finish = get<HTMLButtonElement>('[data-study-finish]');
  const restart = get<HTMLButtonElement>('[data-study-restart]');
  const review = get('[data-study-review]');
  const progress = get('[data-study-progress]');
  const done = get('[data-study-done]');
  const answers = get('[data-study-answers]');
  const abort = new AbortController();
  let current = 0;
  const control = (name: string) => get<Control>(`[name="${name}"]`);
  function clearErrors() {
    summary.hidden = true;
    summary.querySelector('ul')!.replaceChildren();
    root.querySelectorAll<HTMLElement>('[data-study-field]').forEach(wrapper => {
      const input = wrapper.querySelector<Control>('input,textarea,select')!;
      const error = wrapper.querySelector<HTMLElement>('[data-study-error]')!;
      input.removeAttribute('aria-invalid');
      const described = input.getAttribute('aria-describedby')?.split(' ').filter(id => id !== error.id).join(' ');
      if (described) input.setAttribute('aria-describedby', described); else input.removeAttribute('aria-describedby');
      wrapper.querySelector('.sdr-field')?.classList.remove('sdr-field--error');
      error.hidden = true;
    });
  }
  function validate() {
    clearErrors();
    const errors = summary.querySelector('ul')!;
    for (const field of study.steps[current].fields) {
      if (!isStudyFieldActive(field, control)) continue;
      const input = control(field.name);
      validateStudyField(field, input, control, locale, study.pricing);
      if (input.validity.valid) continue;
      const message = input.validity.valueMissing
        ? t(locale, field.type === 'checkbox' ? 'checkRequired' : 'required', { label: t(locale, field.key) })
        : input.validity.customError ? input.validationMessage : t(locale, 'invalid', { label: t(locale, field.key) });
      const wrapper = get(`[data-study-field="${field.name}"]`);
      const error = wrapper.querySelector<HTMLElement>('[data-study-error]')!;
      error.textContent = message; error.hidden = false;
      const fieldRoot = wrapper.querySelector('.sdr-field');
      if (fieldRoot) { fieldRoot.classList.add('sdr-field--error'); input.before(error); }
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
      const item = document.createElement('li'); const link = document.createElement('a');
      link.href = `#${input.id}`; link.textContent = message;
      link.addEventListener('click', event => { event.preventDefault(); input.focus(); }, { signal: abort.signal });
      item.append(link); errors.append(item);
    }
    if (errors.childElementCount) { summary.hidden = false; summary.focus(); return false; }
    return true;
  }
  function buildAnswers() {
    answers.replaceChildren();
    study.steps.forEach((step, index) => {
      const section = document.createElement('section'); section.className = 'sdr-stack';
      const heading = document.createElement('h3'); heading.className = 'sdr-heading-md'; heading.textContent = t(locale, step.key);
      const list = document.createElement('dl'); list.className = 'sdr-summary';
      step.fields.forEach(field => {
        if (!isStudyFieldActive(field, control)) return;
        const input = control(field.name);
        const row = document.createElement('div'), label = document.createElement('dt'), value = document.createElement('dd');
        row.className = 'sdr-summary__row';
        label.textContent = t(locale, field.key);
        value.textContent = studyAnswer(field, input, locale);
        row.append(label, value); list.append(row);
      });
      const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'sdr-button sdr-button--secondary';
      edit.textContent = `${t(locale, 'edit')}: ${t(locale, step.key)}`;
      edit.addEventListener('click', () => { current = index; show(); }, { signal: abort.signal });
      const actions = document.createElement('div'); actions.append(edit);
      section.append(heading, list, actions); answers.append(section);
    });
  }
  function show(focus = true) {
    clearErrors();
    syncStudyFields(root, study, control);
    const reviewing = current === steps.length;
    steps.forEach((step, index) => { step.hidden = index !== current; step.disabled = index !== current; });
    review.hidden = !reviewing; back.hidden = current === 0; next.hidden = reviewing; finish.hidden = !reviewing;
    progress.hidden = reviewing;
    progress.textContent = t(locale, 'progress', { current: current + 1, total: steps.length });
    next.textContent = t(locale, current === steps.length - 1 ? 'review' : 'continue');
    if (reviewing) buildAnswers();
    if (study.pricing) {
      get('[data-study-pricing]').hidden = !reviewing && !study.steps[current].fields.some(field => field.name === study.pricing!.countField);
      get('[data-study-total]').textContent = studyTotal(study, control(study.pricing.countField).value, locale);
    }
    if (focus) (reviewing ? review : steps[current].querySelector<HTMLElement>('legend')!).focus();
  }
  function advance() { if (validate()) { current++; show(); } }
  next.addEventListener('click', advance, { signal: abort.signal });
  form.addEventListener('submit', event => { event.preventDefault(); if (current < steps.length) advance(); }, { signal: abort.signal });
  back.addEventListener('click', () => { current--; show(); }, { signal: abort.signal });
  finish.addEventListener('click', () => { review.hidden = true; if (study.pricing) get('[data-study-pricing]').hidden = true; get('[data-study-controls]').hidden = true; done.hidden = false; done.focus(); }, { signal: abort.signal });
  restart.addEventListener('click', () => { form.reset(); answers.replaceChildren(); done.hidden = true; get('[data-study-controls]').hidden = false; current = 0; show(); }, { signal: abort.signal });
  if (study.pricing) control(study.pricing.countField).addEventListener('input', () => {
    get('[data-study-total]').textContent = studyTotal(study, control(study.pricing!.countField).value, locale);
  }, { signal: abort.signal });
  const dependencies = new Set(study.steps.flatMap(step => step.fields).flatMap(field => field.showWhen ? [field.showWhen.field] : []));
  form.addEventListener('change', event => {
    if (event.target instanceof HTMLSelectElement && dependencies.has(event.target.name)) {
      clearErrors(); syncStudyFields(root, study, control);
    }
  }, { signal: abort.signal });
  get('[data-study-no-js]').hidden = true;
  for (const button of [next, back, finish, restart]) button.disabled = false;
  show(false);
  return () => abort.abort();
}
