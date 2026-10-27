The IGI petition service already has a web form. This study examines the accessibility and readability of its data-entry interface.

## What already exists

The form supports selecting a recipient office and applicant type, entering identity and correspondence details, writing a petition and attaching a file. Questions appear together, in two columns on desktop. File-name restrictions and an arithmetic verification labelled in English appear in the same area.

## Why a complete overhaul is needed

The problems affect how people read, navigate and complete the service. A complete overhaul is needed.

- **Labels are associated with the wrong controls.** The recipient selector and email input share the ID `form_email`. The applicant-type label points to a misspelled ID, and the attachment label points to the petition text area. Several controls have neither an associated native label nor an alternative name through ARIA or a title. Visible wording therefore does not reliably identify the corresponding control to assistive technology, and selecting a label can target the wrong field.
- **Important guidance is harder to read than the fields.** The inspected controls use 20px text and labels 16px, while attachment requirements and privacy text render at about 12.8px. Long supporting paragraphs and this change of scale make constraints easier to overlook, especially for people with low vision.
- **Related questions have little hierarchy.** Identity, correspondence, office routing and petition content share one two-column surface without clear question groups. The person completing it has to work out the structure while entering their details.
- **Language and file rules add avoidable effort.** “Human Verification” interrupts a Romanian-language form with an arithmetic challenge. The stated file policy rejects names containing diacritics, so an otherwise suitable Romanian document may need renaming before it can be attached.

Rebuild the structure, label associations and document handling together.

## What SDR proposes

Three steps separate identity, correspondence and petition content. Labels remain visible, attachment guidance sits beside its control and answers can be reviewed and changed. Files with Romanian diacritics in their names can be selected.

## Mapping to the original

| Existing web form | Proposal |
| --- | --- |
| Applicant type | A dropdown with individual and legal-entity options, as in the original. |
| Names, citizenship and birth date | First step. No personal number is added where the source does not request one. |
| Address, county, email and phone | Second step; email and phone remain optional. |
| Recipient office | A select using the institutional options from the inspected page. Demonstration values are not email addresses and send no messages. |
| Petition and file | Final step, with attachment guidance and the selected file name in answer review. |
| Arithmetic challenge and submission | Not reproduced as operational steps. Production anti-abuse protection would need an accessible approach and server-side checks. |

<!-- study-follow-up -->

## What a pilot could establish

A pilot could measure whether grouping questions and reviewing answers reduces misdirected petitions and requests for missing information. It would require reviewing office routing, attachment policy, privacy information and registry integration.
