import type messages from '../i18n/en/studies.json';
type Key = keyof typeof messages;
export type StudyId = 'criminal-record' | 'income-tax' | 'petition';
export type Locale = 'ro' | 'en';
export interface Field { name: string; key: Key; type?: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'checkbox' | 'number'; required?: boolean; pattern?: string; hint?: Key; autoComplete?: string; min?: string; max?: string; step?: string; }
export interface Step { key: Key; fields: Field[]; }
export interface FormStudy { id: StudyId; title: Key; institution: string; source: string; edition: Key; steps: Step[]; }
const field = (name: string, key: Key, options: Omit<Field, 'name' | 'key'> = {}): Field => ({ name, key, ...options });
const identity = [field('surname', 'surname', { required: true, autoComplete: 'family-name' }), field('given-name', 'givenName', { required: true, autoComplete: 'given-name' }), field('personal-number', 'personalNumber', { required: true, pattern: '[0-9]{13}', hint: 'fictionalCnp' })];
const address = [field('county', 'county', { required: true, autoComplete: 'address-level1' }), field('town', 'town', { required: true, autoComplete: 'address-level2' }), field('street', 'street', { autoComplete: 'address-line1' }), field('house-number', 'houseNumber'), field('building', 'building'), field('staircase', 'staircase'), field('floor', 'floor'), field('apartment', 'apartment')];
const document = [field('document-series', 'documentSeries'), field('document-number', 'documentNumber', { required: true })];
export const formStudies: FormStudy[] = [
  { id: 'criminal-record', title: 'criminalTitle', institution: 'Poliția Română · IPJ Constanța', source: 'https://ct.politiaromana.ro/files/pages_files/Cerere_eliberare_Cazier_Judiciar_Persoana_Fizica.pdf', edition: 'criminalEdition', steps: [
    { key: 'identity', fields: [...identity, field('previous-name', 'previousName'), field('parent-one', 'parentOne'), field('parent-two', 'parentTwo'), field('birth-date', 'birthDate', { type: 'date', required: true }), field('birth-town', 'birthTown', { required: true }), field('birth-county', 'birthCounty', { required: true })] },
    { key: 'addressAndDocument', fields: [...address.filter(item => !['staircase', 'floor'].includes(item.name)), ...document] },
    { key: 'request', fields: [field('purpose', 'purpose', { type: 'textarea', required: true }), field('declaration-date', 'declarationDate', { type: 'date', required: true }), field('declaration', 'criminalDeclaration', { type: 'checkbox', required: true, hint: 'signatureNote' })] },
  ] },
  { id: 'income-tax', title: 'taxTitle', institution: 'Agenția Națională de Administrare Fiscală', source: 'https://static.anaf.ro/static/10/Anaf/formulare/230_OPANAF_103_2025.pdf', edition: 'taxEdition', steps: [
    { key: 'taxpayer', fields: [field('tax-year', 'taxYear', { required: true, pattern: '[0-9]{4}' }), ...identity.map((item): Field => item.name === 'personal-number' ? { ...item, key: 'taxNumber', pattern: '[0-9]+', hint: 'taxNumberHint' } : item), field('father-initial', 'fatherInitial')] },
    { key: 'fiscalAddress', fields: [...address, field('postcode', 'postcode', { autoComplete: 'postal-code' })] },
    { key: 'contactDetails', fields: [field('email', 'email', { type: 'email', autoComplete: 'email' }), field('phone', 'phone', { type: 'tel', autoComplete: 'tel' }), field('fax', 'fax', { type: 'tel' })] },
    { key: 'beneficiary', fields: [field('organisation', 'organisation', { required: true }), field('organisation-tax-number', 'organisationTaxNumber', { required: true, pattern: '[0-9]+' }), field('iban', 'iban', { required: true, hint: 'ibanHint' }), field('percentage', 'percentage', { type: 'number', required: true, min: '0.01', max: '3.5', step: '0.01', hint: 'percentageHint' }), field('amount', 'amount', { type: 'number', min: '0', step: '0.01', hint: 'amountHint' }), field('two-years', 'twoYears', { type: 'checkbox' }), field('share-details', 'shareDetails', { type: 'checkbox' })] },
    { key: 'declaration', fields: [field('declaration', 'taxDeclaration', { type: 'checkbox', required: true, hint: 'signatureNote' })] },
  ] },
  { id: 'petition', title: 'petitionTitle', institution: 'Casa de pensii sectorială a Ministerului Apărării Naționale', source: 'https://cps.mapn.ro/webroot/fileslib/upload/files/Formulare/20250910_N_FormularPetitie.PDF', edition: 'petitionEdition', steps: [
    { key: 'identity', fields: [...identity, field('email', 'email', { type: 'email', autoComplete: 'email' }), field('document-type', 'documentType'), ...document, field('issued-by', 'issuedBy'), field('issue-date', 'issueDate', { type: 'date' }), field('expiry-date', 'expiryDate', { type: 'date' })] },
    { key: 'correspondence', fields: address },
    { key: 'petition', fields: [field('petition-county', 'petitionCounty', { required: true }), field('capacity', 'capacity', { required: true }), field('pension-file', 'pensionFile'), field('petition-text', 'petitionText', { type: 'textarea', required: true })] },
  ] },
];
export function getFormStudy(id: string): FormStudy {
  const study = formStudies.find(item => item.id === id);
  if (!study) throw new Error(`Unknown form study: ${id}`);
  return study;
}
