import type { FormStudy } from './study-types';
import { field } from './fields';
import counties from './fishing-counties.json' with { type: 'json' };
const upload = { type: 'file' as const, accept: '', maxBytes: 10000000, hint: 'fishingUploadHint' as const };
export const additionalWebStudies: FormStudy[] = [
  {
    id: 'online-gruiu', sourceType: 'web', capturedOn: '2026-10-27', image: { width: 848, height: 1251 },
    title: 'gruiuTitle', institution: 'Primăria comunei Gruiu',
    source: 'https://www.primariagruiu.ro/38-general/altele/229-sesizari-rapide.html', edition: 'gruiuEdition', completionKey: 'completedText',
    steps: [
      { key: 'issueDetails', fields: [
        field('issue-type', 'issueType', { type: 'radios', required: true, options: [
          { value: 'lighting', labelKey: 'issueLighting' }, { value: 'water', labelKey: 'issueWater' },
          { value: 'roads', labelKey: 'issueRoads' }, { value: 'waste', labelKey: 'issueWaste' }, { value: 'other', labelKey: 'issueOther' },
        ] }),
        field('other-issue', 'otherIssue', { required: true, showWhen: { field: 'issue-type', value: 'other' } }),
        field('description', 'issueDescription', { type: 'textarea', required: true }),
      ] },
      { key: 'issueLocation', fields: [
        field('locality', 'locality', { type: 'radios', required: true, options: ['Gruiu', 'Lipia', 'Șanțu Florești', 'Siliștea Snagovului'].map(label => ({ value: label, label })) }),
        field('street', 'street', { required: true }), field('house-number', 'houseNumber', { required: true }),
      ] },
      { key: 'contactDetails', fields: [
        field('full-name', 'fullName', { required: true, autoComplete: 'name' }),
        field('email', 'email', { type: 'email', autoComplete: 'email' }), field('phone', 'phone', { type: 'tel', autoComplete: 'tel' }),
        field('attachment', 'attachment', { type: 'file', multiple: true, accept: '.pdf,.jpg,.jpeg,.png', maxBytes: 5000000, hint: 'supportingUploadHint' }),
        field('privacy-read', 'privacyAcknowledgement', { type: 'checkbox', required: true, hint: 'privacyDemoHint' }),
      ] },
    ],
  },
  {
    id: 'online-fishing', sourceType: 'web', capturedOn: '2026-10-27', image: { width: 826, height: 1523 },
    title: 'fishingTitle', institution: 'Poliția de Frontieră Română',
    source: 'https://www.politiadefrontiera.ro/ro/main/pg-formular-de-avizare-a-activitatilor-de-pescuit-sportiv-in-zona-de-frontiera-pentru-persoane-fizice-250.html',
    edition: 'fishingEdition', completionKey: 'completedText', fileTotalBytes: 10000000,
    steps: [
      { key: 'identity', fields: [
        field('surname', 'surname', { required: true, autoComplete: 'family-name' }), field('given-name', 'givenName', { required: true, autoComplete: 'given-name' }),
        field('email', 'email', { type: 'email', required: true, autoComplete: 'email' }), field('phone', 'phone', { type: 'tel', required: true, autoComplete: 'tel' }),
        field('personal-number', 'personalNumber', { required: true, pattern: '[0-9]{13}', hint: 'fictionalCnp' }), field('document-number', 'identityDocumentDetails', { required: true }),
      ] },
      { key: 'correspondence', fields: [
        field('county', 'county', { type: 'select', required: true, options: counties.residence }),
        field('town', 'town', { required: true, autoComplete: 'address-level2' }), field('street-address', 'streetAndNumber', { required: true, autoComplete: 'street-address' }),
        field('building-details', 'buildingDetails'),
      ] },
      { key: 'fishingCounties', fields: [field('fishing-counties', 'fishingCounty', { type: 'checkboxes', required: true, hint: 'fishingCountyHint', options: counties.border })] },
      { key: 'fishingDocuments', fields: [
        field('signed-application', 'signedApplication', { ...upload, required: true }), field('identity-copy', 'identityCopy', { ...upload, required: true }), field('fishing-permit', 'fishingPermit', upload),
        field('declaration', 'fishingDeclaration', { type: 'checkbox', required: true, hint: 'signatureNote' }),
      ] },
    ],
  },
];
