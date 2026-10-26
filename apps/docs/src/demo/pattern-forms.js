import { uiText } from '../i18n/messages';
/** Documentation-only form simulations; these are not SDR runtime behaviours. */
for (const root of document.querySelectorAll('[data-sdr-pattern-demo]')) {
  const form = root.matches('form') ? root : root.querySelector('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Pattern demo requires a form.');
  const kind = root.dataset.sdrPatternDemo;
  const locale = root.closest('[lang]').lang;
  const search = () => {
    const data = new FormData(form);
    const query = String(data.get('query')).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    const category = String(data.get('category'));
    let count = 0;
    for (const item of root.querySelectorAll('[data-sdr-search-item]')) {
      item.hidden = Boolean(category && item.dataset.category !== category) || !item.dataset.searchLabel.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().includes(query);
      if (!item.hidden) count++;
    }
    root.querySelector('[data-sdr-search-count]').textContent = uiText(locale, 'demo.results', { count });
    root.querySelector('[data-sdr-search-empty]').hidden = count !== 0;
    root.querySelector('[data-sdr-search-results]').hidden = count === 0;
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (kind === 'search') { search(); return; }
    if (kind === 'eligibility') {
      const answer = new FormData(form).get('resident');
      for (const outcome of root.querySelectorAll('[data-sdr-pattern-outcome]')) outcome.hidden = outcome.dataset.sdrPatternOutcome !== answer;
      const shown = root.querySelector('[data-sdr-pattern-outcome]:not([hidden])');
      shown.tabIndex = -1;
      shown.focus();
      return;
    }
    if (kind === 'validation') {
      root.querySelector('[data-sdr-pattern-summary]').hidden = true;
      for (const field of root.querySelectorAll('.sdr-field--error')) {
        field.classList.remove('sdr-field--error');
        const input = field.querySelector('input');
        input.removeAttribute('aria-invalid');
        input.setAttribute('aria-describedby', input.getAttribute('aria-describedby').split(' ').filter(id => !id.endsWith('-error')).join(' '));
        field.querySelector('.sdr-error').hidden = true;
      }
    }
    const result = root.querySelector('[data-sdr-pattern-result]');
    if (!(result instanceof HTMLElement)) throw new Error('Pattern demo requires a result region.');
    result.hidden = false;
    result.tabIndex = -1;
    result.focus();
  });
  if (kind === 'search') form.addEventListener('reset', () => {
    for (const item of root.querySelectorAll('[data-sdr-search-item]')) item.hidden = false;
    const count = root.querySelectorAll('[data-sdr-search-item]').length;
    root.querySelector('[data-sdr-search-count]').textContent = uiText(locale, 'demo.results', { count });
    root.querySelector('[data-sdr-search-empty]').hidden = true;
    root.querySelector('[data-sdr-search-results]').hidden = false;
  });
}
