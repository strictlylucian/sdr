# SDR core — Sistem de Design Românesc

[English](./README.md)

Propunere independentă de sistem de design românesc. Versiune alpha experimentală, fără afiliere guvernamentală sau certificare de conformitate.

Pachetul conține stiluri, tokenuri și interacțiuni pentru HTML. Etichetele, traducerile și funcțiile de formatare sunt furnizate de aplicație; biblioteca nu conține dicționare sau un mecanism i18n. Fontul Inter este inclus în CSS, iar motivul decorativ este desenat prin măști SVG incluse în CSS, folosind paleta SDR, fără un fișier imagine separat.

## Instalare

```sh
npm install @strictlylucian/sdr-core@alpha
```

## Integrare cu un bundler

```js
import '@strictlylucian/sdr-core/styles.css';
import { init, destroy } from '@strictlylucian/sdr-core';

const release = init(document);
// Înainte de înlocuirea unei pagini sau a unui fragment:
release();
// Sau, pentru un container:
destroy(document);
```

Interacțiunile sunt activate explicit pentru elementele cu data-sdr-component. Elementele gestionate de React sunt omise. Conținutul adăugat ulterior poate fi inițializat prin init(container). Contorul de caractere necesită init(root, { formatCount }), cu funcția de formatare a aplicației; valorile negative indică depășirea limitei. Etichetele pentru parolă și acordeon sunt furnizate prin atributele HTML documentate.

## Integrare fără bundler

Fișierele dist/sdr.css și dist/sdr.js formează ediția cu două fișiere. Aplicația încarcă CSS-ul, scriptul clasic și propriul script, care apelează SDR.init(document). SDR.destroy(container) elimină interacțiunile.

Exportul @strictlylucian/sdr-core/portable.js permite rezolvarea fișierului clasic de către instrumentele de copiere a resurselor. Aplicațiile cu bundler folosesc exporturile ESM obișnuite.

Validarea pe server, trimiterea formularelor, salvarea datelor și integrarea plăților aparțin aplicației. Logica demonstrativă din documentație nu face parte din pachet.

## Licențe

Codul folosește licența MIT. Inter folosește SIL OFL 1.1; notificarea din CSS și fișierul dist/INTER-LICENSE.txt se păstrează.
