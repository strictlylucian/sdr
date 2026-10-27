This is a service for **reporting a local infrastructure problem** to Gruiu Town Hall: street lighting, water or sewerage, roads, waste or another issue. It is not a general contact-form study.

## What already exists

The published form asks for the issue category, reporter’s name, optional email and phone, one of four villages, street and number, a description, an attachment and a privacy acknowledgement. The live interface shows a submission button. Preview and reset buttons exist in the markup but are hidden, so they are not treated as available service features. The blank interface and markup were inspected on **27 October 2026**; no report was sent.

## Why the current interface needs work

- **Several visible labels are not connected to their fields.** In the inspected markup, name, email, phone, street, number, description and file controls have no associated native label. These controls therefore need a reliable visible-label relationship rather than nearby text alone.
- **The service mixes three distinct tasks.** Choosing what needs attention, locating it and providing contact details appear as one long form. A clear location panel makes the information needed to find the problem easier to check.
- **Optional contact details use generic text controls.** The email and telephone controls are both text inputs. Native email and telephone types provide more appropriate entry and validation support.
- **The upload has no nearby format or size guidance.** The captured control asks for a file without explaining accepted formats or a limit beside it. Explicit guidance can help people prepare a useful attachment; this observation does not establish what the server accepts.

These are targeted observations of the published form, not a claim that every municipal service is inaccessible or that server validation is absent.

## What SDR proposes

Three panels separate the issue, its location and contact details. The five issue types and four villages remain radio choices; selecting “Other” reveals a specific description field. Labels, optional status and the purpose of each panel are explicit. Every panel is visible in the documentation, while the standalone demonstration provides answer review without validation without sending a report.

## Mapping to the original

| Published question | SDR proposal |
| --- | --- |
| Issue type and other issue | Same five choices, with conditional detail for “Other”. |
| Village, street and number | A dedicated location panel with the four source villages. No location lookup is performed. |
| Name, email and phone | Contact panel; email and phone remain optional. |
| Description and file | Expandable text and a multiple-file control. PDF/JPG/JPEG/PNG and 5 MB are explicit **demonstration limits**, not verified source restrictions. |
| Privacy acknowledgement and submission | A demonstration acknowledgement, local answer review and editing. No institutional agreement or report is transmitted. |

<!-- study-follow-up -->

## What a pilot could establish

A pilot could test whether reports contain enough location information for the correct team to act. Real routing, file policy, privacy wording, acknowledgement and progress tracking would need municipal integration; this prototype does not report emergencies.
