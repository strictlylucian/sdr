import { patternGroups } from './pattern-groups';
import definitions from './data/patterns.json';
import type { PatternDefinition } from './schema';

export const patternEntries = definitions satisfies PatternDefinition[];
export const patterns = patternEntries.filter(item => !patternGroups.some(group => (group.variants as readonly string[]).includes(item.slug))).map(item => {
  const group = patternGroups.find(group => group.primary === item.slug);
  return {
    ...item, slug: group ? group.slug : item.slug, primarySlug: item.slug, title: group ? group.title : item.title,
    variants: group ? group.variants.map(slug => {
      const variant = patternEntries.find(entry => entry.slug === slug);
      if (!variant) throw new Error('Pattern variant missing: ' + slug);
      return variant;
    }) : [],
  };
});
