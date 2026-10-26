import { mountFormStudy } from '../studies/controller';
import { uiText, countText } from '../i18n/messages';
import './pattern-forms';
/* Example host wiring. This is documentation code, not part of the two-file library. */
SDR.init(document, {
  formatCount: (remaining, root) => countText(root.closest('[lang]').lang, remaining),
  compareText: new Intl.Collator(document.documentElement.lang, { numeric: true, sensitivity: 'base' }).compare,
});
document.querySelectorAll('[data-sdr-page-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = document.querySelector('[data-sdr-page-result]');
    if (!result) throw new Error('The Page example needs a confirmation region.');
    result.hidden = false;
    result.focus();
  });
});
document.addEventListener('sdr:action', event => {
  const root = event.target;
  const action = event.detail.action;
  const responses = { accept: 'demo.actions.accept', reject: 'demo.actions.reject', helpful: 'demo.actions.helpful', unhelpful: 'demo.actions.unhelpful', remove: 'demo.actions.remove' };
  if (!Object.hasOwn(responses, action)) throw new Error('Unknown example action: ' + action);
  const output = document.createElement('p');
  output.setAttribute('role', 'status');
  output.textContent = uiText(document.documentElement.lang, responses[action]);
  root.after(output);
  if (action === 'accept' || action === 'reject') { root.hidden = true; output.tabIndex = -1; output.focus(); }
  if (action === 'remove') { const restore = document.getElementById('restore-filter'); if (restore) restore.focus(); root.hidden = true; }
});

for (const trigger of document.querySelectorAll('[data-sdr-toast-show]')) {
  trigger.addEventListener('click', () => {
    const wrapper = trigger.parentElement.querySelector('[data-sdr-toast-example]');
    if (!(wrapper instanceof HTMLElement)) throw new Error('Toast example requires a presentation wrapper.');
    const toast = wrapper.querySelector('.sdr-toast');
    if (!(toast instanceof HTMLElement)) throw new Error('Toast example requires toast markup.');
    wrapper.hidden = false;
    wrapper.style.display = 'contents';
    toast.hidden = false;
  });
}

document.querySelectorAll('[data-form-study]').forEach(root => mountFormStudy(root));
