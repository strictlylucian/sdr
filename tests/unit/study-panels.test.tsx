import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import StudyPanels from '../../apps/docs/src/studies/StudyPanels';
import { mountStudyPanels } from '../../apps/docs/src/studies/panel-controller';
import { formStudies } from '../../apps/docs/src/studies/forms';
import { studyAnswer } from '../../apps/docs/src/studies/study-values';

afterEach(cleanup);
for (const study of formStudies) it(`${study.id}: every panel is available before entering any answers`, () => {
  const { container } = render(<StudyPanels id={study.id} locale="en" />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountStudyPanels(root);
  const steps = [...root.querySelectorAll<HTMLFieldSetElement>('[data-study-step]')];
  expect(steps).toHaveLength(study.steps.length);
  for (const step of steps) { expect(step).toBeVisible(); expect(step).toBeEnabled(); }
  expect(root.querySelector('[data-study-next]')).toBeNull();
  expect(root.querySelectorAll('[required], [pattern], [data-study-error], [aria-invalid]')).toHaveLength(0);
  expect(root.querySelector('[data-study-review-panel]')).toBeVisible();
  expect(root.querySelectorAll('.sdr-study-panel')).toHaveLength(study.steps.length + 1);
  const last = [...root.querySelectorAll<HTMLAnchorElement>('[data-study-panel-navigation] a')].at(-1)!;
  fireEvent.click(last);
  expect(root.querySelector(last.hash)).toHaveFocus();
  expect(last.parentElement).toHaveAttribute('aria-current', 'step');
  const submit = new Event('submit', { bubbles: true, cancelable: true });
  root.querySelector('form')!.dispatchEvent(submit);
  expect(submit.defaultPrevented).toBe(true);
  dispose();
  expect(root).not.toHaveAttribute('data-study-ready');
});

it('uses the selected radio value for conditional detail and keeps entered text when switching', () => {
  const { container } = render(<StudyPanels id="online-gruiu" locale="en" />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountStudyPanels(root);
  const detail = root.querySelector<HTMLInputElement>('[name="other-issue"]')!;
  expect(detail).toBeDisabled();
  fireEvent.click(root.querySelector('[name="issue-type"][value="other"]')!);
  expect(detail).toBeEnabled();
  fireEvent.change(detail, { target: { value: 'Fictional issue' } });
  fireEvent.click(root.querySelector('[name="issue-type"][value="roads"]')!);
  expect(detail).toBeDisabled();
  expect(detail.closest('[data-study-field]')).not.toBeVisible();
  fireEvent.click(root.querySelector('[name="issue-type"][value="other"]')!);
  expect(detail.value).toBe('Fictional issue');
  dispose();
});

it('retains multiple selected border counties in answer review', () => {
  const { container } = render(<StudyPanels id="online-fishing" locale="en" />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountStudyPanels(root);
  const choices = [...root.querySelectorAll<HTMLInputElement>('[name="fishing-counties"]')];
  fireEvent.click(choices[0]); fireEvent.click(choices[1]);
  const field = formStudies.find(study => study.id === 'online-fishing')!.steps[2].fields[0];
  expect(studyAnswer(field, choices[0], 'en')).toBe('Arad, Bihor');
  dispose();
});

it('updates the always-visible review before required questions are complete', () => {
  const { container } = render(<StudyPanels id="online-payment" locale="en" />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountStudyPanels(root);
  const review = root.querySelector<HTMLElement>('[data-study-review-panel]')!;
  expect(review).toBeVisible();
  fireEvent.input(root.querySelector('[name="quantity"]')!, { target: { value: '3' } });
  const totals = root.querySelectorAll('[data-study-price] strong');
  expect(totals).toHaveLength(2);
  for (const total of totals) expect(total).toHaveTextContent('75');
  fireEvent.change(root.querySelector('[name="applicant-type"]')!, { target: { value: 'legal-entity' } });
  fireEvent.change(root.querySelector('[name="company-name"]')!, { target: { value: 'Fictional company' } });
  expect(review).toHaveTextContent('Fictional company');
  expect(review).not.toHaveTextContent('Recipient’s Romanian personal number');
  fireEvent.change(root.querySelector('[name="applicant-type"]')!, { target: { value: 'individual' } });
  expect(review).not.toHaveTextContent('Fictional company');
  expect(root.querySelector<HTMLInputElement>('[name="company-name"]')!.value).toBe('Fictional company');
  dispose();
});
