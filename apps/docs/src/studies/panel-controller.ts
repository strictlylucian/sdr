import { getFormStudy } from './forms';
import { syncStudyFields } from './conditional-fields';
import type { StudyControl } from './study-values';

export function mountStudyPanels(root: HTMLElement) {
  const study = getFormStudy(root.dataset.formStudy!);
  const abort = new AbortController();
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-study-panel-navigation] a')];
  const control = (name: string) => {
    const input = root.querySelector<StudyControl>(`[name="${name}"]`);
    if (!input) throw new Error(`Missing study control: ${name}`);
    return input;
  };
  root.addEventListener('submit', event => event.preventDefault(), { signal: abort.signal });
  root.addEventListener('focusin', event => {
    if (!(event.target instanceof HTMLElement)) return;
    const step = event.target.closest<HTMLElement>('[data-study-panel]');
    if (!step) return;
    links.forEach((link, index) => { if (String(index) === step.dataset.studyPanel) link.parentElement!.setAttribute('aria-current', 'step'); else link.parentElement!.removeAttribute('aria-current'); });
  }, { signal: abort.signal });
  root.addEventListener('change', () => syncStudyFields(root, study, control), { signal: abort.signal });
  links.forEach(link => link.addEventListener('click', () => {
    links.forEach(item => item.parentElement!.removeAttribute('aria-current'));
    link.parentElement!.setAttribute('aria-current', 'step');
    const heading = root.querySelector<HTMLElement>(link.hash);
    if (!heading) throw new Error(`Missing study panel: ${link.hash}`);
    heading.focus({ preventScroll: true });
  }, { signal: abort.signal }));
  syncStudyFields(root, study, control);
  root.dataset.studyReady = 'true';
  return () => { abort.abort(); delete root.dataset.studyReady; };
}
