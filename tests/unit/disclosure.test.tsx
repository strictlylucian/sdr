import { expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

const items = [{ id: 'a', label: 'Active', content: 'Active applications' }, { id: 'b', label: 'Done', content: 'Completed applications' }, { id: 'c', label: 'Archived', content: 'Archived applications' }];

it('links tabs to panels and selects the requested initial tab', async () => {
  renderSdr(<R.Tabs label="Applications" items={items} defaultSelected={1} />);
  const selected = screen.getByRole('tab', { name: 'Done', selected: true });
  const panel = screen.getByRole('tabpanel', { name: 'Done' });
  expect(selected).toHaveAttribute('aria-controls', panel.id);
  expect(panel).toHaveTextContent('Completed applications');
  expect(screen.getAllByRole('tab').filter(tab => tab.tabIndex === 0)).toEqual([selected]);
  await userEvent.click(screen.getByRole('tab', { name: 'Active' }));
  expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Active');
});

it.each([
  ['ArrowLeft', 'Archived'], ['End', 'Archived'], ['ArrowRight', 'Done'], ['Home', 'Active'],
] as const)('supports %s keyboard selection', async (key, name) => {
  renderSdr(<R.Tabs label="Applications" items={items} />);
  screen.getByRole('tab', { name: 'Active' }).focus();
  await userEvent.keyboard(`{${key}}`);
  expect(screen.getByRole('tab', { name, selected: true })).toHaveFocus();
});

it('reverses arrow navigation for RTL and ignores unrelated keys', async () => {
  const { container } = renderSdr(<R.Tabs label="Applications" items={items} />);
  (container.querySelector('.sdr-tabs') as HTMLElement).style.direction = 'rtl';
  screen.getByRole('tab', { name: 'Active' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'Archived' })).toHaveFocus();
  await userEvent.keyboard('{ArrowLeft}{a}');
  expect(screen.getByRole('tab', { name: 'Active', selected: true })).toHaveFocus();
});

it.each([-1, 3, 0.5])('rejects invalid initial tab index %s', defaultSelected => {
  expect(() => renderSdr(<R.Tabs label="Applications" items={items} defaultSelected={defaultSelected} />)).toThrow('initial index is out of range');
});

it('updates accordion bulk state after an individual section is toggled', async () => {
  renderSdr(<R.Accordion label="Help" items={[{ id: 'one', title: 'One', content: 'First', open: true }, { id: 'two', title: 'Two', content: 'Second' }]} expandAllLabel={"Expand all sections"} collapseAllLabel={"Collapse all sections"} />);
  await userEvent.click(screen.getByRole('button', { name: 'Expand all sections' }));
  expect(screen.getByRole('button', { name: 'Collapse all sections' })).toHaveAttribute('aria-expanded', 'true');
  await userEvent.click(screen.getByRole('button', { name: 'Collapse all sections' }));
  expect([...document.querySelectorAll('details')].every(section => !section.open)).toBe(true);
  await userEvent.click(screen.getByRole('button', { name: 'Expand all sections' }));
  const details = screen.getByText('One').closest('details')!;
  details.open = false; fireEvent(details, new Event('toggle'));
  expect(screen.getByRole('button', { name: 'Expand all sections' })).toHaveAttribute('aria-expanded', 'false');
});

it('renders application-supplied Romanian accordion actions', async () => {
  renderSdr(<R.Accordion label="Ajutor" items={[{ id: 'a', title: 'Documente', content: 'Detalii' }]} expandAllLabel="Deschide toate secțiunile" collapseAllLabel="Închide toate secțiunile" />, 'ro');
  await userEvent.click(screen.getByRole('button', { name: 'Deschide toate secțiunile' }));
  await userEvent.click(screen.getByRole('button', { name: 'Închide toate secțiunile' }));
  expect(screen.getByRole('button', { name: 'Deschide toate secțiunile' })).toHaveAttribute('aria-expanded', 'false');
});

it('rejects an accordion without sections', () => {
  expect(() => renderSdr(<R.Accordion label="Help" items={[]} expandAllLabel={"Expand all sections"} collapseAllLabel={"Collapse all sections"} />)).toThrow('requires sections');
});

it('provides native details and a popover that dismisses outside or on Escape', async () => {
  renderSdr(<><R.Details summary="More" open>Visible detail</R.Details><R.PopoverMenu label="Actions"><a href="/edit">Edit</a></R.PopoverMenu><button>Outside</button></>);
  expect(screen.getByText('Visible detail').closest('details')).toHaveAttribute('open');
  await userEvent.click(screen.getByText('Actions'));
  expect(screen.getByRole('link', { name: 'Edit' })).toBeVisible();
  await userEvent.keyboard('{Escape}');
  expect(screen.getByText('Actions')).toHaveFocus();
  expect(screen.getByText('Edit')).not.toBeVisible();
  await userEvent.click(screen.getByText('Actions'));
  await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
  expect(screen.getByText('Edit')).not.toBeVisible();
});

it('shows tooltips for focus or pointer hover, dismisses on Escape, and removes document listeners', async () => {
  const user = userEvent.setup();
  const { unmount } = renderSdr(<R.Tooltip label="Help" content="Your reference number" />);
  const trigger = screen.getByRole('button', { name: 'Help' });
  expect(trigger).toHaveAccessibleDescription('Your reference number');
  await user.tab(); expect(screen.getByRole('tooltip')).toBeVisible();
  await user.keyboard('{Escape}'); expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await user.tab(); await user.hover(trigger);
  expect(screen.getByRole('tooltip')).toBeVisible();
  await user.unhover(trigger); expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  unmount(); await user.keyboard('{Escape}');
});
