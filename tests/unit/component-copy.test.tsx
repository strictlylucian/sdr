import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SdrProvider, PasswordInput, CharacterCount, Accordion } from '../../packages/react/src';

it('accepts application-owned text in any language and preserves revealed password state', async () => {
  const { rerender } = render(<SdrProvider lang="fr"><PasswordInput label="Mot de passe" showLabel="Afficher" hideLabel="Masquer" defaultValue="Ș-secret" /></SdrProvider>);
  await userEvent.click(screen.getByRole('button', { name: 'Afficher' }));
  rerender(<SdrProvider lang="de"><PasswordInput label="Passwort" showLabel="Anzeigen" hideLabel="Verbergen" defaultValue="Ș-secret" /></SdrProvider>);
  const toggle = screen.getByRole('button', { name: 'Verbergen' });
  expect(screen.getByLabelText('Passwort')).toHaveAttribute('type', 'text');
  expect(screen.getByLabelText('Passwort')).toHaveValue('Ș-secret');
  await userEvent.click(toggle);
  expect(screen.getByRole('button', { name: 'Anzeigen' })).toHaveAttribute('aria-pressed', 'false');
});
it('uses the latest application formatter without resetting the answer', async () => {
  const { rerender } = render(<CharacterCount label="Message" limit={3} formatCount={remaining => `Available: ${remaining}`} />);
  await userEvent.type(screen.getByRole('textbox'), 'ș🙂ab');
  rerender(<CharacterCount label="Mesaj" limit={3} formatCount={remaining => `Rămase: ${remaining}`} />);
  expect(screen.getByRole('textbox')).toHaveValue('ș🙂ab');
  expect(screen.getByText('Rămase: -1')).toBeInTheDocument();
});
it('retains expanded sections when application copy changes', async () => {
  const items = [{ id: 'help', title: 'Help', content: 'Content' }];
  const { rerender } = render(<Accordion label="Help" items={items} expandAllLabel="Expand" collapseAllLabel="Collapse" />);
  await userEvent.click(screen.getByRole('button', { name: 'Expand' }));
  rerender(<Accordion label="Hilfe" items={items} expandAllLabel="Öffnen" collapseAllLabel="Schließen" />);
  expect(screen.getByRole('button', { name: 'Schließen' })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText('Help').closest('details')).toHaveAttribute('open');
});
it('does not rewrite unchanged live count copy on an unrelated render', async () => {
  const formatCount = (remaining: number) => `${remaining} available`;
  const { rerender } = render(<SdrProvider><CharacterCount label="Message" limit={3} defaultValue="ș🙂" formatCount={formatCount} /></SdrProvider>);
  const changes: MutationRecord[] = [];
  const observer = new MutationObserver(records => changes.push(...records));
  observer.observe(document.querySelector('[data-sdr-count]')!, { childList: true, subtree: true, characterData: true });
  rerender(<SdrProvider theme="dark"><CharacterCount label="Message" limit={3} defaultValue="ș🙂" formatCount={formatCount} /></SdrProvider>);
  await Promise.resolve(); observer.disconnect();
  expect(changes).toHaveLength(0);
  expect(screen.getByText('1 available')).toBeInTheDocument();
});
