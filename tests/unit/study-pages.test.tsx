import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import StudyForm from '../../apps/docs/src/studies/StudyForm';
import { mountFormStudy } from '../../apps/docs/src/studies/controller';
import { formStudies } from '../../apps/docs/src/studies/forms';

afterEach(cleanup);
for (const study of formStudies) it(`${study.id}: each step is independently reachable as one page example`, () => {
  const { container } = render(<StudyForm id={study.id} locale="en" />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountFormStudy(root);
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-study-stepper] a')];
  expect(links).toHaveLength(study.steps.length + 1);
  expect(root.querySelectorAll('.sdr-header')).toHaveLength(1);
  expect(root.querySelector('.sdr-study-panel')).toBeNull();
  for (let index = study.steps.length - 1; index >= 0; index--) {
    fireEvent.click(links[index]);
    const visible = [...root.querySelectorAll<HTMLFieldSetElement>('[data-study-step]')].filter(step => !step.hidden);
    expect(visible).toHaveLength(1);
    expect(visible[0]).toHaveAttribute('data-study-step', String(index));
    expect(visible[0].querySelector('legend')).toHaveFocus();
    expect(links[index].parentElement).toHaveAttribute('aria-current', 'step');
  }
  fireEvent.click(links.at(-1)!);
  expect(root.querySelector('[data-study-review]')).toBeVisible();
  const buttons = [...root.querySelectorAll<HTMLAnchorElement>('[data-study-edit]')];
  expect(buttons.length).toBe(root.querySelectorAll('.sdr-summary__row').length);
  const button = buttons[0], input = root.querySelector<HTMLInputElement>(`[name="${button.dataset.studyEdit}"]`)!;
  fireEvent.click(button);
  expect(input).toBeVisible();
  expect(input).toHaveFocus();
  expect(root.querySelector('[data-study-review]')).not.toBeVisible();
  expect(root.querySelector('[data-study-next]')).not.toHaveTextContent('Save changes');
  dispose();
});

it('changes an answer by focusing its field and uses ordinary navigation back to review', () => {
  const { container } = render(<StudyForm id="online-payment" locale="ro" />);
  const root = container.querySelector<HTMLElement>('[data-form-study]')!;
  const dispose = mountFormStudy(root);
  const get = (selector: string) => root.querySelector<HTMLElement>(selector)!;
  fireEvent.click([...root.querySelectorAll('[data-study-stepper] a')].at(-1)!);
  const button = get('[data-study-edit="email"]');
  expect(button).toHaveTextContent('Modifică');
  fireEvent.click(button);
  const email = get('[name="email"]');
  expect(email).toHaveFocus();
  fireEvent.change(email, { target: { value: 'fictional@example.invalid' } });
  fireEvent.click([...root.querySelectorAll('[data-study-stepper] a')].at(-1)!);
  expect(get('[data-study-answers]')).toHaveTextContent('fictional@example.invalid');
  fireEvent.click(get('[data-study-page-back]'));
  expect(get('[data-study-step="2"]')).toBeVisible();
  dispose();
});
