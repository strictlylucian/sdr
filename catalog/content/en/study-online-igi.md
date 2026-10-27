The IGI petition service already has a web form. This study examines the accessibility and readability of its data-entry interface.

## What already exists

The form supports selecting a recipient office and applicant type, entering identity and correspondence details, writing a petition and attaching a file. Questions appear together, in two columns on desktop. File-name restrictions and an arithmetic verification labelled in English appear in the same area.

## Why the current interface needs work

The blank form was checked read-only on **27 October 2026**. The issues include actual accessibility barriers, as well as visual and content problems:

- **Labels are associated with the wrong controls.** The recipient selector and email input share the ID `form_email`. The applicant-type label points to a misspelled ID, and the attachment label points to the petition text area. Several controls have neither an associated native label nor an alternative name through ARIA or a title. Visible wording therefore does not reliably identify the corresponding control to assistive technology, and selecting a label can target the wrong field.
- **Important guidance is harder to read than the fields.** The inspected controls use 20px text and labels 16px, while attachment requirements and privacy text render at about 12.8px. Long supporting paragraphs and this change of scale make constraints easier to overlook, especially for people with low vision.
- **Related questions have little hierarchy.** Identity, correspondence, office routing and petition content share one two-column surface without clear question groups. The person completing it has to work out the structure while entering their details.
- **Language and file rules add avoidable effort.** “Human Verification” interrupts a Romanian-language form with an arithmetic challenge. The stated file policy rejects names containing diacritics, so an otherwise suitable Romanian document may need renaming before it can be attached.

The reason to redesign this form is to make its questions understandable and operable, with guidance that is easy to find. A consistent coat of paint would leave the labelling errors and file-handling barriers unresolved.

## What SDR proposes

Three steps separate identity, correspondence and petition content. Labels remain visible, attachment guidance sits beside its control and answers can be reviewed and changed. The demonstration accepts accented file names, a behaviour change that would also need agreement from the real service.

## Mapping to the original

| Existing web form | Proposal |
| --- | --- |
| Applicant type | An explicit individual-applicant scenario, shown read-only. Legal entities remain outside this study. |
| Names, citizenship and birth date | First step. No personal number is added where the source does not request one. |
| Address, county, email and phone | Second step; email and phone remain optional. |
| Recipient office | A select using the institutional options from the inspected page. Demonstration values are not email addresses and send no messages. |
| Petition and file | Final step; extension and a demonstration limit of 1,000,000 bytes are checked. Review shows the file name without reading its contents. |
| Arithmetic challenge and submission | Not reproduced as operational steps. Production anti-abuse protection would need an accessible approach and server-side checks. |

## What a pilot could establish

A pilot could measure whether grouping questions and reviewing answers reduces misdirected petitions and requests for missing information. It would require reviewing office routing, attachment policy, privacy information and registry integration.
