import type { FormStudy } from './study-types';
import { field } from './fields';
import recipients from './igi-recipients.json' with { type: 'json' };
export const onlineStudies: FormStudy[] = [
  {
    id: 'online-igi', sourceType: 'web', capturedOn: '2026-10-26', image: { width: 1110, height: 1084 },
    title: 'onlineIgiTitle', institution: 'Inspectoratul General pentru Imigrări',
    source: 'https://igi.mai.gov.ro/formular-petitii/', edition: 'onlineIgiEdition', completionKey: 'completedText',
    steps: [
      { key: 'identity', fields: [
        field('surname', 'surname', { required: true, autoComplete: 'family-name' }),
        field('given-name', 'givenName', { required: true, autoComplete: 'given-name' }),
        field('applicant-type', 'applicantType', { required: true, fixedValueKey: 'individual' }),
        field('citizenship', 'citizenship', { required: true }),
        field('birth-date', 'birthDate', { required: true, type: 'date' }),
      ] },
      { key: 'correspondence', fields: [
        field('correspondence-address', 'fullAddress', { required: true, autoComplete: 'street-address' }),
        field('county', 'county', { required: true, autoComplete: 'address-level1' }),
        field('email', 'email', { type: 'email', autoComplete: 'email' }),
        field('phone', 'phone', { type: 'tel', autoComplete: 'tel' }),
      ] },
      { key: 'petition', fields: [
        field('recipient-office', 'recipientOffice', { type: 'select', required: true, options: recipients }),
        field('petition-text', 'petitionText', { type: 'textarea', required: true }),
        field('attachment', 'attachment', { type: 'file', accept: '.pdf,.doc,.docx,.jpeg,.jpg,.png', maxBytes: 1000000, hint: 'attachmentHint' }),
      ] },
    ],
  },
  {
    id: 'online-payment', sourceType: 'web', capturedOn: '2026-10-27', image: { width: 909, height: 1053 },
    title: 'onlinePaymentTitle', institution: 'Direcția Generală Permise de Conducere și Înmatriculări',
    source: 'https://dgpci.mai.gov.ro/drpciv-payment/form/12', edition: 'onlinePaymentEdition', completionKey: 'paymentCompletedText',
    pricing: { unitAmount: 25, currency: 'RON', countField: 'quantity' },
    steps: [
      { key: 'paymentRecipient', fields: [
        field('beneficiary-name', 'beneficiaryName', { required: true, autoComplete: 'name' }),
        field('applicant-type', 'applicantType', { required: true, fixedValueKey: 'individual' }),
        field('recipient-number', 'recipientNumber', { required: true, pattern: '[0-9]{13}', hint: 'fictionalCnp' }),
        field('payer-number', 'payerNumber', { required: true, pattern: '[0-9]{13}', hint: 'fictionalCnp' }),
      ] },
      { key: 'contactDetails', fields: [
        field('email', 'email', { type: 'email', required: true, autoComplete: 'email' }),
        field('confirm-email', 'confirmEmail', { type: 'email', required: true, matches: 'email' }),
      ] },
      { key: 'paymentQuantity', fields: [
        field('quantity', 'quantity', { type: 'number', required: true, min: '1', step: '1', defaultValue: '1', hint: 'quantityHint' }),
      ] },
    ],
  },
];
