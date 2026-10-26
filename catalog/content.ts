import { readFileSync } from 'node:fs';

export const localisationContent = {
  ro: readFileSync(new URL('./content/ro/localisation.md', import.meta.url), 'utf8'),
  en: readFileSync(new URL('./content/en/localisation.md', import.meta.url), 'utf8'),
};
export const projectContent = {
  ro: readFileSync(new URL('./content/ro/about.md', import.meta.url), 'utf8'),
  en: readFileSync(new URL('./content/en/about.md', import.meta.url), 'utf8'),
};
