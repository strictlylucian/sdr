import { expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

it.each(['TextInput', 'Textarea', 'Select', 'FileUpload', 'RangeInput', 'DatePicker', 'TimeInput'] as const)('%s retains host validation and descriptions when its error clears', name => {
  const Component = R[name];
  const { rerender } = renderSdr(<><p id="host">Host context</p><Component id="answer" label="Answer" error="Check your answer" aria-describedby="host" /></>);
  expect(screen.getByLabelText('Answer')).toBeInvalid();
  expect(screen.getByLabelText('Answer')).toHaveAccessibleDescription('Check your answer Host context');
  rerender(<><p id="host">Host context</p><Component id="answer" label="Answer" aria-invalid="true" aria-describedby="host" /></>);
  expect(screen.getByLabelText('Answer')).toBeInvalid();
  expect(screen.getByLabelText('Answer')).toHaveAccessibleDescription('Host context');
  expect(document.getElementById('answer-error')).not.toBeInTheDocument();
});

it.each(['Checkbox', 'Radio', 'Switch'] as const)('%s inherits a shared group error and recovers without stale references', name => {
  const Component = R[name];
  const { rerender } = renderSdr(<><p id="host">Host context</p><R.Fieldset id="contact" legend="Contact" hint="Choose one" error="Choose a preference" aria-describedby="host"><Component label="Email" /></R.Fieldset></>);
  const input = screen.getByLabelText('Email');
  expect(input).toBeInvalid();
  expect(input).toHaveAccessibleDescription('Choose one Choose a preference Host context');
  expect(screen.getByRole('group', { name: 'Contact' }).parentElement).toHaveClass('sdr-field--error');
  rerender(<R.Fieldset id="contact" legend="Contact"><Component label="Email" /></R.Fieldset>);
  expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
  expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-describedby');
});

it('retains individual errors inside a group and isolates nested groups', () => {
  renderSdr(<R.Fieldset legend="Outer" error="Outer error"><R.Radio label="One" error="Individual error" /><R.Fieldset legend="Inner"><R.Radio label="Two" /></R.Fieldset></R.Fieldset>);
  expect(screen.getByLabelText('One')).toHaveAccessibleDescription('Individual error Outer error');
  expect(screen.getByLabelText('Two')).not.toHaveAttribute('aria-invalid');
});

it('associates segmented errors with every option', () => {
  renderSdr(<R.SegmentedControl id="period" legend="Period" name="period" hint="Choose one" error="Choose a period" options={[{ value: 'month', label: 'Monthly' }, { value: 'year', label: 'Yearly' }]} />);
  for (const radio of screen.getAllByRole('radio')) {
    expect(radio).toBeInvalid();
    expect(radio).toHaveAccessibleDescription('Choose one Choose a period');
  }
});

it('associates date errors with each date part', () => {
  renderSdr(<R.DateInput legend="Birth" name="birth" hint="On your document" error="Check the date" labels={{ day: 'Day', month: 'Month', year: 'Year' }} />);
  for (const label of ['Day', 'Month', 'Year']) expect(screen.getByLabelText(label)).toHaveAccessibleDescription('On your document Check the date');
});

it('preserves character count, hint, error and application descriptions together', () => {
  renderSdr(<><p id="host">Host context</p><R.CharacterCount label="Description" hint="Brief summary" error="Too long" aria-describedby="host" limit={10} formatCount={n => `${n} remaining`} /></>);
  expect(screen.getByLabelText('Description')).toHaveAccessibleDescription('Brief summary Too long 10 remaining Host context');
});

it('preserves password error semantics while retaining host invalid state', () => {
  renderSdr(<><p id="host">Host context</p><R.PasswordInput label="Password" showLabel="Show" hideLabel="Hide" aria-invalid="true" aria-describedby="host" /></>);
  expect(screen.getByLabelText('Password')).toBeInvalid();
  expect(screen.getByLabelText('Password')).toHaveAccessibleDescription('Host context');
});
