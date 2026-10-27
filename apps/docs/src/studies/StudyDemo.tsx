import { useEffect, useRef, useState } from 'react';
import { SdrProvider } from '../../../../packages/react/src';
import StudyForm from './StudyForm';
import { mountFormStudy } from './controller';
import type { Locale, StudyId } from './forms';
export default function StudyDemo({ id, locale }: { id: StudyId; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const update = () => {
      const value = document.documentElement.dataset.theme;
      if (value !== 'light' && value !== 'dark') throw new Error('Unknown documentation appearance');
      setTheme(value);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const root = ref.current?.querySelector<HTMLElement>('[data-form-study]');
    if (!root) throw new Error('Missing form study root');
    const dispose = mountFormStudy(root);
    return () => { observer.disconnect(); dispose(); };
  }, []);
  return <div ref={ref}><SdrProvider lang={locale} theme={theme}><StudyForm id={id} locale={locale} /></SdrProvider></div>;
}
