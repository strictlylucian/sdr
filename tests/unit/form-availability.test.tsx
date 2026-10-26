import { expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

it.each(['TextInput', 'Textarea', 'Select', 'FileUpload', 'Checkbox', 'Radio', 'Switch', 'RangeInput', 'DatePicker', 'TimeInput'] as const)('%s supports native disabled semantics', name => {
  const Component = R[name];
  renderSdr(<form aria-label="Service"><Component label="Answer" name="answer" disabled /></form>);
  expect(screen.getByLabelText('Answer')).toBeDisabled();
  expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('answer')).toBe(false);
});

it.each(['TextInput', 'Textarea', 'DatePicker', 'TimeInput'] as const)('%s retains read-only values in form data', name => {
  const Component = R[name];
  const value = name === 'DatePicker' ? '2026-11-05' : name === 'TimeInput' ? '10:30' : 'Șerban';
  renderSdr(<form aria-label="Service"><Component label="Answer" name="answer" readOnly defaultValue={value} /></form>);
  expect(screen.getByLabelText('Answer')).toHaveAttribute('readonly');
  expect(screen.getByLabelText('Answer')).not.toBeDisabled();
  expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('answer')).toBe(value);
});

it('propagates disabled and read-only states to every date part without losing values', () => {
  const props = { legend: 'Birth', name: 'birth', labels: { day: 'Day', month: 'Month', year: 'Year' }, defaultValue: { day: '27', month: '3', year: '1990' } };
  const { rerender } = renderSdr(<R.DateInput {...props} disabled />);
  for (const label of ['Day', 'Month', 'Year']) expect(screen.getByLabelText(label)).toBeDisabled();
  rerender(<R.DateInput {...props} readOnly />);
  for (const label of ['Day', 'Month', 'Year']) {
    expect(screen.getByLabelText(label)).not.toBeDisabled();
    expect(screen.getByLabelText(label)).toHaveAttribute('readonly');
  }
  expect(screen.getByLabelText('Day')).toHaveValue('27');
});

it('disables composite actions and segmented choices together with their inputs', () => {
  renderSdr(<><R.PasswordInput label="Password" showLabel="Show" hideLabel="Hide" disabled /><R.SearchBar label="Search" action="/search" buttonLabel="Find" disabled /><R.SegmentedControl legend="View" name="view" options={[{ value: 'list', label: 'List' }]} disabled /></>);
  expect(screen.getByRole('button', { name: 'Show' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Find' })).toBeDisabled();
  expect(screen.getByRole('radio')).toBeDisabled();
});

it('keeps entered date and choice values when errors appear and disappear', async () => {
  function Form({ error }: { error?: string }) {
    return <><R.Fieldset legend="Contact" error={error}><R.Checkbox label="Email" /></R.Fieldset><R.DateInput legend="Birth" name="birth" error={error} labels={{ day: 'Day', month: 'Month', year: 'Year' }} /></>;
  }
  const { rerender } = renderSdr(<Form />);
  await userEvent.click(screen.getByLabelText('Email'));
  await userEvent.type(screen.getByLabelText('Day'), '27');
  rerender(<Form error="Check this value" />);
  expect(screen.getByLabelText('Email')).toBeChecked();
  expect(screen.getByLabelText('Day')).toHaveValue('27');
  rerender(<Form />);
  expect(screen.getByLabelText('Email')).toBeChecked();
  expect(screen.getByLabelText('Day')).toHaveValue('27');
});
