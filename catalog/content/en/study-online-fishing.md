The Border Police already offers an online application for **approval to fish in Romanian border waters**. This study remakes the existing individual-applicant service, rather than proposing a digital replacement for its downloadable application alone.

## What already exists

The form collects identity and contact details, residence, multiple border counties, a signed application and identity copy, an additional fishing-permit upload and a declaration. Associations have a separate source service. The blank form and its markup were inspected on **27 October 2026**, without personal details, files, agreements or submission.

## Why a complete overhaul is needed

- **A long procedural sentence becomes a field label.** The county selector’s label combines the request, statutory territory and responsible services. The actual choice is harder to find than a short question with adjacent guidance.
- **County selection introduces an extra widget.** The underlying multiple select is enhanced with a search input that has no associated native label or ARIA label in the inspected markup. The proposal uses a visible checklist with a named group instead.
- **Upload instructions conflict.** The final guidance says all uploads are required, while the fishing-permit upload is not marked with the same asterisk as the signed application and identity copy. The page also discusses the removal of the ANPA-permit requirement. People need to know which document is actually necessary for their destination.
- **The form repeats a paper step inside an online process.** The person must download, complete and sign an application, then upload it alongside answers already entered online. A true service redesign should investigate whether that duplication can be removed; changing a visual component cannot settle signature requirements.

## What SDR proposes

Four panels cover identity, residence, destination counties and documents. The nineteen meaningful border-county options remain independently selectable; the source’s stray “0” entry is excluded. Essential document guidance remains visible. The prototype checks **10 MB across all attachments together**, not just each file, and does not read their contents.

The signed application and identity copy remain required in the demonstration. The additional permit is shown as optional pending resolution of the conflicting source guidance; that is a prototype decision, not fishing or legal advice. The demonstration neither issues an approval nor authorises fishing.

## Mapping to the original

| Source | SDR proposal |
| --- | --- |
| Identity, email and phone | First panel with native controls and fictional test identifiers. |
| Residence | County dropdown, locality, address and building details. |
| Multiple destination counties | A labelled checkbox group retaining the meaningful options. |
| Application, identity copy and permit | Separate file controls with a combined 10 MB limit. No format restriction is invented where the inspected form states none. |
| Terms, signature and dispatch | Demonstration acknowledgement only. Source documents, legal requirements, signature and actual dispatch remain institution-owned. |

<!-- study-follow-up -->

## What a pilot could establish

Research could test county selection, document requirements and whether structured answers can remove repeated entry into the signed application. Production would require decisions on signatures, document security, accessible verification, eligibility, territorial routing and delivery of the approval.
