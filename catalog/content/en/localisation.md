SDR components display the content supplied by the application. Translation, language selection, plural rules and date/currency formatting belong to the consuming project. The library has no locale provider, built-in dictionaries or i18n dependency.

## Labels and accessible names

Labels, hints, errors, titles and action names are ordinary props. Stateful controls also accept their changing labels. These values can come from any translation library or from plain strings.

~~~tsx
import { SdrProvider, PasswordInput } from '@sdr/react';

<SdrProvider lang="ro">
  <PasswordInput
    label="Parolă"
    showLabel="Afișează parola"
    hideLabel="Ascunde parola"
    name="password"
  />
</SdrProvider>
~~~

The native lang attribute identifies the language for browsers and assistive technology. It does not translate content or select a dictionary. Any language tag is supported. SdrProvider supplies theme, density and scoped styling.

Accordion receives expandAllLabel/collapseAllLabel; DateInput receives day/month/year labels; dialogs and toast notifications receive closeLabel; service navigation receives menuLabel. Composite field patterns also receive their legends, labels and hints. These explicit contracts allow an application to keep all copy in its existing translation system.

## Character counts and changing text

CharacterCount receives a required formatCount(remaining) callback. Negative values indicate an exceeded limit. The application handles wording and plural/number formatting; SDR counts Unicode code points and manages the live region. Unicode code points can differ from visually perceived characters.

In portable HTML, SDR.init(root, options) accepts formatCount(remaining, element). The element can identify application-specific messages for different counters. Password controls read data-sdr-show-label/data-sdr-hide-label; accordions read data-sdr-expand-label/data-sdr-collapse-label. Missing required labels or formatters produce an integration error instead of default-language copy. Initial setup is described in [Get started](/en/getting-started/).

Updating labels or formatCount in React preserves the answer, password visibility and expanded sections. Plain HTML applications manage their own content updates and enhancement lifecycle.

## Documentation translations

The documentation uses i18next with local Romanian/English JSON under apps/docs/src/i18n/. ui.json contains documentation UI, examples.json contains example content, and components.json contains shared example labels and count plurals. Starlight supplies documentation language routes and framework translations. This translation code is part of the documentation, not the component packages.

Component and pattern definitions, including variant hierarchy and bilingual guidance, are centralised in catalog/data/. Editing visible copy does not change stable IDs or route anchors. Long-form guidance remains separate Romanian/English content. The repository I18N.md maps the editable sources.

## Dates, currency and sorting

Applications can use their existing formatters or native Intl directly. SDR does not choose a locale, currency or time zone.

~~~ts
const amount = new Intl.NumberFormat('ro-RO', {
  style: 'currency', currency: 'RON'
}).format(1250);
const date = new Intl.DateTimeFormat('ro-RO', {
  dateStyle: 'long', timeZone: 'Europe/Bucharest'
}).format(new Date('2026-10-25T10:00:00Z'));
~~~

DataTable accepts a compareText callback for application-specific collation. The portable init options accept the same callback. Numeric columns compare numeric values; formatted cell content can have a separate numeric sort value.

## Language navigation

LanguageNavigation displays supplied links with lang, hreflang and the current-language state. It does not generate routes, choose a language or load translations. Links to equivalent versions of the current page help preserve navigation context.

Text controls accept Unicode, including Romanian diacritics. Inter is embedded in CSS. [Text input](/en/components/text-input/), [Textarea](/en/components/textarea/) and [Language navigation](/en/components/language-navigation/) document their individual contracts.
