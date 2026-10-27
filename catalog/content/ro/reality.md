Aceste studii explică problemele unor formulare publicate de instituții din România, efectele lor asupra persoanelor care le completează și felul în care componentele SDR le-ar putea rezolva.

## Formulare deja online

Aceste comparații reproiectează interfețe web existente. Păstrează serviciul și cerințele observabile ca punct de plecare.

| Studiu | Sursa | Ce probleme tratează propunerea |
| --- | --- | --- |
| [Petiție online: imigrări](/ro/reality/online-igi/) | Inspectoratul General pentru Imigrări | Etichete asociate greșit și explicații greu de citit; grupuri clare de întrebări și verificarea răspunsurilor. |
| [Plată online: autorizație provizorie](/ro/reality/online-payment/) | DGPCI | Etichete înghesuite lateral și întrebări similare despre identitate; pași clari pentru beneficiar, plătitor și contact. |

## Digitalizare și candidați pentru pilot

Aceste studii pornesc de la scanările fără text ale poliției și casei de pensii, respectiv de la PDF-ul interactiv, completabil, al ANAF. Arată cum ar putea deveni formulare digitale și pot susține discuții despre un pilot; nu sunt piloturi convenite cu instituțiile.

| Studiu | Sursa | Ce probleme tratează propunerea |
| --- | --- | --- |
| [Cerere de cazier judiciar](/ro/reality/criminal-record/) | Poliția Română · IPJ Constanța | Întrebări într-o imagine și spații pentru scriere de mână; controale semantice și întrebări grupate. |
| [Formularul 230: un beneficiar](/ro/reality/income-tax/) | ANAF · modelul din 2025 | Scenarii înghesuite pe o pagină fixă; întrebări relevante și explicații apropiate. |
| [Petiție privind pensia](/ro/reality/petition/) | Casa de pensii sectorială a MApN | Casete scanate și spațiu de scriere limitat; câmpuri lizibile, responsive și text extensibil. |

## De ce sunt necesare aceste schimbări

Un formular public are nevoie de informații ușor de citit, întrebări ușor de înțeles și răspunsuri care pot fi completate și corectate fără dificultate. Exemplele arată două tipuri diferite de intervenție.

### Formulare web: eliminarea barierelor de utilizare și accesibilitate

Disponibilitatea online este doar punctul de plecare. Exemplul IGI are asocieri greșite între etichete și controale și explicații cu text mic. Captura DGPCI arată etichete lungi înghesuite lângă câmpuri și informații estompate sub formular. Aceste probleme îngreunează înțelegerea și folosirea serviciului, mai ales pentru persoanele care utilizează tehnologii asistive sau au nevoie de text mai lizibil.

### Formulare pe hârtie și PDF: construirea unui parcurs digital

O scanare sau un PDF cu pagină fixă, pus pe site, face documentul descărcabil. Persoana trebuie să completeze în continuare o pagină gândită pentru tipar, adesea fără câmpuri accesibile, conținut adaptat ecranului, validare contextuală sau verificarea structurată a răspunsurilor. Acolo unde sunt necesare tipărirea, scrierea de mână, scanarea ori reintroducerea datelor, procesul depinde și de echipamente și operațiuni manuale.

Digitalizarea aduce întrebările, explicațiile și răspunsurile structurate într-un parcurs utilizabil, legat de depunere și de procesarea în instituție. Exemplele SDR arată partea de interfață a acestei schimbări. Un PDF completabil și o variantă de tipărit pot rămâne utile alături de serviciul web.

## De ce contează consecvența între instituții

În aceste exemple, chiar și întrebările obișnuite despre identitate și contact schimbă tipografia, poziția etichetelor, spațierea și stilul acțiunilor de la un serviciu la altul. Persoana trebuie să învețe din nou interfața de fiecare dată. Componentele comune permit serviciilor să-și păstreze propriile întrebări, folosind controale familiare, text lizibil, layout-uri previzibile și aceleași modele de ajutor și semnalare a erorilor. Acesta este un motiv practic pentru un sistem de design comun.

## Cum se citește comparația

Fiecare studiu include o captură a formularului web sau o imagine a documentului publicat, linkul către sursa instituției, modificările propuse și un formular interactiv construit cu biblioteca SDR. Sursele au fost consultate la **26–27 octombrie 2026**.

Analiza combină capturile cu verificări punctuale ale codului HTML, fără modificarea datelor din formularele originale. Nu au fost trimise cereri și nu au fost efectuate plăți. Observațiile identifică bariere concrete; nu reprezintă un audit WCAG complet al fiecărui serviciu.

Comparația privește **aceste formulare**, nu întreaga ofertă digitală a instituțiilor. Un PDF poate rămâne util la ghișeu, iar unele solicitări au deja alternative online. De exemplu, [MAI oferă eliberarea electronică a cazierului judiciar](https://hub.mai.gov.ro/serviciu/view?id=88). Studiul SDR nu înlocuiește acel serviciu.

## Ce se poate încerca

Demonstrațiile au pași, etichete persistente, câmpuri cu tipuri potrivite, erori lângă întrebări și un sumar cu linkuri către câmpuri. Răspunsurile pot fi verificate și modificate înainte de încheiere. Datele rămân în pagina deschisă, fără transmitere sau stocare în browser. Reîncărcarea paginii ori reluarea demonstrației le șterge.

Varianta din documentație folosește componente React SDR. Exemplul separat folosește HTML generat din aceeași compoziție și cele două fișiere ale bibliotecii. Navigarea și validarea parcursului sunt cod al demonstrației. [Codul studiilor este în repository](https://github.com/strictlylucian/sdr/tree/main/apps/docs/src/studies).

## Ce trebuie validat într-un pilot

Obligativitatea câmpurilor din demonstrații este o alegere de prototip, nu o interpretare juridică a formularelor. Validarea este de format: nu verifică identitatea, eligibilitatea, registrele instituționale sau autenticitatea datelor. Semnăturile, documentele justificative și circuitul de depunere nu sunt implementate.

Un pilot ar avea nevoie de verificarea cerințelor cu instituția, cercetare cu persoanele care folosesc serviciul, integrare cu sistemele existente și evaluare de accesibilitate. Nu pretindem că aceste studii au redus timpul de completare sau că demonstrează conformitatea unui serviciu complet.
