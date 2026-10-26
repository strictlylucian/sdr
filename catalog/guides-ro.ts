import { localisationContent } from './content';
export const guidesRo: Record<string, { title: string; body: string }> = {
  'getting-started': { title: 'Instalare și integrare', body: `
SDR înseamnă **Sistem de Design Românesc**. Este o **propunere independentă, disponibilă într-o versiune alpha experimentală**, nu un sistem oficial al Guvernului României. Pachetele se instalează local; nu sunt încă publicate într-un registru de pachete.

## Rularea proiectului local

Proiectul necesită Node 22.23.4 sau mai nou și npm 11. Scripturile npm folosesc versiunea locală de Node inclusă în proiect.

~~~sh
npm ci
npm run build:library
npm run docs:generate
npm run dev
~~~

Documentația este disponibilă la /ro/ și /en/ pe serverul local. Comanda npm run verify verifică sursele, tipurile, testele unitare, build-ul documentației și interacțiunile în browser. Testele de browser folosesc cele trei motoare, instalate cu \`npx playwright install chromium firefox webkit\`. Pe Linux, comanda este \`npx playwright install --with-deps chromium firefox webkit\`.

## Integrarea în React

Comenzile npm pack -w @sdr/core și npm pack -w @sdr/react creează arhivele celor două pachete, după build. Ambele arhive se instalează în aplicația care va folosi SDR. React și React DOM sunt dependențe peer: aplicația furnizează aceste biblioteci.

~~~tsx
import { SdrProvider, Button, Stack, TextInput } from '@sdr/react';
import '@sdr/core/styles.css';

export function Application() {
  return <SdrProvider lang="ro" theme="light">
    <form onSubmit={event => event.preventDefault()}><Stack><TextInput label="Nume complet" name="name" autoComplete="name" />
      <Button type="submit">Continuă</Button></Stack></form>
  </SdrProvider>;
}
~~~

SdrProvider se plasează la nivelul aplicației sau al unei secțiuni, nu în jurul fiecărei componente. Acesta stabilește tema și densitatea; atributul nativ lang este transmis mai departe, fără alegerea traducerilor. Stilurile SDR se aplică doar în interiorul containerului său. Butoanele de trimitere funcționează în formularul definit de aplicație.

## Integrarea cu CSS și JavaScript

Ediția portabilă conține două fișiere: dist/portable/sdr.css și dist/portable/sdr.js. Acestea pot fi copiate în directorul de resurse statice al aplicației. Exemplele componentelor oferă structura HTML, iar SDR.init(document) activează interacțiunile. CSS-ul include toate temele, iar JavaScript-ul toate comportamentele. Nu se descarcă separat fonturi, iconuri sau alte resurse.

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

Cele două fișiere reprezintă biblioteca SDR; HTML-ul și logica serviciului sunt furnizate de aplicație. Pentru o politică CSP strictă, inițializarea poate rămâne într-un fișier JavaScript extern. Fonturile incluse în CSS necesită data: în directiva font-src, de exemplu \`font-src 'self' data:\`. Măștile SVG ale altiței folosesc data: în img-src. SDR nu necesită unsafe-eval.

## Browsere și funcționare fără JavaScript

Biblioteca folosește dialog și details native, variabile CSS și ES2022. Playwright verifică interacțiunile native în Chromium, Firefox și WebKit; Chromium verifică și întregul catalog React/HTML cu axe, layout-uri înguste și text mărit la 200%. Automatizarea WebKit nu reprezintă testare manuală în Safari/iOS. NVDA, VoiceOver, TalkBack și cercetarea cu utilizatori rămân neverificate. Formularele esențiale au nevoie de trimitere la server și fără JavaScript. O funcție disponibilă doar într-un dialog are nevoie de o alternativă accesibilă când JavaScript nu rulează.
` },
  architecture: { title: 'Arhitectură și API', body: `
## Organizarea proiectului

- packages/core: tokenuri, stiluri și controlere pentru interacțiunile DOM; etichetele și formatarea aparțin aplicației.
- packages/react: componente React cu tipuri TypeScript și grupuri de componente pentru formulare și pagini. React este dependență peer.
- dist/portable: cele două fișiere de distribuție, sdr.css și sdr.js.
- apps/docs: documentația Astro Starlight, în română și engleză, cu exemple React interactive și exemple HTML.
- catalog: descrierile și recomandările pentru componente și modele de utilizare.

Edițiile React și HTML folosesc aceleași stiluri și controlere, pornind de la elemente HTML native. Atributele data-sdr-* fac parte din API-ul public; nu depind de selectori CSS care urmăresc accidental structura paginii.

## Inițializare și curățare

SDR.init(root) inițializează atât elementul primit, cât și componentele din interiorul lui. Apelurile repetate nu dublează event listener-ele. Funcția returnată elimină doar comportamentele adăugate prin apelul respectiv. SDR.destroy(root) elimină comportamentele dintr-o secțiune. Conținutul HTML nou se inițializează după adăugarea în pagină. Inițializarea portabilă ignoră componentele gestionate de React.

defaultSelected pentru Tabs și defaultPressed pentru ToggleButton stabilesc doar valorile inițiale. Nu sunt proprietăți controlate: componenta gestionează starea după inițializare. Taburile se reinițializează când configurația se schimbă. Navigarea, cererile de rețea, salvarea datelor, validarea și aplicarea preferințelor pentru cookie-uri sunt gestionate de aplicație.

## Evenimente

În ediția HTML, CookieBanner, Feedback și DismissibleChip emit sdr:action cu detail.action. Valorile sunt accept, reject, helpful, unhelpful și remove. În React există callback-uri echivalente. Toast emite sdr:dismiss după mutarea focusului. Event listener-ele aplicației se pot atașa unui container local și se elimină la demontarea lui.

## Stiluri și personalizare

Clasele au prefixul sdr-, iar variabilele CSS au prefixul --sdr-. Componentele folosesc proprietăți CSS logice, compatibile cu direcția textului. Variabilele și clasele de spațiere sunt generate din aceeași scară de valori. Tokenurile comune permit personalizarea consecventă a întregului serviciu.

## Versiuni

Versiunea 0.1.0-alpha.1 este experimentală. Modificările incompatibile sunt documentate. O versiune stabilă presupune revizuirea API-ului, testare cu persoane cu dizabilități, verificări manuale în browsere și cititoare de ecran și o politică de suport publicată.
` },
  'foundations/spacing': { title: 'Spațiere și layout', body: `
Toate componentele folosesc aceeași scară de spațiere pentru gap, padding și margin. Verificările proiectului detectează valorile introduse în afara acestei scări. Excepția documentată este utilitarul care ascunde vizual conținutul destinat cititoarelor de ecran.

| Token | rem | La 16 px/rem | Utilizare |
|---|---|---|---|
| 0 | 0 | 0 | Eliminarea spațiului |
| 1 | .25 | 4 px | Separare discretă |
| 2 | .5 | 8 px | Etichetă și text explicativ |
| 3 | .75 | 12 px | Grupuri de controale |
| 4 | 1 | 16 px | Spațiu la marginea conținutului |
| 5 | 1.5 | 24 px | Grupuri de câmpuri |
| 6 | 2 | 32 px | Coloane și zone de pagină |
| 7 | 3 | 48 px | Secțiuni |
| 8 | 4 | 64 px | Secțiuni mari de prezentare |
| 9 | 6 | 96 px | Separarea unor zone ample |

Valorile rem se adaptează dimensiunii de text alese în browser. Variabilele --sdr-field-gap, --sdr-group-gap, --sdr-section-gap și --sdr-layout-gap grupează distanțele după rol. Modificarea unei variabile actualizează toate componentele care o folosesc.

Stack așază elementele pe verticală. Cluster le trece pe rândul următor când nu mai încap. Grid organizează elemente repetate în coloane, Container aliniază conținutul paginii, iar SidebarLayout așază navigarea lângă conținut. Folosirea gap evită cumularea marginilor elementelor vecine. Distanțele mai mici între elementele aceluiași grup le fac mai ușor de recunoscut ca grup.

Grid cu columns=2 sau columns=3 limitează numărul de coloane și păstrează o lățime minimă de 16rem pentru fiecare. Numărul de coloane depinde de spațiul disponibil componentei, inclusiv într-un container îngust pe un ecran mare. SidebarLayout trece pe o singură coloană când cele două zone nu mai încap alături. Containerul principal are maximum 64rem, iar blocurile de text maximum 68ch. Tabelele late se derulează în propriul container, care are un nume accesibil și poate primi focus.

Spațierea se adaptează la lățimea ecranului. De la 40rem, --sdr-group-gap crește de la 16px la 24px, --sdr-layout-gap de la 16px la 32px, iar --sdr-section-gap de la 32px la 48px. Stack fără gap explicit folosește distanța de grup. Valorile gap explicite și clasele utilitare numerotate păstrează distanța aleasă.
` },
  'foundations/typography': { title: 'Tipografie', body: `
SDR folosește Inter 4.1 în bibliotecă și în documentație. Variantele variabile regular și italic sunt incluse direct în CSS, în format WOFF2, cu greutăți de la 400 la 750, intervalul folosit de componente. Fonturile sunt optimizate pentru caractere latine și Latin Extended, inclusiv nume internaționale, accente combinate, semne de punctuație și monede. Pentru alte alfabete se folosesc fonturile sistemului de operare. Dimensiunea optică, cifrele tabulare și hinting-ul sunt păstrate. Nu există cereri separate pentru fonturi, iar ediția portabilă păstrează cele două fișiere. Inter include diacriticele românești, inclusiv Ș/ș și Ț/ț cu virgulă dedesubt. Codul păstrează un font monospace. Familia poate fi schimbată prin --sdr-font pentru identitatea unei instituții.

| Token | rem | Utilizare |
|---|---|---|
| xs | .875 | Note și etichete |
| sm | 1 | Text suplimentar |
| md | 1.125 | Text principal |
| lg | 1.25 | Text introductiv |
| xl | 1.5 | Titluri de subsecțiune |
| 2xl | 2 | Titluri de secțiune |
| 3xl | 3 | Titluri de pagină |
| 4xl | 4 | Titluri mari de prezentare |

Nivelul unui titlu reflectă structura documentului. Proprietatea size schimbă doar dimensiunea vizuală, independent de nivel. line-height este 1.6 pentru text și 1.25 pentru titluri. Titlurile pot ocupa mai multe rânduri. Prose limitează lățimea textului la 68ch, iar sdr-u-tabular aliniază cifrele folosind aceeași lățime pentru fiecare.

Textele includ ă, â, î, ș și ț, precum și majusculele lor. Nume ca Șerban, Târgu Mureș și Dâmbovița ajută la verificarea unui font alternativ. Câmpurile păstrează textul Unicode introdus; normalizarea datelor se tratează separat de afișare.

Textul din câmpuri are minimum 1rem. Țintele de accesibilitate includ mărirea textului la 200% și folosirea paginii la o lățime de 320 pixeli CSS. Linkurile sunt subliniate, pentru a putea fi recunoscute și fără culoare. Etichetele rămân vizibile după completare, spre deosebire de placeholder.
` },
  'foundations/themes': { title: 'Culori, teme și densitate', body: `
Cele patru teme — light, dark, heritage și contrast — folosesc aceleași roluri de culoare. Heritage combină un fundal cald, apropiat de hârtie, cu albastru închis și accente roșii. Contrast oferă o paletă cu contrast ridicat. Modul forced-colors al sistemului este tratat separat.

În React, tema se stabilește prin proprietatea theme a SdrProvider. În HTML, se folosește data-sdr-theme pe un element cu clasa .sdr. Valoarea dark activează tema întunecată. Secțiunile pot avea teme diferite. Aplicația salvează preferința; biblioteca nu scrie în localStorage și nu aplică automat o temă globală. Exemplele din documentație urmează tema paginii, dar permit și alegerea unei alte teme pentru fiecare exemplu.

Rolurile de culoare sunt canvas, surface, subtle, text, muted, border, divider, action, action-hover, on-action, link, focus, focus-gap, danger, success, warning, info și fundalurile asociate. Accentul decorativ are un rol separat de erori și linkuri. Valorile sunt definite în packages/core/src/tokens.ts. Erorile și acțiunile distructive folosesc #CA3535 în Light și Heritage. Dark folosește #D76868 pentru textul de eroare pe fundal întunecat, iar Contrast folosește #982828. Rolul semantic danger se adaptează temei; culoarea decorativă flag-red rămâne neschimbată.

Butoanele principale folosesc același albastru ca header-ul și navigarea: #002B7F, în toate temele. Textul este alb, iar în tema dark conturul mai deschis păstrează vizibilă marginea butonului. Rolurile sunt button-bg, button-hover, on-button și button-border. La apăsare și la focus din tastatură se păstrează galbenul drapelului.

Țintele de contrast sunt 4.5:1 pentru text obișnuit, 3:1 pentru text mare și 3:1 pentru contururile care ajută la identificarea controalelor. Liniile pur decorative nu au acest rol. Stările sunt descrise și prin text, nu doar prin culoare. Contrastul acțiunilor este verificat atât în starea obișnuită, cât și la hover. Indicatorul de focus are un contur separat de fundal.

În modul comfortable, controalele au o înălțime minimă de 3rem; în compact, de 2.75rem. Modul compact nu micșorează textul sau indicatorii de focus. Combinațiile de teme și densități sunt verificate pe exemplele bibliotecii. Rezultatele automate nu înlocuiesc testarea paginilor complete ale unui serviciu.
` },
  'foundations/overrides': { title: 'Clase utilitare și override-uri', body: `
Clasele utilitare sunt generate din aceleași tokenuri ca și componentele. Ele permit ajustări locale ale layout-ului, fără introducerea unui set separat de valori CSS.

- sdr-u-margin-0 până la sdr-u-margin-9 și clasele echivalente pentru padding.
- Direcții: top, bottom, left, right, block și inline. Left și right corespund proprietăților logice inline-start și inline-end.
- sdr-u-gap-0 până la sdr-u-gap-9, precum și row-gap și column-gap.
- sdr-u-md-padding-5 și variantele echivalente se aplică de la 48rem.
- sdr-u-width-full, three-quarters, two-thirds, one-half, one-third, one-quarter și auto. Sub 40rem, lățimile fracționare devin 100%; auto păstrează lățimea naturală.
- sdr-u-text-xs până la sdr-u-text-4xl; sdr-u-weight-regular, medium și bold.
- sdr-u-text-start, center și end; sdr-u-tabular și sdr-u-measure.
- sdr-u-display-block, inline, inline-block, none, flex și grid; sdr-u-hide-print.
- sdr-visually-hidden ascunde vizual conținutul, dar îl păstrează pentru cititoarele de ecran. Conținutul devine vizibil dacă primește focus.

Prefixul canonic al utilitarelor este sdr-u-. Clasele numerotate păstrează valoarea aleasă; sdr-u-md-* aplică aceeași ajustare de la 48rem.

Override-urile folosesc !important, inclusiv pentru resetarea la zero. display-none ascunde conținutul și cititoarelor de ecran; sdr-visually-hidden îl păstrează accesibil acestora. Variabilele CSS pot fi folosite și în stilurile aplicației, pentru aceeași spațiere ca în componente.
` },
  'foundations/content': { title: 'Localizare', body: localisationContent.ro },
  'foundations/culture': { title: 'Identitate vizuală românească', body: `
## Altiță

Banda decorativă reproduce geometria modelului de referință: rozete cu ramuri în trepte și centru în carouri, romburi, colțuri în cârlig și chenare alternante. Roșul original este înlocuit cu roșul drapelului, iar negrul cu albastrul. Spațiile albe folosesc culoarea comună on-masthead. Desenul este reconstruit prin trasee SVG incluse în CSS; biblioteca nu include fotografia de referință sau o imagine bitmap.

<div className="sdr-motif" aria-hidden="true" />

Broderia cu altiță face parte din patrimoniul cultural al României și al Republicii Moldova. [Documentarea UNESCO](https://ich.unesco.org/en/RL/01861) descrie varietatea regională a tehnicilor și ornamentelor. Varianta SDR este o interpretare digitală a acestor forme, fără atribuirea unei regiuni sau a unei semnificații simbolice neverificate.

Motif și clasa sdr-motif folosesc același desen în exemplele bibliotecii. Repetiția de 194 × 225 de unități păstrează coordonatele pixelilor din modelul de referință, inclusiv lățimile inegale ale cusăturilor și centrul în carouri. Două măști SVG incluse în CSS separă desenul de culorile paletei. Rombul continuă peste marginea orizontală în repetiția următoare, astfel încât forma rămâne întreagă. Toate culorile provin din variabilele paletei SDR. Înălțimea implicită a benzii orizontale este de 3rem (48px la baza de 16px). Headerul, hero-ul și footerul documentației nu folosesc momentan acest ornament. Proprietatea size acceptă sm (24px), md (48px, implicit), lg (64px) și xl (96px); ediția HTML folosește clasele sdr-motif--sm, sdr-motif--md, sdr-motif--lg și sdr-motif--xl. Proprietatea --sdr-motif-size permite și alte înălțimi. Desenul se scalează proporțional și se repetă orizontal, fără fișiere imagine separate, elemente suplimentare sau cereri de rețea. Decorul este separat de text și controale, ascuns tehnologiilor asistive și eliminat în modul de culori forțate.

Instituțiile pot adăuga propriile elemente vizuale în afara controalelor funcționale. Autorul și licența referinței pentru banda inclusă rămân neconfirmate în catalog/motif-provenance.json; reconstrucția SVG nu stabilește drepturi asupra referinței. Fotografia de referință nu este inclusă.

Header acceptă o emblemă opțională, furnizată de aplicație, fără o emblemă instituțională implicită. [Studiile experimentale de identitate](/ro/studies/institutional-identity/) sunt materiale ale documentației, separate de pachetele bibliotecii.
` },
  accessibility: { title: 'Accesibilitate și verificări', body: `
## Obiectiv și stadiu

SDR urmărește WCAG 2.2, nivel AA, cu cerințe suplimentare pentru dimensiunea controalelor și vizibilitatea focusului. Versiunea alpha nu are audit independent, testare cu participanți cu dizabilități sau certificare. Testele automate confirmă doar verificările efectuate pe exemple; nu demonstrează conformitatea unui serviciu construit cu SDR.

## Ce se verifică

- Nume, roluri și stări ale elementelor native; etichete vizibile; explicații și erori asociate câmpurilor.
- Navigare cu tastatura fără blocaje, focus vizibil, închiderea dialogurilor cu Escape și revenirea focusului.
- Taburi: tastele Stânga/Dreapta, Home/End și un singur element accesibil cu Tab, inclusiv pentru text de la dreapta la stânga.
- Patru teme, două densități, text mărit la 200%, layout la 320 pixeli CSS, forced-colors și preferința pentru mișcare redusă.
- Folosirea managerilor de parole și lipirea parolelor sau codurilor, fără cerințe inutile de memorare.
- Stări explicate și prin text, mesaje importante fără închidere automată și instrucțiuni esențiale afișate permanent.

## Browsere și tehnologii asistive

npm run test:e2e verifică interacțiunile native în Chromium, Firefox și WebKit. În Chromium sunt verificate și accesibilitatea și layout-urile întregului catalog. npm test rulează testele componentelor, interacțiunilor HTML și contrastului. Rezultatele sunt disponibile în jurnalele fiecărei rulări. NVDA cu Firefox/Chrome, VoiceOver cu Safari/iOS, TalkBack cu Android, dictarea și dispozitivele de acces cu comutatoare nu au fost încă verificate. Rezultatele acestor verificări vor fi consemnate în raportul versiunii.

## Limite cunoscute

DatePicker și TimeInput folosesc interfețele browserului. TreeView oferă navigare cu secțiuni care se deschid, fără modelul ARIA tree. PopoverMenu folosește Tab pentru navigare, fără modelul ARIA menu. CharacterCount numără puncte de cod Unicode. DataTable sortează în browser, fără paginare pe server sau celule editabile. ExitThisPage este un link fără scurtătură de tastatură. Accordion folosește details nativ și un buton pentru deschiderea sau închiderea tuturor secțiunilor.

## Cerințe europene

EN 301 549 include și cerințe pentru documentație și suport, pe lângă cele acoperite de WCAG. Evaluarea unui serviciu include cerințele aplicabile, întregul parcurs de utilizare, declarația de accesibilitate și o modalitate de a semnala probleme.

Referințe: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) și [ghidul Comisiei Europene](https://digital-strategy.ec.europa.eu/en/policies/web-accessibility-directive-standards-and-harmonisation).

## Teste automate și rapoarte

Componentele React și interacțiunile ediției HTML sunt testate cu Vitest, React Testing Library, user-event și jest-dom. Testele verifică etichetele și descrierile accesibile, formularele native, ref-urile, callback-urile, câmpurile controlate, Unicode, tastatura, actualizarea proprietăților și eliberarea resurselor. npm run test:coverage include toate fișierele TypeScript din core și React, inclusiv cele neimportate de teste. Pragurile obligatorii sunt 90% pentru linii, instrucțiuni și funcții și 85% pentru ramuri. Rapoartele sunt generate în coverage/.

Playwright Test verifică dialogurile native, focusul, navigarea și formularele în Chromium, Firefox și WebKit. În Chromium sunt verificate și toate exemplele React/HTML în ambele limbi, cu axe și la dimensiuni diferite. La eșec sunt păstrate capturi și trase de execuție. Rapoartele HTML și JUnit sunt generate în playwright-report/ și test-results/. npm run test:packages instalează arhivele reale într-o aplicație separată, pentru verificarea tipurilor și randarea pe server.

npm run verify construiește proiectul și rulează toate verificările de lansare. Rapoartele descriu exemplele testate în rularea respectivă; nu reprezintă o certificare de accesibilitate și nu înlocuiesc verificările manuale cu tehnologii asistive.

` },
  contributing: { title: 'Contribuții și lansări', body: `
O contribuție pornește de la o nevoie concretă și are un responsabil pentru întreținere. Include recomandări în română și engleză, un exemplu funcțional, stările relevante și rezultatele verificărilor cu tastatura și cititoare de ecran. Ediția portabilă păstrează cele două fișiere de distribuție.

npm run verify acoperă dimensiunea fișierelor sursă, spațierea, versiunile de limbă, tipurile, comportamentele, contrastul, pachetele și interacțiunile în browser. După modificarea surselor, npm run docs:generate actualizează API-ul și exemplele din documentație.

Toate componentele sunt experimentale în 0.1.0-alpha.1. O versiune stabilă presupune testare reprezentativă cu persoane cu dizabilități, verificări manuale în browsere și tehnologii asistive, limite documentate, API revizuit și un angajament de suport.

Un raport de problemă include componenta, versiunea, browserul, tehnologia asistivă, pașii de reproducere și rezultatul așteptat. Exemplele nu conțin acte sau date personale reale. Repository-ul desemnat este [strictlylucian/sdr](https://github.com/strictlylucian/sdr). Rapoartele locale și rezultatele CI de pe GitHub reprezintă dovezi separate. Rulările curente sunt disponibile în tabul Actions. Documentația se publică prin workflow-ul GitHub Pages, la push pe main.

Modificările tokenurilor sunt verificate în toate temele și densitățile. Valorile noi de spațiere au nevoie de justificare pentru întregul sistem. Fișierele sursă au maximum 300 de linii; punctele de intrare rămân stabile, iar comportamentele sunt împărțite în module mici.
` },
  sources: { title: 'Surse și licențe', body: `
SDR este o implementare originală și independentă, inspirată de practici descrise public. Proiectele consultate nu sunt afiliate cu SDR și nu îl susțin oficial. Pachetele bibliotecii nu includ un logo guvernamental implicit sau fonturi proprietare. Secțiunea de studii experimentale conține planșele de identitate instituțională furnizate proiectului, marcate ca propuneri.

- [IBM/Carbon DESIGN.md](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/ibm/DESIGN.md): o analiză independentă folosită ca referință pentru suprafețele simple, paleta restrânsă și structura consecventă. SDR are propria identitate vizuală, paletă și tipografie.
- [Inter 4.1](https://github.com/rsms/inter/releases/tag/v4.1): font cu licență SIL Open Font License 1.1. Fișierele WOFF2 regular și italic sunt incluse în CSS, împreună cu notificarea de copyright și licența completă. În pachetul core există și dist/INTER-LICENSE.txt.
- [Astro Starlight](https://starlight.astro.build/): framework-ul documentației, cu licență MIT.
- React, Astro, TypeScript, esbuild, Vitest și Playwright au propriile licențe. Versiunile folosite sunt în package-lock.json.
- [Pagina UNESCO despre altiță](https://ich.unesco.org/en/RL/01861): referință culturală, fără a acorda drepturi de folosire a imaginilor sau modelelor.

Codul SDR este distribuit sub licența MIT din proiect. Resursele terțe își păstrează propriile condiții de utilizare. Numele și mărcile necesită verificare înainte de promovarea publică.
` },
};
