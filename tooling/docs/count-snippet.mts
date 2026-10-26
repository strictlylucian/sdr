import ro from '../../apps/docs/src/i18n/ro/components.json';
import en from '../../apps/docs/src/i18n/en/components.json';

/** A consumer-owned formatter example; none of this is supplied by SDR packages. */
export function countSnippet(locale: 'ro' | 'en') {
  const messages = Object.fromEntries(Object.entries(locale === 'ro' ? ro : en).filter(([key]) => /^(remaining|over)_/.test(key)));
  return `import { createInstance } from 'i18next';

// Application-owned translations; SDR only receives the formatter callback.
const i18n = createInstance();
void i18n.init({ lng: '${locale}', initAsync: false, fallbackLng: false,
  resources: { ${locale}: { translation: ${JSON.stringify(messages)} } },
  interpolation: { prefix: '{', suffix: '}', escapeValue: false }
});
const formatCount = (remaining: number) => i18n.t(remaining < 0 ? 'over' : 'remaining', { count: Math.abs(remaining) });

`;
}
