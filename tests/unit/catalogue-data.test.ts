import { expect, it } from 'vitest';
import { components, orderedComponents } from '../../catalog/components';
import { componentVariants } from '../../catalog/component-variants';
import { patternEntries, patterns } from '../../catalog/patterns';
import { patternGroups } from '../../catalog/pattern-groups';

it('keeps component variant IDs, parents and translated anchors valid', () => {
  const names = components.map(component => component.name);
  expect(new Set(names).size).toBe(names.length);
  expect(new Set(componentVariants.map(variant => variant.name)).size).toBe(componentVariants.length);
  for (const variant of componentVariants) {
    expect(names).toContain(variant.name); expect(names).toContain(variant.parent);
    expect(variant.name).not.toBe(variant.parent);
    for (const locale of ['ro', 'en'] as const) {
      expect(variant.title[locale].trim()).not.toBe('');
      expect(variant.guidance[locale].trim()).not.toBe('');
      expect(variant.anchor[locale]).toMatch(/^variant-[a-z0-9-]+$/);
    }
  }
});

it('keeps pattern groups linked to unique, translated scenarios', () => {
  const slugs = patternEntries.map(entry => entry.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
  expect(new Set(patterns.map(pattern => pattern.slug)).size).toBe(patterns.length);
  const used = new Set<string>();
  for (const group of patternGroups) for (const slug of [group.primary, ...group.variants]) {
    expect(slugs).toContain(slug); expect(used.has(slug)).toBe(false); used.add(slug);
  }
  for (const entry of patternEntries) for (const locale of ['ro', 'en'] as const) {
    expect(entry.title[locale].trim()).not.toBe('');
    expect(entry.guidance[locale].trim()).not.toBe('');
    expect(entry.example.trim()).not.toBe('');
  }
});

it.each(['ro', 'en'] as const)('keeps Page first and %s component names alphabetic', locale => {
  const ordered = orderedComponents(locale), collator = new Intl.Collator(locale, { sensitivity: 'base', numeric: true });
  expect(ordered[0].name).toBe('Page');
  for (let index = 2; index < ordered.length; index++) expect(collator.compare(ordered[index - 1].title[locale], ordered[index].title[locale])).toBeLessThanOrEqual(0);
});
