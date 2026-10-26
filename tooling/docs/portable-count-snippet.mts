import ro from '../../apps/docs/src/i18n/ro/components.json';
import en from '../../apps/docs/src/i18n/en/components.json';

/** Plain application JavaScript for a classic-script portable integration. */
export function portableCountSnippet(locale: 'ro' | 'en') {
  const messages = Object.fromEntries(Object.entries(locale === 'ro' ? ro : en).filter(([key]) => /^(remaining|over)_/.test(key)));
  return `const messages = ${JSON.stringify(messages)};
const plurals = new Intl.PluralRules('${locale}');
const numbers = new Intl.NumberFormat('${locale}');
function formatCount(remaining) {
  const count = Math.abs(remaining);
  const key = (remaining < 0 ? 'over_' : 'remaining_') + plurals.select(count);
  return messages[key].replaceAll('{count}', numbers.format(count));
}
const dispose = SDR.init(document, { formatCount });`;
}
