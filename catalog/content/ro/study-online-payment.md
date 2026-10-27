Punctul de plecare este **formularul web DGPCI pentru contravaloarea autorizației provizorii**, la ruta publică de plată de tip 12. Studiul acoperă etapa de completare a datelor.

## Ce există deja

Formularul cere email și confirmarea lui, tipul persoanei, identificarea beneficiarului și a plătitorului, apoi numărul de documente. La desktop, etichetele lungi ocupă o coloană îngustă, separat de controale. Câmpurile de email inspectate folosesc tipul HTML `text`; aceasta nu dovedește absența validării din aplicație.

Sursa afișa **25 RON pentru un document la data capturii**. Valoarea din demonstrație este un instantaneu pentru compararea interfețelor, nu un tarif actualizat sau o recomandare de plată.

## Problemele formularului actual

Captura etapei de completare și verificarea codului HTML, fără trimiterea datelor, la **27 octombrie 2026** arată mai multe probleme într-o operațiune care cere citire și verificare atentă:

- **Etichetele lungi sunt înghesuite într-o coloană îngustă.** Textele pentru CNP-ul beneficiarului și al plătitorului ocupă mai multe rânduri, la distanță pe orizontală de câmpuri. Asocierea întrebării cu locul de completare cere mai multă urmărire vizuală decât o etichetă așezată direct deasupra controlului.
- **Informarea suplimentară nu are suficient contrast.** Textul despre datele personale și mesajele prin email, aflat sub panou, apare la 16px, cu grosime normală și italic, în culoarea `rgba(41, 41, 41, 0.5)` pe alb. Contrastul este de aproximativ **3,03:1**, sub minimul de **4,5:1** pentru text obișnuit din [WCAG 2.2, criteriul 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Este o problemă concretă de lizibilitate și accesibilitate, care afectează informații necesare pentru înțelegerea serviciului.
- **Întrebările similare despre identitate au nevoie de grupare mai clară.** Beneficiarul și plătitorul pot fi persoane diferite. Apropierea câmpurilor și formulările asemănătoare fac importantă explicarea persoanei la care se referă fiecare răspuns și posibilitatea de a verifica datele înainte de continuare.

Diferența față de exemplul IGI este relevantă: chiar și întrebările obișnuite despre contact și identitate au altă tipografie, altă poziție a etichetelor, alte fundaluri și alt stil al acțiunilor. Cetățenii trebuie să învețe convenții vizuale diferite pentru fiecare serviciu. SDR propune un mod comun de citire și interacțiune, păstrând întrebările specifice fiecărui serviciu.

## Ce propune SDR

Beneficiarul, contactul și cantitatea au pași separați. Emailul folosește tipul nativ potrivit, câmpul de confirmare este păstrat, iar totalul demonstrativ se actualizează când se schimbă numărul de documente. Etichetele apar deasupra controalelor și pot ocupa mai multe rânduri fără să comprime o coloană de etichete.

## Corespondența cu originalul

| În formularul web | În propunere |
| --- | --- |
| Tip persoană | Dropdown cu opțiunile persoană fizică și persoană juridică. Selecția stabilește câmpurile beneficiarului. |
| Beneficiar și identificator | Nume complet și CNP fictiv pentru persoana fizică; denumire și CUI/CIF fictiv pentru persoana juridică. Sunt afișate și incluse la verificarea răspunsurilor doar câmpurile opțiunii selectate. |
| CNP plătitor | Câmp distinct, păstrat chiar dacă beneficiarul poate fi aceeași persoană. Nu presupunem că datele sunt identice. |
| Email și confirmare | Al doilea pas; ambele câmpuri sunt disponibile pentru examinarea layout-ului. Nu există validare și nu se trimite email de verificare. |
| Număr de documente și sumă | Cantitate întreagă pozitivă și total local, calculat la valoarea din captură. |
| reCAPTCHA și continuarea spre plată | Nu sunt simulate ca verificări îndeplinite. Demonstrația se încheie după verificarea răspunsurilor. |

<!-- study-follow-up -->

## Ce ar trebui verificat într-un pilot

Ar fi utile teste cu persoane care plătesc pentru altcineva, evaluarea erorilor de identificare și verificarea înțelegerii totalului. Un serviciu real ar avea nevoie de tarife furnizate de sistemul instituției, validări pe server, protecție anti-abuz și integrarea cu procesatorul. Exemplul nu cere date de card, nu rezervă documente și nu efectuează tranzacții.
