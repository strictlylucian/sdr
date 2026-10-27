import type { FormStudy } from './study-types';
import { field } from './fields';
const upload = { type: 'file' as const, accept: '.pdf,.jpg,.jpeg,.png', maxBytes: 5000000, hint: 'supportingUploadHint' as const };
const representative = { field: 'capacity', value: 'representative' };
const delegated = { field: 'delegated', value: true };
export const additionalPaperStudies: FormStudy[] = [
  {
    id: 'lighting-clearance', sourceType: 'paper', capturedOn: '2026-10-27', image: { width: 990, height: 1400 },
    title: 'lightingTitle', institution: 'Compania Municipală Iluminat Public București',
    source: 'https://cmipb.ro/files/15/2026/Avize%20edilitare/FPO%2002%20Cerere_aviz_bransament_pers_fizice.pdf', edition: 'lightingEdition', completionKey: 'completedText',
    steps: [
      { key: 'identity', fields: [
        field('full-name', 'applicantName', { required: true, autoComplete: 'name' }), field('phone', 'phone', { type: 'tel', autoComplete: 'tel' }),
        field('email', 'email', { type: 'email', autoComplete: 'email' }), field('address', 'applicantAddress', { type: 'textarea', required: true, autoComplete: 'street-address' }),
      ] },
      { key: 'projectDetails', fields: [
        field('capacity', 'applicantCapacity', { required: true, type: 'radios', options: [{ value: 'beneficiary', labelKey: 'beneficiaryRole' }, { value: 'representative', labelKey: 'representativeRole' }] }),
        field('representative-name', 'representativeName', { required: true, showWhen: representative }),
        field('project-description', 'projectDescription', { type: 'textarea', required: true }),
      ] },
      { key: 'projectDocuments', fields: [
        field('identity-copy', 'identityCopy', { ...upload, required: true }), field('urban-certificate', 'urbanCertificate', { ...upload, required: true }),
        field('area-plan', 'areaPlan', { ...upload, required: true }), field('site-plan', 'sitePlan', { ...upload, required: true }),
        field('technical-memo', 'technicalMemo', { ...upload, required: true }), field('network-solution', 'networkSolution', { ...upload, required: true }),
        field('authorisation', 'authorisation', { ...upload, required: true, showWhen: representative }), field('representative-id', 'representativeId', { ...upload, required: true, showWhen: representative }),
        field('declaration', 'privacyAcknowledgement', { type: 'checkbox', required: true, hint: 'signatureNote' }),
      ] },
    ],
  },
  {
    id: 'street-crossing', sourceType: 'paper', sourcePreview: 'publication', capturedOn: '2026-10-27', image: { width: 781, height: 850 },
    title: 'crossingTitle', institution: 'Administrația Străzilor, Construcții Edilitare Alexandria',
    source: 'https://ascealexandria.ro/wp-content/uploads/2022/10/CERERE-AVIZ-PERSOANA-JURIDICA.docx', edition: 'crossingEdition', completionKey: 'completedText',
    steps: [
      { key: 'companyDetails', fields: [
        field('company-name', 'companyName', { required: true, autoComplete: 'organization' }), field('company-address', 'companyAddress', { required: true, type: 'textarea' }),
        field('county', 'companyCounty', { required: true }), field('trade-register', 'tradeRegister', { required: true }),
        field('company-number', 'companyNumber', { required: true, pattern: '[0-9]+', hint: 'taxNumberHint' }), field('representative-name', 'representativeName', { required: true }),
      ] },
      { key: 'projectDetails', fields: [
        field('urban-number', 'urbanNumber', { required: true }), field('urban-date', 'urbanDate', { type: 'date', required: true }), field('urban-issuer', 'urbanIssuer', { required: true }),
        field('description', 'projectDescription', { type: 'textarea', required: true }), field('works-street', 'worksStreet', { required: true }), field('works-number', 'worksNumber', { required: true }),
        field('project-number', 'projectNumber', { required: true }), field('project-date', 'projectDate', { required: true, type: 'date' }),
        field('designer-name', 'designerName', { required: true }), field('designer-address', 'designerAddress', { required: true, type: 'textarea' }),
      ] },
      { key: 'projectDocuments', fields: [
        field('technical-memo', 'technicalMemo', { ...upload, required: true }), field('area-plan', 'areaPlan', { ...upload, required: true }), field('site-plan', 'sitePlan', { ...upload, required: true }),
        field('urban-certificate', 'urbanCertificate', { ...upload, required: true }), field('ownership-proof', 'ownershipProof', { ...upload, required: true }), field('registration-copy', 'registrationCopy', { ...upload, required: true }),
        field('delegated', 'delegated', { type: 'checkbox' }), field('authorisation', 'authorisation', { ...upload, required: true, showWhen: delegated }), field('delegate-id', 'representativeId', { ...upload, required: true, showWhen: delegated }),
      ] },
      { key: 'declaration', fields: [field('signatory-name', 'signatoryName', { required: true }), field('declaration-date', 'declarationDate', { required: true, type: 'date' })] },
    ],
  },
];
