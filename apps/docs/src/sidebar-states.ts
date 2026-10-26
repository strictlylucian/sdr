import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import { componentStates, componentStateHref } from '../../../catalog/component-states';
import { uiText } from './i18n/messages';
import { docsUrl } from './docs-url';

type Entry = StarlightRouteData['sidebar'][number];
const titles = { error: 'docs.errorState', disabled: 'docs.disabledState', readOnly: 'docs.readOnlyState' } as const;

export function sidebarStates(component: string, locale: 'ro' | 'en'): Entry[] {
  return componentStates.filter(item => item.component === component).map(item => {
    if (!Object.hasOwn(titles, item.state)) throw new Error('Unknown component state: ' + item.state);
    return {
      type: 'link', label: uiText(locale, titles[item.state as keyof typeof titles]),
      href: docsUrl(componentStateHref(item, locale)), isCurrent: false, badge: undefined,
      attrs: { 'data-sdr-state': item.slug },
    };
  });
}
