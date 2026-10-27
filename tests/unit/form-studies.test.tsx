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
  for (const input of root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-study-step]:not([hidden]) input,[data-study-step]:not([hidden]) textarea,[data-study-step]:not([hidden]) select')) {
    if (input.closest<HTMLElement>('[data-study-field]')?.hidden) continue;
    if (input instanceof HTMLInputElement && input.readOnly) continue;
    if (input.type === 'file') continue;
    if (input instanceof HTMLSelectElement) { fireEvent.change(input, { target: { value: input.options[1].value } }); continue; }
    if (input.type === 'checkbox') { fireEvent.click(input); continue; }
    const value = input.type === 'date' ? '2000-01-01' : input.name === 'percentage' ? '3.5' : input.name === 'tax-year' ? '2025' : input.getAttribute('pattern') === '[0-9]{13}' ? '0000000000000' : ['[0-9]+', '[0-9]{1,10}'].includes(input.getAttribute('pattern') ?? '') ? '123456' : input.type === 'email' ? 'fictional@example.invalid' : input.type === 'number' ? '1' : 'Exemplu fictiv';
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
      expect(root.querySelectorAll('[data-study-answers] dt')).toHaveLength(study.steps.flatMap(step => step.fields).filter(field => field.showWhen?.value !== 'legal-entity').length);
      fireEvent.click(get('[data-study-answers] button'));
      const primary = study.steps[0].fields.find(field => field.autoComplete === 'family-name' || field.autoComplete === 'name')!;
      const surname = get<HTMLInputElement>(`[name="${primary.name}"]`);
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
  it('checks email confirmation, integer quantity and the local payment total', () => {
    const { root, get, dispose } = open('online-payment');
    fillStep(root); fireEvent.click(get('[data-study-next]'));
    fillStep(root);
    fireEvent.change(get('[name="confirm-email"]'), { target: { value: 'different@example.invalid' } });
    fireEvent.click(get('[data-study-next]'));
    expect(get('[name="confirm-email"]')).toHaveAttribute('aria-invalid', 'true');
    fireEvent.change(get('[name="confirm-email"]'), { target: { value: 'fictional@example.invalid' } });
    fireEvent.click(get('[data-study-next]'));
    const quantity = get<HTMLInputElement>('[name="quantity"]');
    fireEvent.input(quantity, { target: { value: '1.5' } });
    fireEvent.click(get('[data-study-next]'));
    expect(quantity).toHaveAttribute('aria-invalid', 'true');
    fireEvent.input(quantity, { target: { value: '3' } });
    expect(get('[data-study-total]')).toHaveTextContent('75');
    fireEvent.click(get('[data-study-next]'));
    expect(get('[data-study-review]')).toBeVisible();
    expect(get('[data-study-pricing]')).toBeVisible();
    expect(get('[data-study-total]')).toHaveTextContent('75');
    dispose();
  });
  it('checks attachment metadata and accepts an accented file name without reading content', () => {
    const { root, get, dispose } = open('online-igi');
    for (let index = 0; index < 2; index++) { fillStep(root); fireEvent.click(get('[data-study-next]')); }
    fillStep(root);
    const attachment = get<HTMLInputElement>('[name="attachment"]');
    fireEvent.change(attachment, { target: { files: [new File(['x'], 'example.exe')] } });
    fireEvent.click(get('[data-study-next]'));
    expect(attachment).toHaveAttribute('aria-invalid', 'true');
    fireEvent.change(attachment, { target: { files: [new File([new Uint8Array(1000001)], 'example.pdf')] } });
    fireEvent.click(get('[data-study-next]'));
    expect(attachment).toHaveAttribute('aria-invalid', 'true');
    const file = new File(['fictional'], 'fișier.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'text', { value: () => { throw new Error('File contents must not be read'); } });
    fireEvent.change(attachment, { target: { files: [file] } });
    fireEvent.click(get('[data-study-next]'));
    expect(get('[data-study-review]')).toBeVisible();
    expect(get('[data-study-answers]')).toHaveTextContent('fișier.pdf');
    dispose();
  });
  for (const locale of ['ro', 'en'] as const) for (const id of ['online-igi', 'online-payment'] as const) {
    it(`${id} ${locale}: preserves both applicant choices through review, edit and reset`, () => {
      const { root, get, dispose } = open(id, locale);
      const type = get<HTMLSelectElement>('[name="applicant-type"]');
      expect(type.tagName).toBe('SELECT');
      expect([...type.options].map(option => option.value)).toEqual(['', 'individual', 'legal-entity']);
      fillStep(root);
      fireEvent.change(type, { target: { value: 'legal-entity' } });
      if (id === 'online-payment') {
        const person = get<HTMLInputElement>('[name="recipient-number"]');
        expect(person).toBeDisabled();
        expect(person.closest('[data-study-field]')).not.toBeVisible();
        const company = get<HTMLInputElement>('[name="company-name"]');
        const taxId = get<HTMLInputElement>('[name="company-number"]');
        expect(company).toBeEnabled();
        expect(taxId).toBeEnabled();
        fireEvent.click(get('[data-study-next]'));
        expect(company).toHaveAttribute('aria-invalid', 'true');
        fireEvent.change(company, { target: { value: 'Companie fictivă' } });
        fireEvent.change(taxId, { target: { value: '12345678' } });
      }
      const steps = formStudies.find(study => study.id === id)!.steps;
      fireEvent.click(get('[data-study-next]'));
      for (let step = 1; step < steps.length; step++) { fillStep(root); fireEvent.click(get('[data-study-next]')); }
      expect(get('[data-study-review]')).toBeVisible();
      expect(get('[data-study-answers]')).toHaveTextContent(locale === 'ro' ? 'Persoană juridică' : 'Legal entity');
      if (id === 'online-payment') {
        expect(get('[data-study-answers]')).toHaveTextContent('Companie fictivă');
        expect(get('[data-study-answers]')).not.toHaveTextContent(locale === 'ro' ? 'CNP-ul beneficiarului' : 'Recipient’s Romanian personal number');
        fireEvent.click(get('[data-study-answers] button'));
        fireEvent.change(type, { target: { value: 'individual' } });
        expect(get('[name="company-name"]')).toBeDisabled();
        expect(get('[name="recipient-number"]')).toBeEnabled();
        expect(get<HTMLInputElement>('[name="company-name"]').value).toBe('Companie fictivă');
        for (const step of steps) fireEvent.click(get('[data-study-next]'));
        expect(get('[data-study-review]')).toBeVisible();
        expect(get('[data-study-answers]')).not.toHaveTextContent('Companie fictivă');
      }
      fireEvent.click(get('[data-study-finish]'));
      fireEvent.click(get('[data-study-restart]'));
      expect(type.value).toBe('');
      if (id === 'online-payment') {
        expect(get('[name="company-name"]')).toBeDisabled();
        expect(get('[name="recipient-number"]')).toBeDisabled();
        expect(get<HTMLInputElement>('[name="company-name"]').value).toBe('');
      }
      dispose();
    });
  }

});
