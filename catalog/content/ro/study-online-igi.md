Serviciul de petiții al IGI are deja un formular web. Studiul analizează accesibilitatea și lizibilitatea interfeței de completare.

## Ce există deja

Formularul permite alegerea structurii destinatare și a tipului de persoană, introducerea datelor de identificare și corespondență, redactarea petiției și atașarea unui fișier. Întrebările sunt prezentate împreună, pe două coloane la desktop. În aceeași zonă apar o cerință privind numele fișierului și o verificare aritmetică etichetată în engleză.

## Problemele formularului actual

Formularul necompletat a fost verificat, fără trimiterea datelor, la **27 octombrie 2026**. Au fost observate bariere concrete de accesibilitate, alături de probleme de prezentare și conținut:

- **Unele etichete sunt asociate greșit.** Selectul pentru destinatar și câmpul de email au același ID, `form_email`. Eticheta pentru tipul persoanei indică un ID scris greșit, iar cea pentru fișier indică zona de text a petiției. Mai multe controale nu au nici etichetă HTML asociată, nici un nume alternativ prin ARIA sau atributul `title`. Textul vizibil nu identifică astfel în mod fiabil câmpul pentru tehnologiile asistive, iar selectarea etichetei poate duce la alt control.
- **Explicațiile importante sunt mai greu de citit decât câmpurile.** În verificare, controalele folosesc text de 20px, etichetele de 16px, iar cerințele pentru fișier și informarea privind datele personale apar la aproximativ 12,8px. Paragrafele lungi și diferența de scară fac aceste informații mai ușor de trecut cu vederea, mai ales pentru persoanele cu vedere slabă.
- **Întrebările au puțină ierarhie.** Identificarea, corespondența, alegerea destinatarului și conținutul petiției sunt reunite într-o suprafață pe două coloane, fără grupuri de întrebări clar delimitate. Persoana care completează trebuie să deducă singură structura.
- **Limba și regulile pentru fișiere adaugă efort.** „Human Verification” introduce o verificare aritmetică etichetată în engleză într-un formular în română. Politica afișată respinge numele de fișiere cu diacritice; un document potrivit poate necesita redenumire înainte de atașare.

Reproiectarea urmărește întrebări care pot fi înțelese și folosite, cu explicații ușor de găsit. O simplă schimbare de aspect ar lăsa nerezolvate asocierile greșite ale etichetelor și barierele legate de fișiere.

## Ce propune SDR

Trei pași separă identificarea, corespondența și conținutul petiției. Etichetele rămân vizibile, fișierul are indicații lângă control, iar răspunsurile pot fi verificate și modificate. Exemplul acceptă nume de fișiere cu diacritice, o schimbare de comportament care ar necesita și acordul serviciului real.

## Corespondența cu originalul

| În formularul web | În propunere |
| --- | --- |
| Tip persoană | Scenariu explicit pentru persoană fizică, afișat read-only. Varianta pentru persoană juridică rămâne în afara studiului. |
| Nume, prenume, cetățenie, naștere | Primul pas. Nu este adăugat un CNP pe care sursa nu îl cere. |
| Adresă, județ, email și telefon | Al doilea pas; emailul și telefonul rămân opționale. |
| Structura destinatară | Select cu opțiunile instituționale preluate din pagina consultată. Valorile interne ale demonstrației nu sunt adrese de email și nu trimit mesaje. |
| Petiție și fișier | Ultimul pas; sunt verificate extensia și limita demonstrativă de 1.000.000 de octeți. Numele fișierului apare la verificare, fără citirea conținutului. |
| Verificare aritmetică și trimitere | Nu sunt reproduse ca operațiuni reale. În producție, protecția anti-abuz ar necesita o soluție accesibilă și verificări pe server. |

## Ce ar trebui verificat într-un pilot

Un pilot ar putea măsura dacă gruparea întrebărilor și verificarea răspunsurilor reduc greșelile de adresare și cererile de completare. Ar necesita validarea listei de structuri, a politicii pentru fișiere, a informării privind datele personale și a integrării cu registratura.
