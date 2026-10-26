import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

describe('Button', () => {
  it.each(['primary', 'secondary', 'tertiary', 'danger', 'danger-secondary'] as const)('supports %s without submitting its form', async variant => {
    const submit = vi.fn(event => event.preventDefault());
    const activate = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    renderSdr(<form onSubmit={submit}><R.Button variant={variant} ref={ref} onClick={activate}>Continue</R.Button></form>);
    const button = screen.getByRole('button', { name: 'Continue' });
    expect(ref.current).toBe(button);
    await userEvent.click(button);
    expect(activate).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
  });
  it('honours disabled and explicit submit behaviour', async () => {
    const submit = vi.fn(event => event.preventDefault());
    const click = vi.fn();
    renderSdr(<form onSubmit={submit}><R.Button disabled onClick={click}>Unavailable</R.Button><R.Button type="submit">Send</R.Button></form>);
    await userEvent.click(screen.getByRole('button', { name: 'Unavailable' }));
    expect(click).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(submit).toHaveBeenCalledOnce();
  });
});

it('toggles with Space and Enter and releases its listener on unmount', async () => {
  const user = userEvent.setup();
  const { unmount } = renderSdr(<R.ToggleButton defaultPressed>Notifications</R.ToggleButton>);
  const button = screen.getByRole('button', { name: 'Notifications', pressed: true });
  button.focus();
  await user.keyboard(' ');
  expect(button).toHaveAttribute('aria-pressed', 'false');
  await user.keyboard('{Enter}');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  unmount(); button.click();
  expect(button).toHaveAttribute('aria-pressed', 'true');
});

it.each(['Link', 'ButtonLink', 'ExitThisPage'] as const)('%s preserves native navigation', name => {
  const Component = R[name];
  renderSdr(<Component href="/service">Open service</Component>);
  expect(screen.getByRole('link', { name: 'Open service' })).toHaveAttribute('href', '/service');
});

it('supports link refs, styled links and non-submit chip actions', async () => {
  const ref = createRef<HTMLAnchorElement>();
  const action = vi.fn();
  renderSdr(<><R.Link ref={ref} href="/help">Help</R.Link><R.ButtonLink href="/next" variant="secondary">Next</R.ButtonLink><R.ActionChip onClick={action}>Filter</R.ActionChip></>);
  expect(ref.current).toBe(screen.getByRole('link', { name: 'Help' }));
  expect(screen.getByRole('link', { name: 'Next' })).toHaveClass('sdr-button--secondary');
  await userEvent.click(screen.getByRole('button', { name: 'Filter' }));
  expect(action).toHaveBeenCalledOnce();
});

it('names chip removal actions and calls the host once', async () => {
  const remove = vi.fn();
  renderSdr(<R.DismissibleChip removeLabel="Remove Bucharest" onRemove={remove}>Bucharest</R.DismissibleChip>);
  await userEvent.click(screen.getByRole('button', { name: 'Remove Bucharest' }));
  expect(remove).toHaveBeenCalledOnce();
});

it.each([['ro', 'Înapoi', 'Mergi direct la conținut'], ['en', 'Back', 'Skip to content']] as const)('renders application-supplied navigation aids in %s', (locale, back, skip) => {
  renderSdr(<><R.BackLink href="/back" children={back} /><R.SkipLink children={skip} /><R.BackToTop>Top</R.BackToTop></>, locale);
  expect(screen.getByRole('link', { name: back })).toHaveAttribute('href', '/back');
  expect(screen.getByRole('link', { name: skip })).toHaveAttribute('href', '#main');
  expect(screen.getByRole('link', { name: skip })).toHaveAttribute('tabindex', '0');
  expect(screen.getByRole('link', { name: /Top/ })).toHaveAttribute('href', '#top');
});
