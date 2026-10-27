Punctul de plecare este **formularul web DGPCI pentru contravaloarea autorizației provizorii**, la ruta publică de plată de tip 12. A fost inspectată etapa de completare, fără date personale, fără rezolvarea reCAPTCHA și fără inițierea unei plăți.

## Ce există deja

Formularul cere email și confirmarea lui, tipul persoanei, identificarea beneficiarului și a plătitorului, apoi numărul de documente. La desktop, etichetele lungi ocupă o coloană îngustă, separat de controale. Câmpurile de email inspectate folosesc tipul HTML `text`; aceasta nu dovedește absența validării din aplicație.

Sursa afișa **25 RON pentru un document la data capturii**. Valoarea din demonstrație este un instantaneu pentru compararea interfețelor, nu un tarif actualizat sau o recomandare de plată.

## Ce propune SDR

Beneficiarul, contactul și cantitatea au pași separați. Emailul folosește tipul nativ potrivit, confirmarea lui este verificată, iar totalul demonstrativ se actualizează când se schimbă numărul de documente. Etichetele apar deasupra controalelor și pot ocupa mai multe rânduri fără să comprime o coloană de etichete.

## Corespondența cu originalul

| În formularul web | În propunere |
| --- | --- |
| Tip persoană | Scenariu pentru persoană fizică, afișat read-only. Persoanele juridice nu sunt acoperite. |
| Beneficiar și CNP beneficiar | Nume complet și identificator fictiv în primul pas. |
| CNP plătitor | Câmp distinct, păstrat chiar dacă beneficiarul poate fi aceeași persoană. Nu presupunem că datele sunt identice. |
| Email și confirmare | Al doilea pas; diferențele sunt semnalate înainte de continuare. Nu se trimite email de verificare. |
| Număr de documente și sumă | Cantitate întreagă pozitivă și total local, calculat la valoarea din captură. |
| reCAPTCHA și continuarea spre plată | Nu sunt simulate ca verificări îndeplinite. Demonstrația se încheie după verificarea răspunsurilor. |

## Ce ar trebui verificat într-un pilot

Ar fi utile teste cu persoane care plătesc pentru altcineva, evaluarea erorilor de identificare și verificarea înțelegerii totalului. Un serviciu real ar avea nevoie de tarife furnizate de sistemul instituției, validări pe server, protecție anti-abuz și integrarea cu procesatorul. Exemplul nu cere date de card, nu rezervă documente și nu efectuează tranzacții.
