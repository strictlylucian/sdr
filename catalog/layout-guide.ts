import { uiText } from '../apps/docs/src/i18n/messages';
export function layoutGuide(locale: 'ro' | 'en') {
  const ro = locale === 'ro';
  return `
## ${uiText(locale, "layout-guide.pageStructure")}

${uiText(locale, "layout-guide.headerServiceNavigationAndContentShareA64rem")}

| ${uiText(locale, "layout-guide.class")} | ${uiText(locale, "layout-guide.purpose")} |
|---|---|
| sdr-width-container / sdr-container | ${uiText(locale, "layout-guide.aliasesForTheSameMaximumWidthCentringAnd")} |
| sdr-main-wrapper | ${uiText(locale, "layout-guide.mainVerticalSpacing32pxThen48pxFrom40rem")} |
| sdr-main-wrapper--l | ${uiText(locale, "layout-guide.combineWithMainWrapperFor48px64pxTop")} |
| sdr-main-wrapper--auto-spacing | ${uiText(locale, "layout-guide.increaseTopSpacingWhenMainIsTheFirst")} |
| sdr-grid-row | ${uiText(locale, "layout-guide.wrappingFractionalGridWithTheSharedGapToken")} |
| sdr-grid-column-… | ${uiText(locale, "layout-guide.fullWidthOnMobileChosenFractionFrom40rem")} |
| sdr-grid-column-…-from-desktop | ${uiText(locale, "layout-guide.applyTheFractionFrom64remCanOverrideThe")} |

${uiText(locale, "layout-guide.availableFractionsFullOneHalfOneThirdTwo")}

### ${uiText(locale, "layout-guide.pageAdaptation")}

${uiText(locale, "layout-guide.thePageExampleKeepsItsFormAndSupporting")}

### React

~~~tsx
<>
<R.Header serviceName="Servicii pentru comunitate" />
<R.ServiceNavigation label="Serviciu" items={navigationItems} />
<R.Container>
  <R.Breadcrumbs label="Navigare" items={breadcrumbs} />
  <main className="sdr-main-wrapper">
    <div className="sdr-grid-row">
      <section className="sdr-grid-column-two-thirds">
        <h1>Solicită un document</h1>
      </section>
      <aside className="sdr-grid-column-one-third">Ajutor</aside>
    </div>
  </main>
</R.Container>
</>
~~~

### HTML

~~~html
<div class="sdr-width-container">
  <main class="sdr-main-wrapper sdr-main-wrapper--l">
    <div class="sdr-grid-row">
      <section class="sdr-grid-column-two-thirds">
        <h1>Solicită un document</h1>
      </section>
      <aside class="sdr-grid-column-one-third">Ajutor</aside>
    </div>
  </main>
</div>
~~~

${uiText(locale, "layout-guide.headerAndServiceNavigationAlreadyIncludeTheInnerContainer")} [Page](/${locale}/components/page/) ${uiText(locale, "layout-guide.exampleForTheCompleteCompositionIncludingAnAligned")}

${uiText(locale, "layout-guide.theSdrContainerTokenOnTheSdrRoot")}
`;
}
