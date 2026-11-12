import { expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

it('keeps service chrome outside the shared content container and links the skip target', () => {
  const { container } = renderSdr(<R.Page mainId="application" skipLabel="Skip to application" className="host"
    header={<R.Header serviceName="Public service" />}
    navigation={<R.ServiceNavigation label="Service" menuLabel="Menu" items={[{ label: 'Apply', href: '#application' }]} />}
    beforeContent={<R.BackLink href="/services">Back</R.BackLink>}
    footer={<a href="/accessibility">Accessibility</a>}>
    <h1>Apply for a document</h1><R.TextInput id="name" label="Name" />
  </R.Page>);
  const root = container.querySelector('.sdr-page')!;
  const main = screen.getByRole('main');
  expect(root).toHaveClass('host');
  expect(screen.getByRole('banner').parentElement).toBe(root);
  expect(screen.getByRole('navigation').parentElement).toBe(root);
  expect(main.parentElement).toHaveClass('sdr-container');
  expect(main).toHaveAttribute('id', 'application');
  expect(main).toHaveAttribute('tabindex', '-1');
  expect(screen.getByRole('link', { name: 'Skip to application' })).toHaveAttribute('href', '#application');
  expect(screen.getByRole('link', { name: /Back/ }).closest('.sdr-container')).toBe(main.parentElement);
  expect(within(main).getByLabelText('Name')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo').parentElement).toBe(root);
  expect(screen.getByRole('link', { name: 'Accessibility' }).parentElement).toHaveClass('sdr-container');
});

it('supports several embedded pages without nested main landmarks or shared skip targets', () => {
  const { container } = renderSdr(<main>{['details', 'review'].map(id => <R.Page key={id} embedded
    mainId={`${id}-content`} mainLabelledBy={`${id}-title`} skipLabel={`Skip to ${id}`}
    header={<R.Header serviceName={id} />}>
    <h2 id={`${id}-title`}>{id}</h2>
  </R.Page>)}</main>);
  expect(screen.getAllByRole('main')).toHaveLength(1);
  for (const id of ['details', 'review']) {
    expect(screen.getByRole('region', { name: id })).toHaveAttribute('id', `${id}-content`);
    expect(screen.getByRole('link', { name: `Skip to ${id}` })).toHaveAttribute('href', `#${id}-content`);
  }
  expect(container.querySelector('footer')).toBeNull();
});
