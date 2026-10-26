import { componentVariants } from './component-variants';
import definitions from './data/components.json';
import type { ComponentDefinition } from './schema';

export const components = definitions satisfies ComponentDefinition[];
export const slug = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
export function orderedComponents(locale: 'ro' | 'en') {
  const collator = new Intl.Collator(locale, { sensitivity: 'base', numeric: true });
  return components.filter(item => !componentVariants.some(variant => variant.name === item.name)).sort((a, b) => a.name === 'Page' ? -1 : b.name === 'Page' ? 1 : collator.compare(a.title[locale], b.title[locale]));
}
