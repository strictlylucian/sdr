import { patterns } from './patterns';
type Locale = 'ro' | 'en';
export function patternHref(slug: string, locale: Locale) {
  for (const parent of patterns) {
    if (parent.slug === slug || parent.primarySlug === slug) return `/${locale}/patterns/${parent.slug}/`;
    const variant = parent.variants.find(item => item.slug === slug);
    if (variant) return `/${locale}/patterns/${parent.slug}/#variant-${variant.slug}`;
  }
  throw new Error('Unknown pattern: ' + slug);
}
export function patternExampleSlug(slug: string) {
  const parent = patterns.find(item => item.slug === slug || item.primarySlug === slug || item.variants.some(variant => variant.slug === slug));
  if (!parent) throw new Error('Unknown pattern: ' + slug);
  return 'pattern-' + (parent.slug === slug || parent.primarySlug === slug ? parent.slug : slug);
}
