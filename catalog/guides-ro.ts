import { localisationContent, projectContent, gettingStartedContent } from './content';
export const guidesRo: Record<string, { title: string; body: string }> = {
  about: { title: 'Despre proiect', body: projectContent.ro },
  'getting-started': { title: 'Instalare și integrare', body: gettingStartedContent.ro },
  architecture: { title: 'Arhitectură și API', body: `
## Organizarea proiectului

- packages/core: tokenuri, stiluri și controlere pentru interacțiunile DOM; etichetele și formatarea aparțin aplicației.
- packages/react: componente React cu tipuri TypeScript și grupuri de componente pentru formulare și pagini. React este dependență peer.
- dist/portable: cele două fișiere de distribuție, sdr.css și sdr.js.
- apps/docs: documentația Astro Starlight, în română și engleză, cu exemple React interactive și exemple HTML.
- catalog: descrierile și recomandările pentru componente și modele de utilizare.

Core este baza de distribuție independentă de framework. React este integrarea implicită întreținută în acest repository; pachetele pentru alte framework-uri pot folosi aceleași contracte publice. Integrările folosesc aceleași stiluri și controlere, pornind de la elemente HTML native. Atributele data-sdr-* fac parte din API-ul public; nu depind de selectori CSS care urmăresc accidental structura paginii.

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

Valorile rem se adaptează dimensiunii de text alese în browser. Variabilele --sdr-field-gap, --sdr-form-group-gap, --sdr-group-gap, --sdr-section-gap și --sdr-layout-gap grupează distanțele după rol. Modificarea unei variabile actualizează toate componentele care o folosesc.

Stack așază elementele pe verticală. Cluster le trece pe rândul următor când nu mai încap. Grid organizează elemente repetate în coloane, Container aliniază conținutul paginii, iar SidebarLayout așază navigarea lângă conținut. Folosirea gap evită cumularea marginilor elementelor vecine. Distanțele mai mici între elementele aceluiași grup le fac mai ușor de recunoscut ca grup.

Grid cu columns=2 sau columns=3 limitează numărul de coloane și păstrează o lățime minimă de 16rem pentru fiecare. Numărul de coloane depinde de spațiul disponibil componentei, inclusiv într-un container îngust pe un ecran mare. SidebarLayout trece pe o singură coloană când cele două zone nu mai încap alături. Containerul principal are maximum 64rem, iar blocurile de text maximum 68ch. Tabelele late se derulează în propriul container, care are un nume accesibil și poate primi focus.

Spațierea se adaptează la lățimea ecranului. De la 40rem, --sdr-group-gap crește de la 16px la 24px, --sdr-layout-gap de la 16px la 32px, iar --sdr-section-gap de la 32px la 48px. Stack fără gap explicit folosește distanța de grup; dacă are copii care sunt controale de formular, grupuri de câmpuri sau containere sdr-form-group, folosește distanța dintre întrebări, --sdr-form-group-gap. Valorile gap explicite și clasele utilitare numerotate păstrează distanța aleasă.

### Distanța dintre întrebări

Formularele au mai mult spațiu între întrebări decât între eticheta și controlul aceleiași întrebări. --sdr-field-gap păstrează 8px între etichetă, hint, eroare și control. --sdr-form-group-gap separă întrebările: 24px pe ecrane mici și 32px de la 40rem în densitatea normală; densitatea compactă folosește 16px, respectiv 24px.

Spațiul este gestionat de Stack, Fieldset și grupurile condiționale care conțin câmpuri, fără padding suplimentar pe input sau pe rândul unei opțiuni. Opțiunile radio și checkbox din aceeași întrebare păstrează distanța lor internă. Astfel, bara de eroare se încheie la conținutul grupului, fără spațiu gol dedesubt. Controalele dintr-o dată calendaristică sau dintr-un input group rămân apropiate.

Pentru un câmp compus într-un container propriu, clasa sdr-form-group identifică întrebarea în layout. Prop-ul gap și clasele utilitare de spațiere au în continuare prioritate asupra distanței implicite.

` },
  'foundations/typography': { title: 'Tipografie', body: `
SDR folosește Inter 4.1 în bibliotecă și în documentație. Variantele variabile regular și italic sunt incluse direct în CSS, în format WOFF2, cu greutăți de la 400 la 750, intervalul folosit de componente. Fonturile sunt optimizate pentru caractere latine și Latin Extended, inclusiv nume internaționale, accente combinate, semne de punctuație și monede. Pentru alte alfabete se folosesc fonturile sistemului de operare. Dimensiunea optică, cifrele tabulare și hinting-ul sunt păstrate. Nu există cereri separate pentru fonturi, iar ediția portabilă păstrează cele două fișiere. Inter include diacriticele românești, inclusiv Ș/ș și Ț/ț cu virgulă dedesubt. Codul păstrează un font monospace. Familia poate fi schimbată prin --sdr-font pentru identitatea unei instituții.

### Scară tipografică responsive

Tipografia se adaptează de la 40rem prin tokenurile comune, fără formule separate pentru fiecare pagină. Valorile de mai jos presupun dimensiunea implicită de 16px a browserului. Sursa folosește rem și line-height fără unitate, astfel încât preferințele de text și zoom-ul să rămână eficiente.

| Token | Ecran mic | De la 40rem | Utilizare |
|---|---|---|---|
| xs | 14px | 14px | Metadate scurte și taguri, nu text de citit |
| sm | 16px | 16px | Text suplimentar și hinturi |
| md | 19px | 19px | Text principal, etichete, controale și titluri mici |
| lg | 19px | 20px | Text evidențiat și titluri de alertă |
| xl | 21px | 24px | Titluri de subsecțiune și text introductiv |
| 2xl | 27px | 36px | Titluri de secțiune |
| 3xl | 32px | 48px | Titluri de pagină |
| 4xl | 48px | 64px | Titluri mari, în situații speciale |

Aceeași scară se aplică în React, HTML, titlurile documentației și clasele sdr-u-text-*. Dimensiunile xl/lg/md/sm ale componentei Heading corespund tokenurilor 3xl/2xl/xl/md. Un h2 cu dimensiunea unui titlu de pagină rămâne h2 în structura documentului. Legendele cu clase de dimensiune pentru titluri primesc același stil complet. Clasa sdr-lead folosește tokenul xl.

line-height este 1.6 pentru text și 1.25 pentru titluri; înălțimea rândului crește odată cu fontul. Textul principal rămâne la 19px și pe ecrane mici. Densitatea compactă modifică spațiul controalelor, fără să micșoreze textul de citit. Prose limitează lățimea la 68ch, iar titlurile trec pe mai multe rânduri, fără trunchiere. Clasa sdr-u-tabular aliniază cifrele la aceeași lățime.

Valorile exportate prin typography descriu scara pentru ecrane mari; typographySmall descrie scara pentru ecrane mici. CSS face trecerea automat, fără cod JavaScript pentru lățimea ecranului. Rolurile proprii pot folosi --sdr-heading-xl-size, --sdr-heading-lg-size, --sdr-heading-md-size și --sdr-heading-sm-size.

### Spațiul din jurul titlurilor

Spațierea urmează dimensiunea vizuală a titlului, la același prag de 40rem. Spațiul de deasupra se aplică după un paragraf sau o listă. Un titlu de la începutul secțiunii nu primește margine suplimentară sus.

| Dimensiunea titlului | Spațiu înainte, mic / mare | Spațiu după, mic / mare |
|---|---|---|
| xl | 48 / 64px | 32 / 48px |
| lg | 48 / 64px | 24 / 32px |
| md | 32 / 48px | 16 / 24px |
| sm | 24 / 32px | 16 / 24px |

Prose și documentația folosesc acest ritm între blocurile de text. Stack adaugă doar diferența dintre gap-ul existent și spațierea titlului, fără să dubleze distanța. Un gap explicit sau o clasă utilitară de gap păstrează distanța aleasă. Componentele compacte, precum cardurile, alertele și dialogurile, își gestionează propriile distanțe interne. Legendele cu dimensiune de titlu folosesc spațiul corespunzător sub legendă, separat de distanța dintre etichetă și control.

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

Motif și clasa sdr-motif folosesc același desen în exemplele bibliotecii. Repetiția de 194 × 225 de unități păstrează coordonatele pixelilor din modelul de referință, inclusiv lățimile inegale ale cusăturilor și centrul în carouri. Două măști SVG incluse în CSS separă desenul de culorile paletei. Rombul continuă peste marginea orizontală în repetiția următoare, astfel încât forma rămâne întreagă. Toate culorile provin din variabilele paletei SDR. Altița urmează tema secțiunii: în dark, fondul este aproape negru, cu cusături în roșul drapelului și alb ușor temperat; celelalte teme păstrează roșul și albastrul pe alb. Rolurile motif-ground, motif-primary și motif-secondary permit ajustări separate de culorile navigării și ale mesajelor de stare. Secțiunile light și dark imbricate își păstrează fiecare propria paletă. Înălțimea implicită a benzii orizontale este de 3rem (48px la baza de 16px). Headerul, hero-ul și footerul documentației nu folosesc momentan acest ornament. Proprietatea size acceptă sm (24px), md (48px, implicit), lg (64px) și xl (96px); ediția HTML folosește clasele sdr-motif--sm, sdr-motif--md, sdr-motif--lg și sdr-motif--xl. Proprietatea --sdr-motif-size permite și alte înălțimi. Desenul se scalează proporțional și se repetă orizontal, fără fișiere imagine separate, elemente suplimentare sau cereri de rețea. Decorul este separat de text și controale, ascuns tehnologiilor asistive și eliminat în modul de culori forțate.

Instituțiile pot adăuga propriile elemente vizuale în afara controalelor funcționale. Ornamentului îi corespund măști SVG incluse în CSS; fotografia de referință nu este inclusă.

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
Sunt binevenite pachetele care integrează core cu alte framework-uri. [Ghidul de instalare și integrare](/ro/getting-started/) explică principiul „Distribution first”.

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
- [Pagina UNESCO despre altiță](https://ich.unesco.org/en/RL/01861): context cultural pentru broderia tradițională.

Codul SDR este distribuit sub licența MIT din proiect. Resursele terțe își păstrează propriile condiții de utilizare. Numele și mărcile necesită verificare înainte de promovarea publică.
` },
};
