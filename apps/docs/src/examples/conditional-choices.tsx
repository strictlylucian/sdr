import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';

export function ConditionalRadioExample({ locale }: P) {
  return <R.Fieldset legend={tr(locale, 'conditional.contact')} hint={tr(locale, 'conditional.chooseOne')}>
    <R.Radio id="contact-email" name="contact-method" value="email" label={tr(locale, 'conditional.email')} defaultChecked>
      <R.TextInput id="contact-email-address" name="email-address" type="email" autoComplete="email" label={tr(locale, 'conditional.emailAddress')} error={tr(locale, 'conditional.emailError')} />
    </R.Radio>
    <R.Radio id="contact-phone" name="contact-method" value="phone" label={tr(locale, 'conditional.phone')}>
      <R.TextInput id="contact-phone-number" name="phone-number" type="tel" autoComplete="tel" label={tr(locale, 'conditional.phoneNumber')} />
    </R.Radio>
    <R.Radio id="contact-post" name="contact-method" value="post" label={tr(locale, 'conditional.post')} />
  </R.Fieldset>;
}

export function ConditionalCheckboxExample({ locale }: P) {
  return <R.Fieldset legend={tr(locale, 'conditional.contact')} hint={tr(locale, 'conditional.chooseMany')}>
    <R.Checkbox id="updates-email" name="contact-methods" value="email" label={tr(locale, 'conditional.email')} defaultChecked>
      <R.TextInput id="updates-email-address" name="email-address" type="email" autoComplete="email" label={tr(locale, 'conditional.emailAddress')} error={tr(locale, 'conditional.emailError')} />
    </R.Checkbox>
    <R.Checkbox id="updates-phone" name="contact-methods" value="phone" label={tr(locale, 'conditional.phone')}>
      <R.TextInput id="updates-phone-number" name="phone-number" type="tel" autoComplete="tel" label={tr(locale, 'conditional.phoneNumber')} />
    </R.Checkbox>
  </R.Fieldset>;
}
