import definitions from './data/component-states.json';
import { componentHref } from './component-navigation';

export const componentStates = definitions;
export const stateAnchor = (slug: string) => 'state-' + slug;
export function componentStateHref(state: typeof definitions[number], locale: 'ro' | 'en') {
  return componentHref(state.component, locale).split('#')[0] + '#' + stateAnchor(state.slug);
}
