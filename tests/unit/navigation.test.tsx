import { act, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';
import { mockViewport } from '../support/media';

const items = [{ label: 'Overview', href: '/', current: true }, { label: 'Applications', href: '/applications' }];

it('keeps institutional branding optional and never invents an emblem', () => {
  const { rerender } = renderSdr(<R.Header serviceName="Local services" />);
  expect(screen.getByRole('banner')).toHaveTextContent('Local services');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  rerender(<R.Header serviceName="Local services" href="/service" emblem={<img src="/emblem.svg" alt="Institution emblem" />} />);
  expect(screen.getByRole('img', { name: 'Institution emblem' })).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/service');
});

it('opens and closes the mobile menu with keyboard and restores focus on Escape', async () => {
  mockViewport(false);
  renderSdr(<R.ServiceNavigation label="Service" items={items} menuLabel={"Menu"} />);
  const toggle = screen.getByRole('button', { name: 'Menu' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link', { name: 'Applications' })).not.toBeInTheDocument();
  toggle.focus(); await userEvent.keyboard('{Enter}{Tab}{Tab}{Escape}');
  expect(toggle).toHaveFocus();
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

it('moves focus to reachable navigation when crossing desktop/mobile boundaries', async () => {
  const resize = mockViewport(false);
  renderSdr(<R.ServiceNavigation label="Service" items={items} menuLabel={"Menu"} />);
  const toggle = screen.getByRole('button', { name: 'Menu' });
  toggle.focus(); act(() => resize(true));
  expect(screen.getByRole('link', { name: 'Overview' })).toHaveFocus();
  expect(toggle).not.toBeVisible();
  act(() => resize(false));
  expect(toggle).toHaveFocus();
  await userEvent.click(toggle);
  await userEvent.keyboard('{Escape}');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

it('renders supplied menu copy, supports updates and skips enhancement for one link', () => {
  mockViewport(false);
  const { rerender } = renderSdr(<R.ServiceNavigation label="Serviciu" items={items} menuLabel="Meniu" />, 'ro');
  expect(screen.getByRole('button', { name: 'Meniu' })).toBeVisible();
  rerender(<R.ServiceNavigation label="Serviciu" menuLabel="Deschide meniul" items={items} />);
  expect(screen.getByRole('button', { name: 'Deschide meniul' })).toBeVisible();
  rerender(<R.ServiceNavigation label="Serviciu" items={items.slice(0, 1)} menuLabel={"Menu"} />);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
});

it.each(['SideNavigation', 'TableOfContents'] as const)('%s retains visible links at narrow widths', name => {
  mockViewport(false);
  const Component = R[name];
  renderSdr(<Component label="Sections" items={items} />);
  expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
});

it('renders breadcrumb current location as text, language metadata and footer landmarks', () => {
  renderSdr(<><R.Breadcrumbs label="You are here" items={items.map(item => ({ ...item, current: item.href !== '/' }))} /><R.LanguageNavigation label="Language" items={[{ label: 'Română', lang: 'ro', href: '/ro', current: true }, { label: 'English', lang: 'en', href: '/en' }]} /><R.Footer>Contact</R.Footer></>);
  expect(screen.queryByRole('link', { name: 'Applications' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Română' })).toHaveAttribute('hreflang', 'ro');
  expect(screen.getByRole('link', { name: 'Română' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('contentinfo')).toHaveTextContent('Contact');
});

it.each([1, 5, 10])('paginates page %s with bounded neighbours and current location', page => {
  renderSdr(<R.Pagination page={page} pages={10} href={n => `/results?page=${n}`} label="Pages" previousLabel="Previous" nextLabel="Next" />);
  expect(screen.getByRole('navigation', { name: 'Pages' }).querySelector('[aria-current="page"]')).toHaveTextContent(String(page));
  expect(screen.queryByRole('link', { name: /Previous/ }) !== null).toBe(page > 1);
  expect(screen.queryByRole('link', { name: /Next/ }) !== null).toBe(page < 10);
});

it.each([0, 11, 1.5])('rejects invalid pagination state %s', page => {
  expect(() => renderSdr(<R.Pagination page={page} pages={10} href={String} label="Pages" previousLabel="Previous" nextLabel="Next" />)).toThrow('page within 1..pages');
});

it('marks current steps and keeps tree disclosure native', async () => {
  renderSdr(<><R.Stepper label="Progress" steps={[{ label: 'Start', href: '/start', status: 'Completed' }, { label: 'Details', current: true }]} /><R.TreeView label="Documents" items={[{ label: 'Applications', href: '/applications', children: [{ label: '2026', href: '/2026' }] }, { label: 'Help', href: '/help' }]} /></>);
  expect(screen.getByText('Details').closest('li')).toHaveAttribute('aria-current', 'step');
  await userEvent.click(screen.getByText('Applications', { selector: 'summary' }));
  expect(screen.getByRole('link', { name: '2026' })).toHaveAttribute('href', '/2026');
});
