import { StrictMode, useRef, useState } from 'react';
import * as R from '@strictlylucian/sdr-react';

/** Bundled against each installed tarball and its own React, never the workspace runtime. */
export function CompatibilityApp() {
  const [checked, setChecked] = useState(true);
  const [error, setError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return <StrictMode><R.SdrProvider lang="ro">
    <h1>Compatibilitate React · SDR</h1>
    <form>
      <R.TextInput label="Nume" name="name" ref={input} error={error ? 'Introdu numele.' : undefined} />
      <R.Button onClick={() => input.current!.focus()}>Focus nume</R.Button>
      <R.Button onClick={() => setError(!error)}>Validare</R.Button>
      <R.Checkbox label="Email" checked={checked} onChange={event => setChecked(event.target.checked)}>
        <R.TextInput label="Adresa de email" name="email" type="email" defaultValue="test@example.ro" />
      </R.Checkbox>
      <R.Button onClick={() => setChecked(!checked)}>Schimbă opțiunea</R.Button>
      <R.Fieldset legend="Contact">
        <R.Radio name="contact" value="phone" label="Telefon" defaultChecked>
          <R.TextInput label="Numărul de telefon" name="phone" defaultValue="0712345678" />
        </R.Radio>
        <R.Radio name="contact" value="post" label="Prin poștă" />
      </R.Fieldset>
      <R.PasswordInput label="Parolă" name="password" showLabel="Arată parola" hideLabel="Ascunde parola" />
      <R.CharacterCount label="Mesaj" name="message" limit={20} formatCount={remaining => `${remaining} disponibile`} />
      <R.Button type="reset">Resetează</R.Button>
    </form>
    <R.Tabs label="Detalii" items={[{ id: 'one', label: 'Prima', content: 'Primul tab' }, { id: 'two', label: 'A doua', content: 'Al doilea tab' }]} />
    <R.Accordion label="Întrebări" expandAllLabel="Deschide toate" collapseAllLabel="Închide toate" items={[{ id: 'documents', title: 'Documente', content: 'Act de identitate' }]} />
    <R.Dialog trigger="Deschide dialogul" title="Confirmare" closeLabel="Închide dialogul"><p>Conținut dialog</p></R.Dialog>
  </R.SdrProvider></StrictMode>;
}
