SDR înseamnă **Sistem de Design Românesc**. Este o **propunere independentă, disponibilă într-o versiune alpha experimentală**, nu un sistem oficial al Guvernului României.

## Distribution first

SDR pornește de la o bază comună, care poate fi distribuită și integrată în aplicații construite cu tehnologii diferite. Principiul este „Distribution first”: core definește limbajul vizual, structura HTML semantică și comportamentele interactive, iar integrările pentru framework-uri se construiesc peste această bază.

Proiectele de infrastructură digitală din România sunt dezvoltate de instituții, furnizori și echipe diferite, pe platforme existente și cu cerințe proprii. Un limbaj de design comun ar trebui să poată fi adoptat în acest ecosistem fragmentat, păstrând libertatea echipelor de a alege arhitectura frontend. SDR poate fi integrat în aplicații cu randare pe server, interfețe randate în browser și pagini HTML statice.

SDR este distribuit prin pachetele @strictlylucian/sdr-core și @strictlylucian/sdr-react.

| Pachet | Rol |
|---|---|
| core | Baza independentă de framework: CSS comun, tokenuri de design, fonturi incluse, teme și comportamente pentru interacțiunile DOM. Distribuția portabilă completă pentru browser are două fișiere, sdr.css și sdr.js. |
| react | Integrarea pentru React: componente cu tipuri TypeScript, construite pe aceleași stiluri și comportamente, cu un ciclu de viață adaptat React. |

Contractul cu două fișiere se referă la resursele runtime din browser. Pachetul npm core oferă și exporturi de module și declarații TypeScript pentru integrările care folosesc un bundler.

React este integrarea implicită în acest repository datorită utilizării sale pe scară largă și ecosistemului familiar multor dezvoltatori. Este una dintre modalitățile de a folosi SDR; alegerea SDR nu presupune alegerea React. Aceeași bază poate susține pachete pentru alte framework-uri, cu un limbaj de design comun tuturor integrărilor.

## Integrarea în React

~~~sh
npm install @strictlylucian/sdr-core@alpha @strictlylucian/sdr-react@alpha
~~~

Pachetele core și React se folosesc la aceeași versiune. React și React DOM sunt dependențe peer, furnizate de aplicație. Pentru contribuții la codul sursă, npm run pack:release pregătește arhive locale.

~~~tsx
import { SdrProvider, Button, Stack, TextInput } from '@strictlylucian/sdr-react';
import '@strictlylucian/sdr-core/styles.css';

export function Application() {
  return <SdrProvider lang="ro" theme="light">
    <form onSubmit={event => event.preventDefault()}><Stack><TextInput label="Nume complet" name="name" autoComplete="name" />
      <Button type="submit">Continuă</Button></Stack></form>
  </SdrProvider>;
}
~~~

SdrProvider se plasează la nivelul aplicației sau al unei secțiuni, nu în jurul fiecărei componente. Acesta stabilește tema și densitatea; atributul nativ lang este transmis mai departe, fără alegerea traducerilor. Stilurile SDR se aplică doar în interiorul containerului său. Butoanele de trimitere funcționează în formularul definit de aplicație.

## Integrarea cu CSS și JavaScript

Core poate fi instalat separat de React:

~~~sh
npm install @strictlylucian/sdr-core@alpha
~~~

Pentru integrarea directă în browser, fișierele dist/sdr.css și dist/sdr.js din pachetul core instalat se copiază în directorul de resurse statice al aplicației. În acest repository, perechea echivalentă se găsește după build în dist/portable/. Integrările cu bundler pot folosi API-ul de module din core și exportul @strictlylucian/sdr-core/styles.css. Exemplele componentelor oferă structura HTML, iar SDR.init(document) activează interacțiunile. CSS-ul include toate temele, iar JavaScript-ul toate comportamentele. Nu se descarcă separat fonturi, iconuri sau alte resurse.

Fișierele se includ o singură dată în șablonul paginii, în această ordine:

~~~html
<link rel="stylesheet" href="/assets/sdr.css">
<script src="/assets/sdr.js" defer></script>
<script src="/assets/app.js" defer></script>
~~~

În fișierul aplicației, /assets/app.js, inițializarea arată astfel:

~~~js
const dispose = SDR.init(document);
~~~

