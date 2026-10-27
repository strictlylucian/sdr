The starting point is **DGPCI’s existing web form for provisional authorisation fees**, at its public payment-type-12 route. The data-entry stage was inspected without personal details, completing reCAPTCHA or initiating payment.

## What already exists

The form requests email and confirmation, applicant type, recipient and payer identifiers, then document quantity. On desktop, long labels sit in a narrow column separate from their controls. The inspected email controls use HTML type `text`; this does not establish that application-level validation is absent.

The source displayed **25 RON for one document when captured**. The demonstration value is a snapshot for comparing interfaces, rather than a live tariff or payment recommendation.

## What SDR proposes

Recipient, contact and quantity become separate steps. Email uses the appropriate native input type, confirmation is checked and the demonstration total updates when quantity changes. Labels sit above controls and can wrap without compressing a separate label column.

## Mapping to the original

| Existing web form | Proposal |
| --- | --- |
| Applicant type | An individual-applicant scenario shown read-only. Legal entities are not covered. |
| Recipient and recipient identifier | Full name and a fictional identifier in the first step. |
| Payer identifier | A separate field, retained even when payer and recipient may be the same person. Equality is not assumed. |
| Email and confirmation | Second step; mismatches are reported before continuing. No verification email is sent. |
| Document quantity and amount | A positive whole-number quantity and a local total using the captured value. |
| reCAPTCHA and continuing to payment | Not simulated as completed checks. The demonstration ends after answer review. |

## What a pilot could establish

Research could test paying for another person, identification errors and understanding of the total. A real service would need institution-provided tariffs, server-side checks, anti-abuse protection and processor integration. This example requests no card details, reserves no documents and performs no transactions.
