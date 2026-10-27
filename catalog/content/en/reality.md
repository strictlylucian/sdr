The same public need, a clearer experience. These studies start with forms published by Romanian institutions and show how they could be organised using SDR components.

**Independent proposals, not operational public services.** The institutions have neither commissioned nor approved these versions. Use fictional details only.

## Existing online forms

These comparisons redesign existing web interfaces, keeping the service and observable requirements as their starting point.

| Study | Source | What the proposal explores |
| --- | --- | --- |
| [Online petition: immigration](/en/reality/online-igi/) | Inspectorate General for Immigration | Identity, routing and attachments in a journey with answer review. |
| [Online payment: provisional authorisation](/en/reality/online-payment/) | DGPCI | Separating recipient and payer, confirming email and showing a demonstration total. |

## Digitisation and pilot candidates

These studies start with printable documents or PDFs. They explore possible digital journeys and can support pilot discussions; no institutional pilot has been agreed.

| Study | Source | What the proposal explores |
| --- | --- | --- |
| [Criminal-record certificate request](/en/reality/criminal-record/) | Romanian Police · Constanța County Police | Turning a scanned application into grouped questions and answer review. |
| [Form 230: one beneficiary](/en/reality/income-tax/) | ANAF · 2025 edition | Separating taxpayer and recipient details, with guidance beside the fields. |
| [Pension-related petition](/en/reality/petition/) | Ministry of Defence sectoral pension office | A consistent structure for identity, correspondence and describing the issue. |

## Reading the comparison

Each study includes a web-form screenshot or an image of the published document, a link to the institution’s source, proposed changes and an interactive form built with the SDR library. Sources were checked on **26–27 October 2026**. The original publication dates are not known for every document; appearance alone does not establish age.

The comparison concerns **these forms**, rather than each institution’s entire digital service. A printable PDF can remain useful at a service desk, and some requests already have online alternatives. For example, [MAI provides an electronic criminal-record certificate service](https://hub.mai.gov.ro/serviciu/view?id=88). The SDR study does not replace it.

## What you can try

The demonstrations include steps, persistent labels, appropriate input types, inline errors and an error summary linking to fields. Answers can be checked and changed before finishing. Details stay in the open page without transmission or browser storage. Reloading the page or restarting the demonstration clears them.

The documentation version uses SDR React components. The standalone version uses HTML generated from the same composition and the library’s two files. Journey navigation and validation are demonstration code. [Study source code is in the repository](https://github.com/strictlylucian/sdr/tree/main/apps/docs/src/studies).

## What a pilot would need to establish

Required fields are prototype choices, rather than a legal interpretation of the forms. Validation checks format, not identity, eligibility, institutional records or authenticity. Signatures, supporting documents and actual submission are not implemented.

A pilot would need institutional requirements review, research with people using the service, integration with existing systems and accessibility evaluation. These studies do not establish faster completion times or compliance for a complete service.
