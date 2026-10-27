import React from 'react';
import type { ReactNode } from 'react';
import * as R from '../../../../packages/react/src';
import { docsUrl } from '../docs-url';
import { studyText as t } from '../i18n/messages';
import type { FormStudy, Locale } from './forms';

export default function StudyShell({ study, locale, children, panels = false }: { study: FormStudy; locale: Locale; children: ReactNode; panels?: boolean }) {
  const prefix = `study-${study.id}`;
  return <div data-form-study={study.id} data-study-mode={panels ? 'panels' : 'journey'} lang={locale}>
    <R.Header serviceName={t(locale, study.title)} href={`#${prefix}-form`}><span>{t(locale, 'demoInstitution')}</span></R.Header>
    <R.ServiceNavigation label={t(locale, 'formNavigation')} menuLabel={t(locale, 'menu')} items={[
      { label: t(locale, study.pricing ? 'paymentDetails' : 'application'), href: `#${prefix}-form`, current: true },
      { label: t(locale, 'help'), href: `#${prefix}-help` },
    ]} />
    <R.Container className="sdr-main-wrapper sdr-stack">
      <div><R.BackLink href={docsUrl(`/${locale}/reality/`)}>{t(locale, 'back')}</R.BackLink></div>
      {children}
      <section id={`${prefix}-help`} className="sdr-stack">
        <h2 className="sdr-heading-md">{t(locale, 'help')}</h2>
        <p><a href={study.source}>{t(locale, study.sourcePreview === 'publication' ? 'openDocument' : study.sourceType === 'web' ? 'openWebsite' : 'openOriginal')}</a></p>
      </section>
    </R.Container>
  </div>;
}
