import { field } from './fields';
import type { FormStudy } from './study-types';

export const healthAllowance: FormStudy = {
  id: 'health-allowance',
  title: 'healthAllowanceTitle',
  institution: 'Casa de Asigurări de Sănătate a Municipiului București',
  source: 'https://www.casmb.ro/atl_uploads_pf_concedii_recuperare.php',
  sourceType: 'web',
  capturedOn: '2026-11-12',
  image: { width: 1120, height: 800 },
  edition: 'healthAllowanceEdition',
  completionKey: 'completedText',
  validateFirstStep: true,
  steps: [
    {
      key: 'identity',
      fields: [
        field('full-name', 'applicantName', { required: true, autoComplete: 'name' }),
        field('personal-number', 'personalNumber', { required: true, pattern: '[0-9]{13}', hint: 'fictionalCnp' }),
        field('email', 'email', { type: 'email', required: true, autoComplete: 'email' }),
        field('phone', 'phone', { type: 'tel', autoComplete: 'tel' }),
      ],
    },
    {
      key: 'medicalLeaveDetails',
      fields: [
        field('contract-number', 'healthContractNumber', { required: true }),
        field('certificate-number', 'medicalCertificateNumber', { required: true }),
        field('certificate-date', 'medicalCertificateDate', { type: 'date', required: true }),
      ],
    },
    {
      key: 'projectDocuments',
      fields: [
        field('identity-copy', 'identityCopy', { type: 'file', required: true, hint: 'healthDemoFileHint' }),
        field('medical-certificate', 'medicalCertificate', { type: 'file', required: true, hint: 'healthDemoFileHint' }),
        field('contribution-proof', 'healthContributionProof', { type: 'file', required: true, hint: 'healthDemoFileHint' }),
      ],
    },
    {
      key: 'healthPayment',
      fields: [
        field('iban', 'personalIban', { required: true, hint: 'healthDemoIbanHint' }),
        field('notes', 'healthApplicationNotes', { type: 'textarea' }),
      ],
    },
  ],
};
