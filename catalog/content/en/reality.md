These studies explain the problems in specific forms published by Romanian institutions, why those problems matter and how SDR components could address them.

## Existing online forms

These comparisons redesign existing web interfaces, keeping the service and observable requirements as their starting point.

| Study | Source | What the proposal addresses |
| --- | --- | --- |
| [Online petition: immigration](/en/reality/online-igi/) | Inspectorate General for Immigration | Incorrect label associations and hard-to-read guidance; clear question groups and answer review. |
| [Online payment: provisional authorisation](/en/reality/online-payment/) | DGPCI | Compressed side labels and similar identity questions; clearer recipient, payer and contact steps. |
| [Report a local infrastructure problem](/en/reality/online-gruiu/) | Gruiu Town Hall | Unconnected labels and a continuous reporting form; clearer issue, location and contact panels. |
| [Border-water fishing approval](/en/reality/online-fishing/) | Romanian Border Police | Long procedural labels, county selection and conflicting document guidance; visible choices and document requirements. |

## Paper forms and service proposals

The two new approval studies were selected after checking the operators’ published service routes for a dedicated digital equivalent on **27 October 2026**. ASCE specifies submission at its office; CMIPB accepts completed dossiers at its counter or by email. Neither published route provided a structured online application for the selected request. Each article records the scope and evidence of that check; an institution must confirm any unlisted or forthcoming system before a pilot.

| New service study | Source | What the proposal addresses |
| --- | --- | --- |
| [Utility-work clearance](/en/reality/lighting-clearance/) | Bucharest municipal public-lighting operator, CMIPB | A signed PDF and document dossier; structured application and contextual document controls. |
| [Public-land crossing approval](/en/reality/street-crossing/) | Alexandria municipal street-services operator, ASCE | Downloadable Word application and office submission; clear project questions and a visible dossier checklist. |

The earlier document-interface comparisons below remain useful design studies. They are **not evidence of a missing digital service**: an electronic criminal-record service already exists, and ANAF’s Form 230 is already a fillable PDF. These comparisons must not be presented as newly discovered gaps in digitisation.

| Study | Source | What the proposal addresses |
| --- | --- | --- |
| [Criminal-record certificate request](/en/reality/criminal-record/) | Romanian Police · Constanța County Police | Image-only questions and handwritten blanks; semantic controls and grouped questions. |
| [Form 230: one beneficiary](/en/reality/income-tax/) | ANAF · 2025 edition | Several scenarios crowded onto a fixed page; relevant questions and nearby guidance. |
| [Pension-related petition](/en/reality/petition/) | Ministry of Defence sectoral pension office | Scanned boxes and limited writing space; readable, responsive fields and expandable text. |

## Why these changes are needed

A public form needs to make information easy to read, questions easy to understand and answers easy to enter and correct. These examples show two different kinds of work.

### Existing web forms: remove usability and accessibility barriers

Being online is only the starting point. The IGI example has incorrect programmatic label associations and small supporting text. The DGPCI capture shows long labels squeezed beside controls and faint information beneath the form. These are concrete barriers to understanding and completing a service, particularly for people using assistive technology or needing more readable text.

### Paper and PDF forms: create a digital service journey

Putting a scan or fixed-page PDF on a website makes a document downloadable. It leaves the person working with a sheet-shaped interface, often without semantic fields, responsive reading, contextual validation or a structured answer check. Where printing, handwriting, scanning or re-entry are required, the process also depends on equipment and manual handling.

Digitisation brings questions, guidance and structured answers into a usable service journey, connected to submission and institutional processing. The SDR examples demonstrate the interface part of that change. A fillable PDF and a print option may still be useful alongside a web service.

## Why consistency matters across institutions

In these examples, even familiar identity and contact questions change their typography, label position, spacing and action styling from one service to another. People have to learn the interface again each time. Shared components let different services ask their own questions through familiar controls, readable type, predictable layouts and consistent help and error patterns. That is a practical reason for a common design system.

## Reading the comparison

Each study includes a web-form screenshot, an image of the published PDF or the official download page for a Word document, a link to the institution’s source, proposed changes and a remake built with the SDR library. Documentation shows all question steps and the final answer review as individual panels, with links in the step indicator; no answers are required to inspect later steps. Sources were checked on **26–27 October 2026**.

The critique combines captured screens with targeted, read-only HTML checks. The original web forms were not submitted or used to make payments. These observations identify specific barriers; they are not a full WCAG audit of every service.

The comparison concerns **these forms**, rather than each institution’s entire digital service. A printable PDF can remain useful at a service desk, and some requests already have online alternatives. For example, [MAI provides an electronic criminal-record certificate service](https://hub.mai.gov.ro/serviciu/view?id=88). The SDR study does not replace it.

## What you can try

Documentation panels, including answer review, are all visible. The review updates as controls are explored, without requiring the other questions to be completed. The standalone demonstrations use the SDR step indicator, persistent labels and appropriate input types. Both versions are visual baselines, without validation or error states; empty or incomplete answers never block exploration. In that interactive journey, answers can be checked and changed before finishing. Details stay in the open page without transmission or browser storage. Reloading the page or restarting the demonstration clears them.

The documentation version uses SDR React components. The standalone version uses HTML generated from the same field definitions and SDR components and the library’s two files. Journey navigation is demonstration code. [Study source code is in the repository](https://github.com/strictlylucian/sdr/tree/main/apps/docs/src/studies).

## What a pilot would need to establish

Optional labels and suggested field formats are prototype choices, rather than a legal interpretation of the forms. The examples do not validate answers, identity, eligibility or institutional records. Signatures and document authenticity are not verified, and actual submission is not implemented.

A pilot would need institutional requirements review, research with people using the service, integration with existing systems and accessibility evaluation. These studies do not establish faster completion times or compliance for a complete service.
