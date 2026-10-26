import { createRef, memo, StrictMode, useState } from 'react';
import { expect, it } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

it('reveals related fields in keyboard order and retains answers across radio changes', async () => {
  const user = userEvent.setup(), ref = createRef<HTMLInputElement>();
  renderSdr(<form><R.Fieldset legend="Contact">
    <R.Radio ref={ref} id="email" name="contact" value="email" label="Email" conditionalId="email-fields" defaultChecked>
      <R.TextInput label="Email address" name="email-address" required />
    </R.Radio>
    <R.Radio name="contact" value="post" label="Post" />
  </R.Fieldset></form>);
  const email = screen.getByRole('radio', { name: 'Email' });
  const field = screen.getByRole('textbox', { name: 'Email address' });
  expect(ref.current).toBe(email);
  expect(email).toHaveAttribute('aria-controls', 'email-fields');
  expect(email).not.toHaveAttribute('aria-expanded');
  email.focus(); await user.tab(); expect(field).toHaveFocus();
  await user.type(field, 'test@example.ro');
  await user.click(screen.getByRole('radio', { name: 'Post' }));
  expect(field).not.toBeVisible(); expect(field).toBeDisabled();
  expect(new FormData(document.querySelector('form')!).has('email-address')).toBe(false);
  await user.click(email);
  expect(field).toHaveValue('test@example.ro'); expect(field).toBeEnabled(); expect(email).toHaveFocus();
});

it('allows independent checkboxes, preserves explicit child disabled, and resets to defaults', async () => {
  const user = userEvent.setup();
  renderSdr(<form><R.Checkbox label="Email" defaultChecked>
    <R.TextInput label="Address" defaultValue="initial" /><R.TextInput label="Unavailable" disabled />
  </R.Checkbox><R.Checkbox label="Phone"><R.TextInput label="Number" /></R.Checkbox></form>);
  await user.click(screen.getByRole('checkbox', { name: 'Phone' }));
  expect(screen.getByRole('textbox', { name: 'Address' })).toBeEnabled();
  expect(screen.getByRole('textbox', { name: 'Number' })).toBeEnabled();
  await user.click(screen.getByRole('checkbox', { name: 'Email' }));
  act(() => { document.querySelector('form')!.reset(); });
  await waitFor(() => expect(screen.getByRole('textbox', { name: 'Address' })).toBeEnabled());
  expect(screen.getByRole('textbox', { name: 'Address' })).toBeEnabled();
  expect(screen.getByRole('textbox', { name: 'Unavailable' })).toBeDisabled();
  expect(screen.queryByRole('textbox', { name: 'Number' })).not.toBeInTheDocument();
});

it('tracks controlled rerenders, disabled and dynamic children without remounting entered text', async () => {
  function Form() {
    const [checked, setChecked] = useState(false), [disabled, setDisabled] = useState(false), [child, setChild] = useState(true);
    return <><button onClick={() => setChecked(!checked)}>Toggle</button><button onClick={() => setDisabled(!disabled)}>Disable</button><button onClick={() => setChild(!child)}>Child</button>
      <R.Checkbox label="Email" checked={checked} disabled={disabled} onChange={e => setChecked(e.target.checked)}>
        {child ? <R.TextInput label="Address" /> : null}
      </R.Checkbox></>;
  }
  const user = userEvent.setup(); renderSdr(<StrictMode><Form /></StrictMode>);
  await user.click(screen.getByText('Toggle'));
  const field = screen.getByRole('textbox'); await user.type(field, 'kept');
  await user.click(screen.getByText('Disable')); expect(field).toBeDisabled();
  await user.click(screen.getByText('Disable')); expect(field).toBeEnabled(); expect(field).toHaveValue('kept');
  await user.click(screen.getByText('Toggle')); expect(field).not.toBeVisible();
  await user.click(screen.getByText('Child')); expect(document.querySelector('[data-sdr-conditional]')).toBeNull();
  await user.click(screen.getByText('Child')); expect(screen.queryByRole('textbox')).toBeNull();
});

it('synchronises controlled radio peers even when only the newly selected peer rerenders', () => {
  const StableEmail = memo(() => <R.Radio name="method" label="Email" defaultChecked><R.TextInput label="Address" /></R.Radio>);
  function Form({ phone }: { phone: boolean }) {
    return <><StableEmail /><R.Radio name="method" label="Phone" checked={phone} readOnly><R.TextInput label="Number" /></R.Radio></>;
  }
  const { rerender } = renderSdr(<Form phone={false} />);
  rerender(<Form phone />);
  expect(screen.queryByRole('textbox', { name: 'Address' })).toBeNull();
  expect(screen.getByRole('textbox', { name: 'Number' })).toBeEnabled();
});

it('does not propagate a parent choice error to unrelated nested choices', () => {
  renderSdr(<R.Fieldset legend="Outer" error="Choose an option"><R.Radio label="Other" defaultChecked><R.Checkbox label="Nested" /></R.Radio></R.Fieldset>);
  expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
});

it('keeps nested reveals usable after their outer fieldset becomes active', () => {
  renderSdr(<R.Checkbox label="Outer"><R.Checkbox label="Inner" defaultChecked><R.TextInput label="Detail" /></R.Checkbox></R.Checkbox>);
  fireEvent.click(screen.getByRole('checkbox', { name: 'Outer' }));
  expect(screen.getByRole('textbox')).toBeEnabled();
});

it('renders related fields visibly on the server for progressive enhancement', () => {
  const html = renderToStaticMarkup(<R.Radio label="Email" id="email"><R.TextInput label="Address" /></R.Radio>);
  expect(html).toContain('data-sdr-component="conditional-choice"');
  expect(html).not.toContain('hidden'); expect(html).not.toContain('disabled');
  expect(html).toContain('aria-labelledby="email-label"');
  const disabled = renderToStaticMarkup(<R.Checkbox label="Email" disabled><R.TextInput label="Address" /></R.Checkbox>);
  expect(disabled).toMatch(/<fieldset[^>]+disabled=""/);
});
