import { createRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

describe.each(['TextInput', 'Textarea', 'Select', 'FileUpload'] as const)('%s field contract', name => {
  it('associates a stable ID, label, hint, error and host description', () => {
    const Component = R[name];
    renderSdr(<><p id="privacy">Private information</p><Component id="answer" label="Answer" hint="Use diacritics" error="Answer required" aria-describedby="privacy" /></>);
    const input = screen.getByLabelText('Answer');
    expect(input).toHaveAttribute('id', 'answer');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('Use diacritics Answer required Private information');
  });
  it('forwards refs and native attributes without adding error semantics', () => {
    const Component = R[name];
    const ref = createRef<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>();
    renderSdr(<Component ref={ref} label="Answer" name="answer" required disabled className="host-field" />);
    const input = screen.getByLabelText('Answer');
    expect(input).toBeDisabled(); expect(input).toBeRequired();
    expect(input).toHaveClass('host-field');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(ref.current).toBe(input);
  });
});

it('supports controlled text and preserves Romanian and Unicode content', async () => {
  function Form() {
    const [value, setValue] = useState('');
    return <R.TextInput label="Name" value={value} onChange={event => setValue(event.target.value)} />;
  }
  renderSdr(<Form />);
  await userEvent.type(screen.getByRole('textbox'), 'Șerban Țepeș 🙂');
  expect(screen.getByRole('textbox')).toHaveValue('Șerban Țepeș 🙂');
});

it('selects options using the native control', async () => {
  renderSdr(<R.Select label="County" defaultValue="cj"><option value="cj">Cluj</option><option value="is">Iași</option></R.Select>);
  await userEvent.selectOptions(screen.getByRole('combobox'), 'is');
  expect(screen.getByRole('combobox')).toHaveValue('is');
});

it('accepts a file without inventing an upload service', async () => {
  renderSdr(<R.FileUpload label="Document" accept="application/pdf" />);
  const file = new File(['document'], 'document.pdf', { type: 'application/pdf' });
  const input = screen.getByLabelText('Document') as HTMLInputElement;
  await userEvent.upload(input, file);
  expect(input.files?.[0]).toBe(file);
});

it.each([['ro', 'Afișează parola', 'Ascunde parola'], ['en', 'Show password', 'Hide password']] as const)('reveals passwords without losing the value in %s', async (locale, show, hide) => {
  renderSdr(<R.PasswordInput label="Password" defaultValue="ș-secret" hint="Keep private" showLabel={show} hideLabel={hide} />, locale);
  const input = screen.getByLabelText('Password');
  const button = screen.getByRole('button', { name: show });
  expect(input).toHaveAttribute('type', 'password');
  await userEvent.click(button);
  expect(input).toHaveAttribute('type', 'text'); expect(input).toHaveValue('ș-secret');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  await userEvent.click(screen.getByRole('button', { name: hide }));
  expect(input).toHaveAttribute('type', 'password');
});

it('recounts Unicode code points and updates the limit on rerender', async () => {
  const { rerender } = renderSdr(<R.CharacterCount label="Message" limit={3} defaultValue="ș🙂" formatCount={remaining => remaining < 0 ? `You are ${-remaining} ${remaining === -1 ? 'character' : 'characters'} over the limit` : `${remaining} ${remaining === 1 ? 'character' : 'characters'} remaining`} />);
  expect(screen.getByText(/1 character remaining/)).toHaveAttribute('aria-live', 'polite');
  await userEvent.type(screen.getByRole('textbox'), 'ab');
  expect(screen.getByRole('textbox')).toHaveValue('ș🙂ab');
  expect(screen.getByText(/1 character over the limit/)).toBeInTheDocument();
  rerender(<R.CharacterCount label="Message" limit={5} formatCount={remaining => remaining < 0 ? `You are ${-remaining} ${remaining === -1 ? 'character' : 'characters'} over the limit` : `${remaining} ${remaining === 1 ? 'character' : 'characters'} remaining`} />);
  expect(screen.getByText(/1 character remaining/)).toBeInTheDocument();
});

it.each(['ro', 'en'] as const)('groups date parts with birthday autocomplete in %s', locale => {
  renderSdr(<R.DateInput legend="Birth date" name="birth" hint="As on your document" error="Check the date" labels={{ day: "Day", month: "Month", year: "Year" }} />, locale);
  expect(screen.getByRole('group', { name: 'Birth date' })).toHaveAccessibleDescription('As on your document Check the date');
  for (const part of ['day', 'month', 'year']) {
    expect(document.querySelector(`[name="birth-${part}"]`)).toHaveAttribute('autocomplete', `bday-${part}`);
    expect(document.querySelector(`[name="birth-${part}"]`)).toHaveAttribute('inputmode', 'numeric');
    expect(document.querySelector(`[name="birth-${part}"]`)).toBeInvalid();
  }
});

it('preserves date/time/range constraints and native search form semantics', () => {
  renderSdr(<><R.DatePicker label="Date" min="2026-01-01" /><R.TimeInput label="Time" /><R.RangeInput label="Distance" min={1} max={10} defaultValue={4} hint="Kilometres" /><R.SearchBar label="Search records" action="/search" buttonLabel="Find" /></>);
  expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'date');
  expect(screen.getByLabelText('Time')).toHaveAttribute('type', 'time');
  expect(screen.getByRole('slider', { name: 'Distance' })).toHaveValue('4');
  expect(screen.getByRole('search')).toHaveAttribute('action', '/search');
  expect(screen.getByRole('search')).toHaveAttribute('method', 'get');
  expect(screen.getByRole('button', { name: 'Find' })).toHaveAttribute('type', 'submit');
});
