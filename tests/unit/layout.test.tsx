import { expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import * as R from '../../packages/react/src';
import { renderSdr } from '../support/render';

it.each(['light', 'dark', 'heritage', 'contrast'] as const)('exposes the %s theme, locale and density only at the provider boundary', theme => {
  const { container } = renderSdr(<R.SdrProvider theme={theme} density="compact" lang="ro" className="host" id="boundary">Content</R.SdrProvider>);
  const boundary = container.querySelector('#boundary');
  expect(boundary).toHaveAttribute('lang', 'ro');
  expect(boundary).toHaveAttribute('data-sdr-theme', theme);
  expect(boundary).toHaveAttribute('data-sdr-density', 'compact');
  expect(boundary).toHaveClass('sdr', 'host');
});

it.each([1, 2, 3, 4, 5, 6] as const)('keeps heading level %s independent from visual size', level => {
  renderSdr(<R.Heading level={level} size="xl">Title</R.Heading>);
  expect(screen.getByRole('heading', { level, name: 'Title' })).toHaveClass('sdr-heading-xl');
});

it('uses semantic defaults for headings and paragraphs', () => {
  renderSdr(<><R.Heading>Title</R.Heading><R.Text>Body</R.Text><R.Text size="sm">Note</R.Text></>);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Title');
  expect(screen.getByText('Body')).toHaveProperty('tagName', 'P');
  expect(screen.getByText('Note')).toHaveClass('sdr-u-text-sm');
});

it.each(['sm', 'md', 'lg', 'xl'] as const)('keeps the %s motif decorative even if host attributes conflict', size => {
  const { container } = renderSdr(<R.Motif size={size} aria-hidden={false} className="host" />);
  expect(container.querySelector('.sdr-motif')).toHaveAttribute('aria-hidden', 'true');
  expect(container.querySelector('.sdr-motif')).toHaveClass('host');
});

it('preserves layout children, host attributes and explicit zero gaps', () => {
  renderSdr(<R.Container id="container"><R.Section aria-label="Details"><R.Stack gap={0} data-testid="stack"><R.Cluster gap={4}><R.Grid columns={3} data-testid="grid"><R.Prose><R.InsetText>Text</R.InsetText><R.Divider /></R.Prose></R.Grid></R.Cluster></R.Stack></R.Section></R.Container>);
  expect(screen.getByRole('region', { name: 'Details' })).toHaveTextContent('Text');
  expect(screen.getByTestId('stack')).toHaveClass('sdr-u-gap-0');
  expect(screen.getByTestId('grid')).toHaveClass('sdr-grid--3');
  expect(screen.getByRole('separator')).toBeInTheDocument();
});

it('supports automatic layout defaults and sidebar content', () => {
  renderSdr(<R.Stack><R.Cluster><R.Grid><R.SidebarLayout sidebar="Support">Main content</R.SidebarLayout></R.Grid></R.Cluster></R.Stack>);
  expect(screen.getByRole('complementary')).toHaveTextContent('Support');
  expect(screen.getByText('Main content')).toBeInTheDocument();
});

it('composes card titles and footers without changing their meaning', () => {
  renderSdr(<R.Card title="Applications" horizontal footer={<a href="/all">View all</a>}>2 applications</R.Card>);
  expect(screen.getByRole('article')).toHaveClass('sdr-card--horizontal');
  expect(screen.getByRole('heading', { name: 'Applications' })).toHaveProperty('tagName', 'H3');
  expect(screen.getByRole('link', { name: 'View all' })).toHaveAttribute('href', '/all');
});

it('supports minimal cards, hero decoration choices and page-header actions', () => {
  const { rerender } = renderSdr(<R.Hero title="Service" description="Apply online" kicker="For residents"><R.Card>Start here</R.Card></R.Hero>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Service');
  expect(document.querySelector('.sdr-motif')).toBeInTheDocument();
  rerender(<R.Hero title="Service" decorative={false} />);
  expect(document.querySelector('.sdr-motif')).not.toBeInTheDocument();
  rerender(<R.PageHeader title="Applications" description="Your records" actions={<button>New</button>} />);
  expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
});
