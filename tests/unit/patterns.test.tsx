import { expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

it.each(['ro', 'en'] as const)('collects identity/contact data with appropriate browser hints in %s', locale => {
  renderSdr(<><R.NameFields required label={"Full name"} hint={"Include all given and family names."} /><R.ContactFields prefix="applicant" emailLabel={"Email"} phoneLabel={"Phone number"} phoneHint={"Include the country code, for example +40."} /><R.BankDetailsFields legend={"Bank account"} holderLabel={"Account holder"} ibanLabel={"IBAN"} ibanHint={"You can paste the IBAN with or without spaces."} /><R.IdentityFields label={"Romanian personal numerical code (CNP)"} hint={"The service must explain why this information is necessary."} /><R.PasswordCreationFields required showLabel={"Show password"} hideLabel={"Hide password"} label={"Choose a password"} hint={"Use a unique password. A password manager can help."} /></>, locale);
  expect(document.querySelector('[name="full-name"]')).toHaveAttribute('autocomplete', 'name');
  expect(document.querySelector('[name="full-name"]')).toBeRequired();
  expect(document.querySelector('[name="applicant-email"]')).toHaveAttribute('type', 'email');
  expect(document.querySelector('[name="applicant-phone"]')).toHaveAttribute('type', 'tel');
  expect(document.querySelector('[name="bank-iban"]')).toHaveAttribute('spellcheck', 'false');
  expect(document.querySelector('[name="identity"]')).toHaveAttribute('inputmode', 'numeric');
  expect(document.querySelector('[name="password"]')).toHaveAttribute('autocomplete', 'new-password');
});

it.each(['ro', 'en'] as const)('provides domestic and international address fields in %s', locale => {
  const { rerender } = renderSdr(<R.AddressFields legend={"Address"} labels={{ line1: "Street and number", line2: "Building, entrance, floor, apartment (optional)", city: "City, town or village", region: "County or sector", postcode: "Postcode (if applicable)", country: "Country" }} />, locale);
  expect(document.querySelector('[name="address-line1"]')).toHaveAttribute('autocomplete', 'address-line1');
  expect(document.querySelector('[name="address-country"]')).not.toBeInTheDocument();
  rerender(<R.AddressFields prefix="home" international legend={"Address"} labels={{ line1: "Street and number", line2: "Building, entrance, floor, apartment (optional)", city: "City, town or village", region: "Region (if applicable)", postcode: "Postcode (if applicable)", country: "Country" }} />);
  expect(document.querySelector('[name="home-country"]')).toHaveAttribute('autocomplete', 'country-name');
});

it('supports application-specific names and non-CNP identification', () => {
  renderSdr(<><R.NameFields name="applicant" label={"Full name"} hint={"Include all given and family names."} /><R.ContactFields emailLabel={"Email"} phoneLabel={"Phone number"} phoneHint={"Include the country code, for example +40."} /><R.BankDetailsFields prefix="refund" legend={"Bank account"} holderLabel={"Account holder"} ibanLabel={"IBAN"} ibanHint={"You can paste the IBAN with or without spaces."} /><R.IdentityFields kind="other" name="passport" label={"Identity document number"} hint={"The service must explain why this information is necessary."} /><R.PasswordCreationFields name="new-secret" showLabel={"Show password"} hideLabel={"Hide password"} label={"Choose a password"} hint={"Use a unique password. A password manager can help."} /></>);
  expect(document.querySelector('[name="applicant"]')).not.toBeRequired();
  expect(document.querySelector('[name="passport"]')).toHaveAttribute('inputmode', 'text');
  expect(document.querySelector('[name="refund-iban"]')).toBeInTheDocument();
  expect(document.querySelector('[name="new-secret"]')).not.toBeRequired();
});

it('submits a question page through the host handler and retains field values', async () => {
  const submit = vi.fn(event => event.preventDefault());
  renderSdr(<R.QuestionPage title="Your name" hint="As on your document" submitLabel="Continue" onSubmit={submit}><R.TextInput label="Name" name="name" /></R.QuestionPage>);
  await userEvent.type(screen.getByRole('textbox'), 'Ana Șerban');
  await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
  expect(submit).toHaveBeenCalledOnce();
  expect(screen.getByRole('textbox')).toHaveValue('Ana Șerban');
});

it.each(['ro', 'en'] as const)('exposes confirmation references in %s', locale => {
  renderSdr(<R.ConfirmationPage title="Application received" reference="SDR-123" referenceLabel={"Reference"}>Keep this reference</R.ConfirmationPage>, locale);
  expect(screen.getByRole('heading', { name: 'Application received' })).toBeInTheDocument();
  expect(screen.getByText('SDR-123')).toBeInTheDocument();
});

it('composes check-answers, start and status pages with explicit next actions', () => {
  const { rerender } = renderSdr(<R.CheckAnswers title="Check your answers" items={[{ key: 'Name', value: 'Ana' }]}>Confirm before sending</R.CheckAnswers>);
  expect(screen.getByRole('term')).toHaveTextContent('Name');
  rerender(<R.StartPage title="Apply" startHref="/start" startLabel="Start now">Eligibility information</R.StartPage>);
  expect(screen.getByRole('link', { name: 'Start now' })).toHaveAttribute('href', '/start');
  rerender(<R.ServiceStatusPage title="Unavailable" returnHref="/" returnLabel="Return">Try later</R.ServiceStatusPage>);
  expect(screen.getByRole('link', { name: 'Return' })).toHaveAttribute('href', '/');
  rerender(<R.ServiceStatusPage title="Maintenance">Return at 10:00</R.ServiceStatusPage>);
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

it('keeps step-by-step content in ordered sequence', () => {
  renderSdr(<R.StepByStep title="How to apply" steps={[{ title: 'Prepare', content: 'Gather documents' }, { title: 'Send', content: 'Submit the application' }]} />);
  expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(['PrepareGather documents', 'SendSubmit the application']);
});
