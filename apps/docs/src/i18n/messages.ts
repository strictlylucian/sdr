import { createInstance } from 'i18next';
import enStudies from './en/studies.json';
import roStudies from './ro/studies.json';
import enExamples from './en/examples.json';
import roExamples from './ro/examples.json';
import enUi from './en/ui.json';
import roUi from './ro/ui.json';
import enComponents from './en/components.json';
import roComponents from './ro/components.json';

export type Locale = 'ro' | 'en';
type Values = Readonly<Record<string, string | number>>;
const i18n = createInstance();
void i18n.init({
  resources: {
    en: { studies: enStudies, examples: enExamples, ui: enUi, components: enComponents },
    ro: { studies: roStudies, examples: roExamples, ui: roUi, components: roComponents },
  },
  supportedLngs: ['ro', 'en'], lng: 'ro', fallbackLng: false, initAsync: false,
  defaultNS: 'ui', keySeparator: false, returnNull: false, returnEmptyString: false,
  interpolation: { prefix: '{', suffix: '}', escapeValue: false },
  parseMissingKeyHandler(key) { throw new Error(`Missing documentation translation: ${key}`); },
  missingInterpolationHandler(_, value) { throw new Error(`Missing translation value: ${value}`); },
});

function text(locale: string, namespace: string, key: string, values: Values) {
  if (locale !== 'ro' && locale !== 'en') throw new Error(`Unsupported documentation locale: ${locale}`);
  // A fixed language per call keeps concurrent SSR requests independent.
  return i18n.getFixedT(locale, namespace)(key, values);
}
export const exampleText = (locale: Locale, key: keyof typeof enExamples, values: Values = {}) => text(locale, 'examples', key, values);
export const uiText = (locale: string, key: keyof typeof enUi, values: Values = {}) => text(locale, 'ui', key, values);
export const componentText = (locale: Locale, key: keyof typeof enComponents, values: Values = {}) => text(locale, 'components', key, values);
export const countText = (locale: Locale, remaining: number) => text(locale, 'components', remaining < 0 ? 'over' : 'remaining', { count: Math.abs(remaining) });

export const studyText = (locale: Locale, key: keyof typeof enStudies, values: Values = {}) => text(locale, 'studies', key, values);
