Punctul de plecare este **formularul web DGPCI pentru contravaloarea autorizației provizorii**, la ruta publică de plată de tip 12. Studiul acoperă etapa de completare a datelor.

## Ce există deja

Formularul cere email și confirmarea lui, tipul persoanei, identificarea beneficiarului și a plătitorului, apoi numărul de documente. La desktop, etichetele lungi ocupă o coloană îngustă, separat de controale.

## De ce este necesară o refacere completă

Interfața are nevoie de o refacere completă. Layout-ul face o plată simplă inutil de greu de citit și verificat.

- **Etichetele înghesuite ascund întrebările.** Etichetele beneficiarului și plătitorului se rup pe mai multe rânduri într-o coloană laterală îngustă. Persoana trebuie să potrivească fragmentele de text cu fiecare câmp.
- **Explicațiile esențiale nu respectă cerințele de contrast.** Informarea despre date personale și email are un contrast de aproximativ **3,03:1**, sub minimul de **4,5:1** din [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- **Beneficiarul și plătitorul se pot confunda ușor.** Întrebările similare despre identitate au nevoie de grupuri distincte și explicații clare despre persoana la care se referă.

Aceleași întrebări de bază arată complet diferit în serviciul IGI. Cetățenii suportă costul acestei inconsecvențe de fiecare dată când trec de la o instituție la alta.

## Ce propune SDR

Beneficiarul, contactul și cantitatea au pași separați. Emailul folosește tipul nativ potrivit, câmpul de confirmare este păstrat, iar totalul demonstrativ se actualizează când se schimbă numărul de documente. Etichetele apar deasupra controalelor și pot ocupa mai multe rânduri fără să comprime o coloană de etichete.

## Corespondența cu originalul

| În formularul web | În propunere |
| --- | --- |
| Tip persoană | Dropdown cu opțiunile persoană fizică și persoană juridică. Selecția stabilește câmpurile beneficiarului. |
| Beneficiar și identificator | Nume complet și CNP fictiv pentru persoana fizică; denumire și CUI/CIF fictiv pentru persoana juridică. Sunt afișate și incluse la verificarea răspunsurilor doar câmpurile opțiunii selectate. |
| CNP plătitor | Câmp distinct, păstrat chiar dacă beneficiarul poate fi aceeași persoană. Nu presupunem că datele sunt identice. |
| Email și confirmare | Emailul și confirmarea sunt grupate în al doilea pas. |
| Număr de documente și sumă | Cantitate și total actualizat automat. |
| reCAPTCHA și continuarea spre plată | Nu sunt simulate ca verificări îndeplinite. Demonstrația se încheie după verificarea răspunsurilor. |

<!-- study-follow-up -->

## Ce ar trebui verificat într-un pilot

Testarea diferenței dintre plătitor și beneficiar și a înțelegerii totalului. Conectarea parcursului la datele instituției și la procesatorul de plăți.
