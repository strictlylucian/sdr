import React from 'react';
import type { ReactNode } from 'react';
import * as R from '../../../../packages/react/src';
import { docsUrl } from '../docs-url';
import { componentText, exampleText, studyText as t } from '../i18n/messages';
import type { FormStudy, Locale } from './forms';

export default function StudyShell({ study, locale, children, prefix = `study-${study.id}`, exampleIndex, backHref }: { study: FormStudy; locale: Locale; children: ReactNode; prefix?: string; exampleIndex?: number; backHref?: string }) {
  return <R.Page data-form-study={exampleIndex === undefined ? study.id : undefined} data-study-page={exampleIndex} data-study-mode={exampleIndex === undefined ? 'journey' : 'page'} lang={locale}
    mainId={`${prefix}-main`} skipLabel={componentText(locale, 'skip')} embedded={exampleIndex !== undefined}
    mainLabelledBy={exampleIndex === undefined ? undefined : `${prefix}-title`}
    header={<R.Header serviceName={t(locale, study.title)} href={`#${prefix}-form`}><span>{t(locale, 'demoInstitution')}</span></R.Header>}
    navigation={<R.ServiceNavigation label={exampleIndex === undefined ? t(locale, 'formNavigation') : `${t(locale, 'formNavigation')}: ${t(locale, 'stepNumber', { number: exampleIndex + 1 })}`} menuLabel={t(locale, 'menu')} items={[
      { label: t(locale, study.pricing ? 'paymentDetails' : 'application'), href: `#${prefix}-form`, current: true },
    ]} />}
    beforeContent={<R.BackLink data-study-page-back href={backHref ?? docsUrl(`/${locale}/reality/`)}>{t(locale, 'back')}</R.BackLink>}
    footer={<R.Cluster>
      <R.Link href={docsUrl(`/${locale}/accessibility/`)}>{exampleText(locale, 'page.accessibility')}</R.Link>
      <R.Link href={docsUrl(`/${locale}/patterns/cookies/`)}>{exampleText(locale, 'page.cookies')}</R.Link>
    </R.Cluster>}>
      {children}
  </R.Page>;
}
