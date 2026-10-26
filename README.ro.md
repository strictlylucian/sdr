# SDR — Sistem de Design Românesc

[English](README.md) · [Repository](https://github.com/strictlylucian/sdr)

**Propunere independentă · 0.1.0-alpha.1 · Implementare experimentală.**

SDR oferă componente React, stiluri comune și o ediție HTML cu două fișiere pentru interfețele serviciilor publice. Documentația și exemplele sunt în română și engleză. Proiectul nu pretinde afiliere guvernamentală sau certificare de accesibilitate.

## Rularea proiectului

Sunt necesare Node 22.23.4 sau mai nou și npm 11. Fișierul lock fixează dependențele, inclusiv versiunea locală de Node folosită de scripturile npm. Comenzile se rulează din rădăcina repository-ului:

```sh
npm ci
npm run build:library
npm run docs:generate
npm run dev
```

Documentația se deschide la `/ro/` sau `/en/` pe serverul local. Serverul de dezvoltare ascultă doar pe localhost. Pentru versiunea construită, cu căutare, disponibilă în rețeaua locală:

```sh
npm run build
npm run preview:lan
```

Build-ul documentației se finalizează într-un director intermediar înainte de actualizarea directorului servit, `apps/docs/dist/`.

## Verificări

```sh
npx playwright install chromium firefox webkit
npm run verify
```

Pe Linux, dependențele browserelor se instalează cu `npx playwright install --with-deps chromium firefox webkit`. Verificarea construiește proiectul și controlează sursele, tipurile, acoperirea testelor componentelor/controlerelor, instalarea arhivelor și comportamentul în browser.

Chromium verifică întregul catalog React/HTML în ambele limbi, inclusiv stările formularelor, scanări axe, layout-uri la 320/1280px și text mărit la 200%. Chromium, Firefox și WebKit verifică interacțiunile native, formularele, exemplul Page, temele și alinierea erorilor. Tabelele și codul păstrează scroll-ul în propriul container. Detaliile sunt în [TESTING.md](TESTING.md).

## Pachete

- `@sdr/core`: tokenuri, stiluri și controlere pentru interacțiunile HTML.
- `@sdr/react`: componente React cu tipuri TypeScript, conținut furnizat de aplicație și compoziții reutilizabile.
- `dist/portable/sdr.css` și `dist/portable/sdr.js`: cele două fișiere de distribuție, cu fonturile Inter și măștile SVG incluse în CSS.
- `apps/docs`: documentație Astro Starlight, exemple interactive, tabele API și resurse i18next folosite doar în docs.

`npm run pack:release` construiește și verifică arhivele locale. Directorul `output/release/0.1.0-alpha.1/` conține arhivele celor două pachete, ediția portabilă și sumele SHA-256. Comanda pregătește fișiere locale; pachetele nu sunt publicate pe npm. Deținerea scope-ului npm `@sdr` rămâne neconfirmată.

Aplicațiile React instalează ambele arhive, importă `@sdr/core/styles.css` o singură dată și plasează componentele într-un `SdrProvider`. Manifestele declară React/React DOM >=18.3; verificările actuale în aplicația consumatoare și în browsere folosesc React 19. Versiunea minimă declarată are nevoie de o verificare separată.

Aplicațiile HTML copiază cele două fișiere, furnizează structura semantică și inițializează componentele din propriul script. `SDR.init(root)` returnează o funcție de curățare; contorul de caractere necesită și funcția `formatCount` a aplicației. Elementele React sunt gestionate prin efectele React. Logica serviciului, validarea, navigarea, salvarea și traducerile aparțin aplicației.

## Design și documentație

Cele patru teme folosesc același contract de tokenuri. Densitățile comfortable și compact păstrează dimensiunea textului. Spațierea, layout-ul și override-urile provin din aceeași scară. Utilitarele folosesc prefixul `sdr-u-*`. Variantele componentelor și scenariile modelelor sunt documentate în paginile lor părinte.

Biblioteca nu conține dicționare sau un mecanism i18n. Documentația folosește i18next și fișiere JSON locale în română și engleză. Definițiile componentelor, variantelor, modelelor și stărilor sunt în `catalog/data/`. Sursele editabile sunt descrise în [I18N.md](I18N.md).

Exemplele formularelor includ eroare, disabled și read-only nativ. Pentru controalele fără readonly în HTML sunt documentate valori fixe în SummaryList. Planșele de identitate instituțională sunt studii experimentale în docs, separate de identitatea implicită a bibliotecii.

## Dovezi și limite

Ținta este WCAG 2.2 AA. Verificările automate acoperă exemplele testate; NVDA, VoiceOver, TalkBack și cercetarea cu persoane cu dizabilități rămân neverificate. API-urile sunt experimentale, iar integrările pot fixa versiuni exacte. Alte detalii sunt în [DESIGN.md](DESIGN.md), [TESTING.md](TESTING.md) și [CHANGELOG.md](CHANGELOG.md).

Codul are licență MIT. Inter folosește SIL OFL 1.1, cu notificarea inclusă în CSS și în arhiva core. Autorul și licența referinței pentru altița reconstruită rămân neconfirmate în `catalog/motif-provenance.json`; licența codului nu stabilește drepturi asupra referinței. Planșele originale furnizate pentru studiile de identitate sunt resurse ale documentației, separate de fișierele runtime.

## Repository și hosting

Repository-ul public este [strictlylucian/sdr](https://github.com/strictlylucian/sdr). Documentația este publicată la [strictlylucian.github.io/sdr](https://strictlylucian.github.io/sdr/).

Workflow-ul Deploy documentation construiește și publică GitHub Pages la push pe main sau la pornire manuală. Doar job-ul de deploy are drepturi de scriere pentru Pages. Verificarea pachetelor rulează separat; publicarea npm rămâne manuală și nu a avut loc.

`npm run build:pages` generează site-ul în `output/pages/sdr/`, cu prefixul `/sdr/`; `npm run test:pages` verifică rutele publicate și interacțiunile în browser. Comanda obișnuită `npm run build` păstrează rutele fără prefix pentru localhost și LAN. Rezultatele CI sunt disponibile în tabul Actions al repository-ului.
