import { docsUrl } from './docs-url';
import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { patterns, patternEntries } from '../../../catalog/patterns';
import { patternHref } from '../../../catalog/pattern-navigation';
import { components } from '../../../catalog/components';
import { componentVariants } from '../../../catalog/component-variants';
import { componentHref } from '../../../catalog/component-navigation';
type Entry = StarlightRouteData['sidebar'][number];
export const onRequest = defineRouteMiddleware(context => {
  const route = (context.locals as { starlightRoute: StarlightRouteData }).starlightRoute;
  const locale = route.locale;
  if (locale !== 'ro' && locale !== 'en') throw new Error('Sidebar requires a supported documentation locale.');
  const nest = (entries: Entry[]): Entry[] => entries.map(entry => {
    if (entry.type === 'group') return { ...entry, entries: nest(entry.entries) };
    const parent = components.find(item => docsUrl(componentHref(item.name, locale)) === entry.href && !componentVariants.some(variant => variant.name === item.name));
    if (!parent) {
      const pattern = patterns.find(item => docsUrl(patternHref(item.slug, locale)) === entry.href);
      if (!pattern || !pattern.variants.length) return entry;
      const primary = patternEntries.find(item => item.slug === pattern.primarySlug);
      if (!primary) throw new Error('Pattern sidebar primary missing.');
      return {
        type: 'group', label: entry.label, collapsed: false, badge: undefined,
        entries: [
          { ...entry, label: primary.title[locale], attrs: { ...entry.attrs, 'data-sdr-parent': 'pattern:' + pattern.slug } },
          ...pattern.variants.map(variant => ({ type: 'link' as const, label: variant.title[locale], href: docsUrl(patternHref(variant.slug,locale)), isCurrent: false, badge: undefined, attrs: { 'data-sdr-variant': 'pattern:' + variant.slug } })),
        ],
      };
    }
    const variants = componentVariants.filter(variant => variant.parent === parent.name);
    if (!variants.length) return entry;
    return {
      type: 'group', label: entry.label, collapsed: false, badge: undefined,
      entries: [
        { ...entry, label: locale === 'ro' ? 'Prezentare' : 'Overview', attrs: { ...entry.attrs, 'data-sdr-parent': parent.name } },
        ...variants.map(variant => ({
          type: 'link' as const, label: variant.title[locale], href: docsUrl(componentHref(variant.name, locale)),
          isCurrent: false, badge: undefined, attrs: { 'data-sdr-variant': variant.name },
        })),
      ],
    };
  });
  route.sidebar = nest(route.sidebar);
});
