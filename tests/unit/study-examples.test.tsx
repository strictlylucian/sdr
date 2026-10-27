import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import StudyPageExamples from '../../apps/docs/src/studies/StudyPageExamples';
import { mountStudyExamples } from '../../apps/docs/src/studies/example-controller';
import { formStudies } from '../../apps/docs/src/studies/forms';

afterEach(cleanup);
for (const study of formStudies) it(`${study.id}: all complete page examples are visible with their own selected step`, () => {
  const { container } = render(<StudyPageExamples id={study.id} locale="en" />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountStudyExamples(root);
  const pages = [...root.querySelectorAll<HTMLElement>('[data-study-page]')];
  expect(pages).toHaveLength(study.steps.length + 1);
  pages.forEach((page, index) => {
    expect(page).toBeVisible();
    expect(page.querySelector('.sdr-header')).toBeVisible();
    expect(page.querySelector('[data-study-page-back]')).toBeVisible();
    const steps = [...page.querySelectorAll('[data-study-stepper] li')];
    expect(steps).toHaveLength(pages.length);
    expect(steps[index]).toHaveAttribute('aria-current', 'step');
    expect(page.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
  });
  for (const step of root.querySelectorAll('[data-study-step]')) { expect(step).toBeVisible(); expect(step).toBeEnabled(); }
  expect(root.querySelector('[data-study-review]')).toBeVisible();
  const ids = [...root.querySelectorAll('[id]')].map(element => element.id);
  expect(new Set(ids).size).toBe(ids.length);
  const edit = root.querySelector<HTMLAnchorElement>('[data-study-edit]')!;
  fireEvent.click(edit);
  expect(root.querySelector(`[name="${edit.dataset.studyEdit}"]`)).toHaveFocus();
  pages.forEach(page => expect(page).toBeVisible());
  const submit = new Event('submit', { bubbles: true, cancelable: true });
  root.querySelector('form')!.dispatchEvent(submit);
  expect(submit.defaultPrevented).toBe(true);
  dispose();
});

it('keeps review, conditional fields and both totals in sync without hiding page examples', () => {
  const { container } = render(<StudyPageExamples id="online-payment" locale="ro" />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountStudyExamples(root);
  const get = (selector: string) => root.querySelector<HTMLElement>(selector)!;
  fireEvent.change(get('[name="applicant-type"]'), { target: { value: 'legal-entity' } });
  fireEvent.input(get('[name="company-name"]'), { target: { value: 'Firmă fictivă' } });
  fireEvent.input(get('[name="quantity"]'), { target: { value: '3' } });
  expect(get('[data-study-review]')).toHaveTextContent('Firmă fictivă');
  expect(root.querySelectorAll('[data-study-total]')).toHaveLength(2);
  root.querySelectorAll('[data-study-total]').forEach(total => expect(total).toHaveTextContent('75'));
  const edit = get('[data-study-edit="company-name"]');
  expect(edit).toHaveTextContent('Modifică');
  fireEvent.change(get('[name="company-name"]'));
  expect(get('[data-study-edit="company-name"]')).toBe(edit);
  fireEvent.click(edit);
  expect(get('[name="company-name"]')).toHaveFocus();
  expect(get('[data-study-review]')).toBeVisible();
  fireEvent.change(get('[name="applicant-type"]'), { target: { value: 'individual' } });
  expect(get('[data-study-review]')).not.toHaveTextContent('Firmă fictivă');
  dispose();
});