Pentru contoarele de caractere, init primește și funcția formatCount(remaining, element), furnizată de aplicație. Valorile negative indică depășirea limitei; formularea și pluralul aparțin sistemului de traduceri al aplicației. Etichetele pentru parolă și acordeon sunt furnizate prin atributele HTML din exemple.

~~~js
PORTABLE_COUNT_EXAMPLE
~~~

Atributele data-sdr-component identifică elementele care au interacțiuni. Funcția dispose() elimină comportamentele inițializate prin acel apel, înainte de ștergerea conținutului. Pentru conținut adăugat ulterior, SDR.init(container) inițializează noua secțiune. app.js este fișierul aplicației, separat de cele două fișiere SDR.

Exemplele interactive din documentație folosesc și logica demonstrativă din portable-demo.js. Atributele data-sdr-pattern-demo, data-sdr-toast-show și data-sdr-toast-example sunt specifice exemplelor, nu fac parte din API-ul SDR. Aplicația gestionează afișarea toast-urilor; biblioteca asigură închiderea și revenirea focusului. Ele nu activează plăți, SMS-uri sau salvare pe server. Într-o aplicație, aceste acțiuni sunt implementate de serviciu.

ID-urile precum email și email-error sunt exemple. Într-o pagină, fiecare ID este unic și corespunde referințelor din for, aria-describedby, aria-labelledby, aria-controls și href.

Aplicația gestionează acțiunile serviciului, salvarea datelor și validarea pe server. În ediția portabilă, CookieBanner, Feedback și DismissibleChip emit evenimentul sdr:action, cu acțiunea în detail.action; Toast emite sdr:dismiss. Butoanele obișnuite folosesc evenimentele native. Callback-urile din exemplele React au nevoie de o implementare echivalentă în aplicațiile HTML.

Cele două fișiere reprezintă biblioteca SDR; HTML-ul și logica serviciului sunt furnizate de aplicație. Pentru o politică CSP strictă, inițializarea poate rămâne într-un fișier JavaScript extern. Fonturile incluse în CSS necesită data: în directiva font-src, de exemplu `font-src 'self' data:`. Măștile SVG ale altiței folosesc data: în img-src. SDR nu necesită unsafe-eval.

## Integrări pentru alte framework-uri

Sunt binevenite contribuțiile care adaugă pachete pentru alte framework-uri. O integrare pentru Vue, Angular, Svelte sau șabloane randate pe server poate porni de la core. Fiecare integrare poate oferi API-ul și modul de randare familiar dezvoltatorilor săi, păstrând tokenurile, stilurile, structura HTML semantică și cerințele comune de interacțiune și accesibilitate.

Adaptorul gestionează randarea și ciclul de viață specifice framework-ului, inclusiv inițializarea după montarea elementelor și curățarea la eliminarea lor. Core rămâne punctul comun pentru îmbunătățirile de design și comportament. Pachetele noi pot fi adăugate alături de React în packages/; întreținerea, exemplele și verificările urmează [recomandările pentru contribuții](/ro/contributing/). [Arhitectura și API-ul](/ro/architecture/) descriu limitele integrării.

## Rularea proiectului local

Proiectul necesită Node 22.23.4 sau mai nou și npm 11. Scripturile npm folosesc versiunea locală de Node inclusă în proiect.

~~~sh
npm ci
npm run build:library
npm run docs:generate
npm run dev
~~~

Documentația este disponibilă la /ro/ și /en/ pe serverul local. Comanda npm run verify verifică sursele, tipurile, testele unitare, build-ul documentației și interacțiunile în browser. Testele de browser folosesc cele trei motoare, instalate cu `npx playwright install chromium firefox webkit`. Pe Linux, comanda este `npx playwright install --with-deps chromium firefox webkit`.

## Browsere și funcționare fără JavaScript

Biblioteca folosește dialog și details native, variabile CSS și ES2022. Playwright verifică interacțiunile native în Chromium, Firefox și WebKit; Chromium verifică și întregul catalog React/HTML cu axe, layout-uri înguste și text mărit la 200%. Automatizarea WebKit nu reprezintă testare manuală în Safari/iOS. NVDA, VoiceOver, TalkBack și cercetarea cu utilizatori rămân neverificate. Formularele esențiale au nevoie de trimitere la server și fără JavaScript. O funcție disponibilă doar într-un dialog are nevoie de o alternativă accesibilă când JavaScript nu rulează.
