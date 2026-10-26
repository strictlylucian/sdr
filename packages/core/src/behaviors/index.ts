import { tabs } from './tabs';
import { password, characterCount, toggle } from './forms';
import { dialog, tooltip, dismiss, disclosure } from './overlays';
import { sortableTable } from './table';
import { actions } from './actions';
import { accordion } from './accordion';
import { serviceNavigation } from './navigation';
import { conditionalChoice } from './conditional-choice';
import type { EnhancementOptions } from './options';
export type { EnhancementOptions } from './options';
export const behaviors = { accordion, tabs, password, 'character-count': characterCount, toggle, dialog, tooltip, dismiss, disclosure, actions, 'data-table': sortableTable, 'service-navigation': serviceNavigation, 'conditional-choice': conditionalChoice };
export type Behavior = keyof typeof behaviors;
export function enhance(element: HTMLElement, name: Behavior, options: EnhancementOptions = {}) {
  if (name === 'character-count') return characterCount(element, options);
  if (name === 'data-table') return sortableTable(element, options);
  return behaviors[name](element);
}
