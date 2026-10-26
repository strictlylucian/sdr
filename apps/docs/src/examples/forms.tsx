import { docsUrl } from '../docs-url';
import { componentText, countText } from './support';
import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';
export function TextInputExample({ locale }: P) { return <R.TextInput label={tr(locale, "forms.fullName")} name="full-name" autoComplete="name" hint={tr(locale, "forms.enterYourNameAsItAppearsOnYourIdentity")} />; }
export function TextareaExample({ locale }: P) { return <R.Textarea id="message" label={tr(locale, "forms.howCanWeHelp")} name="message" rows={4} />; }
export function SelectExample({ locale }: P) { return <R.Select label={tr(locale, "forms.county")} name="county"><option value="">{tr(locale, "forms.chooseACounty")}</option><option value="CJ">Cluj</option><option value="BV">Brașov</option><option value="IS">Iași</option></R.Select>; }
export function CheckboxExample({ locale }: P) { return <R.Fieldset legend={tr(locale, "forms.howWouldYouLikeUsToContactYou")}><R.Checkbox name="contact" value="email" label="Email" /><R.Checkbox name="contact" value="post" label={tr(locale, "forms.byPost")} /></R.Fieldset>; }
export function RadioExample({ locale }: P) { return <R.Fieldset legend={tr(locale, "forms.whereDoYouLive")}><R.Radio name="residence" value="ro" label={tr(locale, "forms.inRomania")} /><R.Radio name="residence" value="abroad" label={tr(locale, "forms.inAnotherCountry")} /></R.Fieldset>; }
export function SwitchExample({ locale }: P) { return <R.Switch name="notifications" label={tr(locale, "forms.receiveEmailNotifications")} hint={tr(locale, "forms.weWillTellYouWhenYourApplicationStatusChanges")} />; }
export function FieldsetExample({ locale }: P) { return <R.Fieldset legend={tr(locale, "forms.contactDetails")}><R.TextInput label="Email" type="email" name="email" autoComplete="email" /><R.TextInput label={tr(locale, "forms.phoneNumber")} type="tel" name="phone" autoComplete="tel" /></R.Fieldset>; }
export function DateInputExample({ locale }: P) { return <R.DateInput legend={tr(locale, "forms.dateOfBirth")} name="birth" hint={tr(locale, "forms.forExample2731990")} labels={{ day: componentText(locale, 'day'), month: componentText(locale, 'month'), year: componentText(locale, 'year') }} />; }
export function DatePickerExample({ locale }: P) { return <R.DatePicker label={tr(locale, "forms.appointmentDate")} name="appointment" min="2026-10-25" />; }
export function TimeInputExample({ locale }: P) { return <R.TimeInput label={tr(locale, "forms.appointmentTime")} name="time" />; }
export function FileUploadExample({ locale }: P) { return <R.FileUpload label={tr(locale, "forms.uploadTheDocument")} name="document" accept=".pdf,.jpg,.png" hint={tr(locale, "forms.pdfJPGOrPNGMaximum10MBTheService")} />; }
export function PasswordInputExample({ locale }: P) { return <R.PasswordInput label={tr(locale, "forms.password")} name="password" autoComplete="new-password" hint={tr(locale, "forms.youCanUseAPasswordManager")} showLabel={componentText(locale, 'show')} hideLabel={componentText(locale, 'hide')} />; }
export function CharacterCountExample({ locale }: P) { return <R.CharacterCount id="description" label={tr(locale, "forms.describeTheSituation")} name="description" limit={200} formatCount={remaining => countText(locale, remaining)} />; }
export function RangeInputExample({ locale }: P) { return <R.RangeInput label={tr(locale, "forms.searchRadiusInKilometres")} name="radius" min={1} max={50} defaultValue={10} />; }
export function SearchBarExample({ locale }: P) { return <R.SearchBar label={tr(locale, "forms.searchServices")} action={docsUrl(`/${locale}/components/`)} buttonLabel={componentText(locale, 'search')} />; }
export function SegmentedControlExample({ locale }: P) { return <R.SegmentedControl legend={tr(locale, "forms.view")} name="view" defaultValue="list" options={[{ value: 'list', label: tr(locale, "forms.list") }, { value: 'grid', label: tr(locale, "forms.grid") }]} />; }
