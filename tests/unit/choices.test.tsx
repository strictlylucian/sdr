import { createRef, useState } from 'react';
import { expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

it.each(['Checkbox', 'Radio', 'Switch'] as const)('%s has a label, descriptions, native state and forwarded ref', async name => {
  const Component = R[name];
  const ref = createRef<HTMLInputElement>();
  renderSdr(<><p id="extra">More information</p><Component ref={ref} label="Email" hint="For updates" error="Choose a preference" aria-describedby="extra" /></>);
  const input = screen.getByRole(name === 'Switch' ? 'switch' : name === 'Radio' ? 'radio' : 'checkbox', { name: /^Email/ });
  expect(ref.current).toBe(input);
  expect(input).toHaveAccessibleDescription('For updates Choose a preference More information');
  expect(input).toBeInvalid();
  await userEvent.click(input);
  expect(input).toBeChecked();
});

it('supports controlled checkbox state, keyboard activation and disabled choices', async () => {
  function Form() {
    const [checked, setChecked] = useState(false);
    return <><R.Checkbox label="Consent" checked={checked} onChange={event => setChecked(event.target.checked)} /><R.Switch label="Unavailable" disabled /></>;
  }
  renderSdr(<Form />);
  const checkbox = screen.getByRole('checkbox', { name: 'Consent' });
  checkbox.focus(); await userEvent.keyboard(' ');
  expect(checkbox).toBeChecked();
  await userEvent.click(screen.getByRole('switch'));
  expect(screen.getByRole('switch')).not.toBeChecked();
});

it('keeps radios exclusive and exposes a named fieldset with its hint', async () => {
  renderSdr(<R.Fieldset legend="Contact method" hint="Choose one"><R.Radio name="contact" label="Email" /><R.Radio name="contact" label="Phone" /></R.Fieldset>);
  expect(screen.getByRole('group', { name: 'Contact method' })).toHaveAccessibleDescription('Choose one');
  await userEvent.click(screen.getByRole('radio', { name: 'Email' }));
  await userEvent.click(screen.getByRole('radio', { name: 'Phone' }));
  expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked();
  expect(screen.getByRole('radio', { name: 'Phone' })).toBeChecked();
});

it('preserves host fieldset descriptions and segmented default selection', () => {
  renderSdr(<><p id="hint">Host hint</p><R.Fieldset legend="Host group" aria-describedby="hint">Content</R.Fieldset><R.SegmentedControl legend="Period" name="period" defaultValue="year" options={[{ value: 'month', label: 'Monthly' }, { value: 'year', label: 'Yearly' }]} /></>);
  expect(screen.getByRole('group', { name: 'Host group' })).toHaveAccessibleDescription('Host hint');
  expect(screen.getByRole('radio', { name: 'Yearly' })).toBeChecked();
});
