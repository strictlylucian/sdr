import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import StudyForm from '../../apps/docs/src/studies/StudyForm';
import { formStudies } from '../../apps/docs/src/studies/forms';
import { mountFormStudy } from '../../apps/docs/src/studies/controller';

afterEach(cleanup);
for (const locale of ['ro', 'en'] as const) for (const study of formStudies) {
  it(`${study.id} ${locale}: empty answers never block the visual journey or submit data`, () => {
    const { container } = render(<StudyForm id={study.id} locale={locale} />);
    const root = container.querySelector<HTMLElement>('[data-form-study]')!;
    const dispose = mountFormStudy(root);
    const get = (selector: string) => root.querySelector<HTMLElement>(selector)!;
    expect(root.querySelectorAll('[required], [pattern], [data-study-error], [data-study-errors], [aria-invalid]')).toHaveLength(0);
    for (const _step of study.steps) fireEvent.click(get('[data-study-next]'));
    expect(get('[data-study-review]')).toBeVisible();
    expect(get('[data-study-review]')).toHaveFocus();
    expect(root.querySelectorAll('[data-study-answers] dl')).toHaveLength(study.steps.length);
    fireEvent.click(get('[data-study-answers] button'));
    expect(get('[data-study-step="0"]')).toBeVisible();
    const submit = new Event('submit', { bubbles: true, cancelable: true });
    get('form').dispatchEvent(submit);
    expect(submit.defaultPrevented).toBe(true);
    for (let index = 1; index < study.steps.length; index++) fireEvent.click(get('[data-study-next]'));
    fireEvent.click(get('[data-study-finish]'));
    expect(get('[data-study-done]')).toHaveFocus();
    fireEvent.click(get('[data-study-restart]'));
    expect(get('[data-study-step="0"]')).toBeVisible();
    expect(get('[data-study-answers]').childElementCount).toBe(0);
    dispose();
  });
}

it('preserves entered answers and calculates a demonstration total without validating', () => {
  const { container } = render(<StudyForm id="online-payment" locale="en" />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountFormStudy(root);
  const get = (selector: string) => root.querySelector<HTMLElement>(selector)!;
  fireEvent.change(get('[name="applicant-type"]'), { target: { value: 'legal-entity' } });
  fireEvent.change(get('[name="company-name"]'), { target: { value: 'Fictional company' } });
  fireEvent.click(get('[data-study-next]'));
  fireEvent.change(get('[name="email"]'), { target: { value: 'incomplete' } });
  fireEvent.click(get('[data-study-next]'));
  fireEvent.input(get('[name="quantity"]'), { target: { value: '3' } });
  expect(get('[data-study-total]')).toHaveTextContent('75');
  fireEvent.click(get('[data-study-next]'));
  expect(get('[data-study-answers]')).toHaveTextContent('Fictional company');
  expect(get('[data-study-answers]')).toHaveTextContent('incomplete');
  expect(root.querySelectorAll('[aria-invalid]')).toHaveLength(0);
  dispose();
});
