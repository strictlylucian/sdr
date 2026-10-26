import { uiText, type Locale } from '../i18n/messages';
import { useEffect, useState } from 'react';
import { SdrProvider, type Theme } from '../../../../packages/react/src';
import * as examples from '../examples';
export default function ComponentDemo({ name, locale = 'ro' }: { name: string; locale?: Locale }) {
  const [theme, setTheme] = useState<Theme | 'auto'>('auto');
  const [documentTheme, setDocumentTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const update = () => {
      const value = document.documentElement.dataset.theme;
      if (value !== 'light' && value !== 'dark') throw new Error('Documentation appearance must be light or dark.');
      setDocumentTheme(value);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const Example = examples[`${name}Example` as keyof typeof examples];
  if (!Example) throw new Error(`Missing example for ${name}`);
  return <div className="sdr-demo" data-testid="component-demo" data-sdr-example={name}>
    <div className="sdr-demo__toolbar"><span>{uiText(locale, "ComponentDemo.interactiveExample")}</span><div className="sdr-demo__controls">
      <label>{uiText(locale, "ComponentDemo.theme")} <select value={theme} onChange={event => setTheme(event.target.value as Theme | 'auto')}><option value="auto">{uiText(locale, "ComponentDemo.matchDocumentation")}</option><option value="light">{uiText(locale, "ComponentDemo.light")}</option><option value="dark">{uiText(locale, "ComponentDemo.dark")}</option><option value="heritage">{uiText(locale, "ComponentDemo.heritage")}</option><option value="contrast">{uiText(locale, "ComponentDemo.highContrast")}</option></select></label>
      <label>{uiText(locale, "ComponentDemo.density")} <select value={density} onChange={event => setDensity(event.target.value as typeof density)}><option value="comfortable">{uiText(locale, "ComponentDemo.comfortable")}</option><option value="compact">{uiText(locale, "ComponentDemo.compact")}</option></select></label>
    </div></div>
    <SdrProvider lang={locale} theme={theme === 'auto' ? documentTheme : theme} density={density} className="sdr-demo__canvas"><Example locale={locale} /></SdrProvider>
  </div>;
}
