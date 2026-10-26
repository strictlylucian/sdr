import { components } from './components';
import { componentVariants } from './component-variants';
type Locale = 'ro' | 'en';
export function componentHref(name: string, locale: Locale) {
  const variant = componentVariants.find(item => item.name === name);
  const parent = components.find(item => item.name === (variant ? variant.parent : name));
  if (!parent) throw new Error('Unknown component: ' + name);
  return '/' + locale + '/components/' + parent.slug + '/' + (variant ? '#' + variant.anchor[locale] : '');
}
