import { additionalPaperStudies } from './additional-paper-studies';
import { additionalWebStudies } from './additional-web-studies';
import { paperStudies } from './paper-studies';
import { onlineStudies } from './online-studies';
import type { FormStudy, Key } from './study-types';
export type * from './study-types';
export const studyGroups: { key: Key; studies: FormStudy[] }[] = [
  { key: 'webStudies', studies: [...onlineStudies, ...additionalWebStudies] },
  { key: 'paperStudies', studies: additionalPaperStudies },
  { key: 'documentStudies', studies: paperStudies },
];
export const formStudies: FormStudy[] = studyGroups.flatMap(group => group.studies);

export function getFormStudy(id: string): FormStudy {
  const study = formStudies.find(item => item.id === id);
  if (!study) throw new Error(`Unknown form study: ${id}`);
  return study;
}
