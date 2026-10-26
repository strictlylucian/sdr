# SDR React — Sistem de Design Românesc

[English](./README.md)

Propunere independentă de sistem de design românesc. Versiune alpha experimentală, fără afiliere guvernamentală sau certificare de conformitate.

Componente React cu tipuri TypeScript și conținut furnizat de aplicație, în orice limbă. Stilurile sunt furnizate de pachetul core.

Aplicația furnizează toate etichetele și mesajele dinamice. SDR nu include un mecanism i18n sau dicționare și acceptă conținut în orice limbă. SdrProvider transmite atributul nativ lang fără să aleagă traduceri. CharacterCount primește obligatoriu funcția formatCount.

```tsx
import '@sdr/core/styles.css';
import { SdrProvider, TextInput, Button } from '@sdr/react';

export function Example() {
  return (
    <SdrProvider lang="ro" theme="light" density="comfortable">
      <form className="sdr-stack" onSubmit={event => event.preventDefault()}>
        <TextInput id="full-name" name="full-name" label="Nume complet" autoComplete="name" required />
        <div><Button type="submit">Continuă</Button></div>
      </form>
    </SdrProvider>
  );
}
```

Pentru integrarea locală sunt necesare ambele arhive. React și React DOM sunt dependențe peer. CSS-ul este importat o singură dată în aplicație.

Componentele acceptă valori controlate pentru câmpurile native, refs, etichete, texte ajutătoare și mesaje de eroare asociate. Un form builder gestionează schema, regulile de validare, navigarea și salvarea datelor; SDR furnizează interfața și interacțiunile componentelor. ID-urile stabile păstrează asocierile și ajută la gestionarea focusului în formularele dinamice.

Interacțiunile sunt inițializate și eliminate prin efectele React. Scriptul portabil nu este necesar pentru componentele gestionate de React. Randarea pe server este acceptată; interacțiunile necesită și randare sau hidratare în browser.

Versiunile alpha pot modifica API-ul. O integrare de form builder poate fixa versiuni exacte pentru a controla actualizările.

Codul folosește licența MIT. Notificările pentru fonturi și modelul decorativ vectorial sunt incluse în pachetul core.
