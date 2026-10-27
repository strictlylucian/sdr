The starting point is **DGPCI’s existing web form for provisional authorisation fees**, at its public payment-type-12 route. The study covers the data-entry stage.

## What already exists

The form requests email and confirmation, applicant type, recipient and payer identifiers, then document quantity. On desktop, long labels sit in a narrow column separate from their controls. The inspected email controls use HTML type `text`; this does not establish that application-level validation is absent.

The source displayed **25 RON for one document when captured**. The demonstration value is a snapshot for comparing interfaces, rather than a live tariff or payment recommendation.

## Why the current interface needs work

The captured data-entry screen and a read-only markup check on **27 October 2026** show several problems in a task that needs careful reading and checking:

- **Long labels are compressed into a narrow column.** The recipient and payer identifier labels wrap over several lines, separated horizontally from the inputs. Matching a question to its field requires more scanning than a label placed directly above it.
- **Supporting information has insufficient text contrast.** The personal-data and email notice beneath the panel renders at 16px, normal weight and italic, using `rgba(41, 41, 41, 0.5)` over white. Its contrast is approximately **3.03:1**, below the **4.5:1** minimum for normal text in [WCAG 2.2, criterion 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). This is a specific readability and accessibility defect, affecting information the person needs to understand the service.
- **Similar identity questions need clearer grouping.** Recipient and payer identifiers refer to different people in some transactions. Their proximity and similar wording make it especially important to explain whose details belong in each field and to make checking them straightforward.

The contrast with the IGI example is also instructive: even ordinary contact and identity questions use different typography, label placement, backgrounds and action styling. Citizens have to learn a different visual convention for each service. SDR proposes a common reading and interaction pattern while retaining each service’s own questions.

## What SDR proposes

Recipient, contact and quantity become separate steps. Email uses the appropriate native input type, the confirmation field is retained and the demonstration total updates when quantity changes. Labels sit above controls and can wrap without compressing a separate label column.

## Mapping to the original

| Existing web form | Proposal |
| --- | --- |
| Applicant type | A dropdown with individual and legal-entity options. The selection controls the recipient fields. |
| Recipient and recipient identifier | Full name and fictional CNP for an individual; company name and fictional CUI/CIF for a legal entity. Only the selected branch is shown and included in the review. |
| Payer identifier | A separate field, retained even when payer and recipient may be the same person. Equality is not assumed. |
| Email and confirmation | Second step; both fields are available for inspecting the layout. No validation or verification email is implemented. |
| Document quantity and amount | A positive whole-number quantity and a local total using the captured value. |
| reCAPTCHA and continuing to payment | Not simulated as completed checks. The demonstration ends after answer review. |

<!-- study-follow-up -->

## What a pilot could establish

Research could test paying for another person, identification errors and understanding of the total. A real service would need institution-provided tariffs, server-side checks, anti-abuse protection and processor integration. This example requests no card details, reserves no documents and performs no transactions.
