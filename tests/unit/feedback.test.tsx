import { expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

it.each(['Alert', 'NotificationBanner'] as const)('%s preserves host announcement semantics and content', name => {
  const Component = R[name];
  renderSdr(<Component title="Saved" tone="success" role="status">Your changes are saved</Component>);
  expect(screen.getByRole('status')).toHaveTextContent('SavedYour changes are saved');
  expect(screen.getByRole('status')).toHaveClass('sdr-alert--success');
});

it('focuses error summaries on request and links errors to fields', () => {
  renderSdr(<><R.ErrorSummary autoFocus errors={[{ href: '#name', message: 'Enter your name' }]} title={"There is a problem"} /><R.TextInput label="Name" id="name" /><R.ErrorMessage id="detail">Required</R.ErrorMessage></>);
  expect(screen.getByRole('heading', { name: 'There is a problem' }).parentElement).toHaveFocus();
  expect(screen.getByRole('link', { name: 'Enter your name' })).toHaveAttribute('href', '#name');
  expect(screen.getByText('Required')).toHaveAttribute('id', 'detail');
});

it('allows a custom summary title without stealing focus', () => {
  renderSdr(<R.ErrorSummary title="Check answers" errors={[]} />);
  expect(screen.getByRole('heading', { name: 'Check answers' }).parentElement).not.toHaveFocus();
});

it.each(['ro', 'en'] as const)('announces loading and labels determinate and indeterminate progress in %s', locale => {
  renderSdr(<><R.LoadingIndicator label={"Loading"} /><R.Progress label="Upload" value={25} max={50} /><R.Progress label="Waiting" /><R.Skeleton label="Loading record" lines={2} /></>, locale);
  expect(screen.getAllByRole('status')).toHaveLength(2);
  expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute('value', '25');
  expect(screen.getByRole('progressbar', { name: 'Waiting' })).not.toHaveAttribute('value');
  expect(screen.getByText('Loading record')).toBeInTheDocument();
});

it('allows explicit loading copy and keeps decoration outside the accessibility tree', () => {
  renderSdr(<><R.LoadingIndicator label="Checking identity" /><R.WarningText>Do not share this code</R.WarningText></>);
  expect(screen.getByRole('status')).toHaveTextContent('Checking identity');
  expect(screen.getByText('!')).toHaveAttribute('aria-hidden', 'true');
});

it('dismisses toasts, returns focus and emits a local dismissal event', async () => {
  const dismiss = vi.fn();
  renderSdr(<><button id="save">Save</button><R.Toast returnFocusId="save" closeLabel={"Close"}>Saved</R.Toast></>);
  screen.getByRole('status').parentElement!.addEventListener('sdr:dismiss', dismiss);
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(dismiss).toHaveBeenCalledOnce();
});

it('delegates cookie decisions and feedback to host callbacks', async () => {
  const accept = vi.fn(), reject = vi.fn(), answer = vi.fn();
  renderSdr(<><R.CookieBanner title="Cookies" acceptLabel="Accept" rejectLabel="Reject" onAccept={accept} onReject={reject}>Your choice</R.CookieBanner><R.Feedback question="Helpful?" yesLabel="Yes" noLabel="No" onAnswer={answer} /></>);
  await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
  await userEvent.click(screen.getByRole('button', { name: 'Reject' }));
  await userEvent.click(screen.getByRole('button', { name: 'Yes' }));
  await userEvent.click(screen.getByRole('button', { name: 'No' }));
  expect(accept).toHaveBeenCalledOnce(); expect(reject).toHaveBeenCalledOnce();
  expect(answer.mock.calls).toEqual([[true], [false]]);
});

it('renders status labels, phase, classification and recovery content as text', () => {
  renderSdr(<><R.Tag tone="warning">Pending</R.Tag><R.Tag>Neutral</R.Tag><R.Badge>3 new</R.Badge><R.Chip>Cluj</R.Chip><R.PhaseBanner phase="Alpha">Experimental</R.PhaseBanner><R.ClassificationBanner>Public</R.ClassificationBanner><R.Panel title="Complete">Reference 123</R.Panel><R.EmptyState title="No records" action={<a href="/new">Start</a>}>Try a different search</R.EmptyState></>);
  expect(screen.getByText('Pending')).toHaveClass('sdr-tag--warning');
  expect(screen.getByRole('heading', { name: 'Complete' })).toHaveProperty('tagName', 'H2');
  expect(screen.getByRole('heading', { name: 'No records' })).toHaveProperty('tagName', 'H3');
  expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/new');
});
