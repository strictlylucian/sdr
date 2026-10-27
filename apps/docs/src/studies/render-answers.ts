import { isStudyFieldActive } from './conditional-fields';
import { studyAnswer, type StudyControl } from './study-values';
import { studyText as t } from '../i18n/messages';
import type { FormStudy, Locale } from './forms';

export function renderStudyAnswers(answers: HTMLElement, study: FormStudy, locale: Locale, control: (name: string) => StudyControl) {
  const sections = study.steps.map(step => {
    const section = document.createElement('section'); section.className = 'sdr-stack';
    const heading = document.createElement('h3'); heading.className = 'sdr-heading-md'; heading.textContent = t(locale, step.key);
    const list = document.createElement('dl'); list.className = 'sdr-summary';
    for (const field of step.fields) {
      if (!isStudyFieldActive(field, control)) continue;
      const input = control(field.name);
      const row = document.createElement('div'), label = document.createElement('dt'), value = document.createElement('dd');
      row.className = 'sdr-summary__row'; label.textContent = t(locale, field.key); value.textContent = studyAnswer(field, input, locale);
      const actions = document.createElement('dd'); actions.className = 'sdr-summary__actions';
      const edit = document.createElement('a'); edit.href = `#${input.id}`; edit.className = 'sdr-link'; edit.textContent = t(locale, 'edit');
      const context = document.createElement('span'); context.className = 'sdr-visually-hidden'; context.textContent = `: ${t(locale, field.key)}`;
      edit.append(context); edit.dataset.studyEdit = field.name;
      actions.append(edit); row.append(label, value, actions); list.append(row);
    }
    section.append(heading, list); return section;
  });
  const next = document.createElement('div'); next.append(...sections);
  // A text field's change event can fire when an edit link is pressed; preserve that link if its content is unchanged.
  if (answers.innerHTML !== next.innerHTML) answers.replaceChildren(...next.childNodes);
}
