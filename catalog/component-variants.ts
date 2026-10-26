import definitions from './data/component-variants.json';
import type { ComponentVariant } from './schema';

export const componentVariants = definitions satisfies ComponentVariant[];
