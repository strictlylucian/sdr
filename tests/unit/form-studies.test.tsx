import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import StudyForm from '../../apps/docs/src/studies/StudyForm';
import { formStudies, type Locale, type StudyId } from '../../apps/docs/src/studies/forms';
import { mountFormStudy } from '../../apps/docs/src/studies/controller';

afterEach(cleanup);
function open(id: StudyId, locale: Locale = 'ro') {
  const { container } = render(<StudyForm id={id} locale={locale} />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountFormStudy(root);
  const get = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  return { root, get, dispose };
}
function fillStep(root: HTMLElement) {
  for (const input of root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-study-step]:not([hidden]) input,[data-study-step]:not([hidden]) textarea')) {
    if (input.type === 'checkbox') { fireEvent.click(input); continue; }
    const value = input.type === 'date' ? '2000-01-01' : input.name === 'percentage' ? '3.5' : input.name === 'tax-year' ? '2025' : input.name === 'personal-number' ? '0000000000000' : input.getAttribute('pattern') === '[0-9]+' ? '123456' : input.type === 'email' ? 'fictional@example.invalid' : input.type === 'number' ? '1' : 'Exemplu fictiv';
    fireEvent.change(input, { target: { value } });
  }
}
describe('official-form study journeys', () => {
  for (const locale of ['ro', 'en'] as const) for (const study of formStudies) {
    it(`${study.id} ${locale}: validates, reviews, edits, completes and clears without submission`, () => {
      const { root, get, dispose } = open(study.id, locale);
      fireEvent.click(get('[data-study-next]'));
      expect(get('[data-study-errors]')).toBeVisible();
      expect(get('[data-study-errors]')).toHaveFocus();
      const errorLink = get<HTMLAnchorElement>('[data-study-errors] a');
      fireEvent.click(errorLink);
      expect(document.activeElement?.id).toBe(errorLink.hash.slice(1));
      for (let step = 0; step < study.steps.length; step++) {
        fillStep(root);
        fireEvent.click(get('[data-study-next]'));
        expect(get('[data-study-errors]')).not.toBeVisible();
      }
      expect(get('[data-study-review]')).toBeVisible();
      expect(get('[data-study-review]')).toHaveFocus();
      expect(root.querySelectorAll('[data-study-answers] dt')).toHaveLength(study.steps.flatMap(step => step.fields).length);
      fireEvent.click(get('[data-study-answers] button'));
      const surname = get<HTMLInputElement>('[name="surname"]');
      expect(surname.value).toBe('Exemplu fictiv');
      fireEvent.change(surname, { target: { value: 'Schimbat' } });
      for (let step = 0; step < study.steps.length; step++) fireEvent.click(get('[data-study-next]'));
      expect(get('[data-study-answers]')).toHaveTextContent('Schimbat');
      fireEvent.click(get('[data-study-finish]'));
      expect(get('[data-study-done]')).toBeVisible();
      expect(get('[data-study-done]')).toHaveFocus();
      fireEvent.click(get('[data-study-restart]'));
      expect(surname.value).toBe('');
      expect(get('[data-study-answers]').childElementCount).toBe(0);
      expect(get('[data-study-step="0"]')).toBeVisible();
      dispose();
    });
  }
  it('rejects a tax allocation above 3.5% and preserves answers on back navigation', () => {
    const { root, get, dispose } = open('income-tax');
    for (let step = 0; step < 3; step++) { fillStep(root); fireEvent.click(get('[data-study-next]')); }
    fillStep(root);
    const percentage = get<HTMLInputElement>('[name="percentage"]');
    fireEvent.change(percentage, { target: { value: '4' } });
    fireEvent.click(get('[data-study-next]'));
    expect(percentage).toHaveAttribute('aria-invalid', 'true');
    expect(get('[data-study-step="3"]')).toBeVisible();
    fireEvent.click(get('[data-study-back]'));
    expect(get<HTMLInputElement>('[name="email"]').value).toBe('fictional@example.invalid');
    fireEvent.click(get('[data-study-next]'));
    expect(percentage.value).toBe('4');
    dispose();
  });
  it('blocks native form submission and removes event handlers on disposal', () => {
    const { get, dispose } = open('petition');
    const event = new Event('submit', { bubbles: true, cancelable: true });
    get('form').dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    dispose();
    get('[data-study-errors]').hidden = true;
    fireEvent.click(get('[data-study-next]'));
    expect(get('[data-study-errors]')).not.toBeVisible();
  });
});
