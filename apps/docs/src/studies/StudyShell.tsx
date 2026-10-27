import React from 'react';
import type { ReactNode } from 'react';
import * as R from '../../../../packages/react/src';
import { docsUrl } from '../docs-url';
import { studyText as t } from '../i18n/messages';
import type { FormStudy, Locale } from './forms';

export default function StudyShell({ study, locale, children, prefix = `study-${study.id}`, exampleIndex, backHref }: { study: FormStudy; locale: Locale; children: ReactNode; prefix?: string; exampleIndex?: number; backHref?: string }) {
  return <div data-form-study={exampleIndex === undefined ? study.id : undefined} data-study-page={exampleIndex} data-study-mode={exampleIndex === undefined ? 'journey' : 'page'} lang={locale}>
    <R.Header serviceName={t(locale, study.title)} href={`#${prefix}-form`}><span>{t(locale, 'demoInstitution')}</span></R.Header>
    <R.ServiceNavigation label={exampleIndex === undefined ? t(locale, 'formNavigation') : `${t(locale, 'formNavigation')}: ${t(locale, 'stepNumber', { number: exampleIndex + 1 })}`} menuLabel={t(locale, 'menu')} items={[
      { label: t(locale, study.pricing ? 'paymentDetails' : 'application'), href: `#${prefix}-form`, current: true },
      { label: t(locale, 'help'), href: `#${prefix}-help` },
    ]} />
    <R.Container className="sdr-main-wrapper sdr-stack">
      <div><R.BackLink data-study-page-back href={backHref ?? docsUrl(`/${locale}/reality/`)}>{t(locale, 'back')}</R.BackLink></div>
      {children}
      <section id={`${prefix}-help`} className="sdr-stack">
        <h2 className="sdr-heading-md">{t(locale, 'help')}</h2>
        <p><a href={study.source}>{t(locale, study.sourcePreview === 'publication' ? 'openDocument' : study.sourceType === 'web' ? 'openWebsite' : 'openOriginal')}</a></p>
      </section>
    </R.Container>
  </div>;
}
