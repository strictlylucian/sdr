import { paperStudies } from './paper-studies';
import { onlineStudies } from './online-studies';
import type { FormStudy } from './study-types';
export type * from './study-types';
export const formStudies: FormStudy[] = [...onlineStudies, ...paperStudies];

export function getFormStudy(id: string): FormStudy {
  const study = formStudies.find(item => item.id === id);
  if (!study) throw new Error(`Unknown form study: ${id}`);
  return study;
}
