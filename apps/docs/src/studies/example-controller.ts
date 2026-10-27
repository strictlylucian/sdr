import { getFormStudy, type Locale } from './forms';
import { syncStudyFields } from './conditional-fields';
import { renderStudyAnswers } from './render-answers';
import { studyTotal, type StudyControl } from './study-values';

export function mountStudyExamples(root: HTMLElement) {
  const study = getFormStudy(root.dataset.formStudy!), locale = root.lang as Locale;
  const abort = new AbortController();
  const control = (name: string) => {
    const input = root.querySelector<StudyControl>(`[name="${name}"]`);
    if (!input) throw new Error(`Missing example field: ${name}`);
    return input;
  };
  const answers = root.querySelector<HTMLElement>('[data-study-answers]');
  if (!answers) throw new Error('Missing answer review example');
  const update = () => {
    syncStudyFields(root, study, control);
    renderStudyAnswers(answers, study, locale, control);
    if (study.pricing) for (const total of root.querySelectorAll('[data-study-total]')) {
      total.textContent = studyTotal(study, control(study.pricing.countField).value, locale);
    }
  };
  root.addEventListener('submit', event => event.preventDefault(), { signal: abort.signal });
  root.addEventListener('input', update, { signal: abort.signal });
  root.addEventListener('change', update, { signal: abort.signal });
  root.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const target = root.querySelector<HTMLElement>(link.hash);
    if (!target) throw new Error(`Missing example target: ${link.hash}`);
    if (!target.matches('input,select,textarea,[tabindex]')) return;
    event.preventDefault(); target.focus();
  }, { signal: abort.signal });
  update(); root.dataset.studyReady = 'true';
  return () => { abort.abort(); delete root.dataset.studyReady; };
}
