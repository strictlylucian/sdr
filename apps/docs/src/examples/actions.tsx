import { docsUrl } from '../docs-url';
import { componentText, countText } from './support';
import { useState } from 'react';
import * as R from '../../../../packages/react/src';
import { tr, type P } from './support';
export function ButtonExample({ locale }: P) { const [saved, setSaved] = useState(false); return <R.Cluster><R.Button onClick={() => setSaved(true)}>{tr(locale, "actions.saveApplication")}</R.Button><R.Button variant="secondary" onClick={() => setSaved(false)}>{tr(locale, "actions.reset")}</R.Button><R.Button variant="tertiary">{tr(locale, "actions.reviewApplication")}</R.Button><R.Button variant="danger">{tr(locale, "actions.deleteDraft")}</R.Button><R.Button variant="danger-secondary">{tr(locale, "actions.removeAttachment")}</R.Button><span role="status">{saved && tr(locale, "actions.applicationSavedInThisDemonstration")}</span></R.Cluster>; }
export function LinkExample({ locale }: P) { return <R.Link href={docsUrl(`/${locale}/getting-started/`)}>{tr(locale, "actions.readTheInstallationGuide")}</R.Link>; }
export function ButtonLinkExample({ locale }: P) { return <R.ButtonLink href={docsUrl(`/${locale}/getting-started/`)}>{tr(locale, "actions.startIntegrating")}</R.ButtonLink>; }
export function ToggleButtonExample({ locale }: P) { return <R.ToggleButton>{tr(locale, "actions.pinToList")}</R.ToggleButton>; }
export function ActionChipExample({ locale }: P) { const [count, setCount] = useState(0); return <R.Cluster><R.ActionChip onClick={() => setCount(count + 1)}>{tr(locale, "actions.addAFilter")}</R.ActionChip><span role="status">{count}</span></R.Cluster>; }
export function DismissibleChipExample({ locale }: P) { const [visible, setVisible] = useState(true); return <R.Cluster><R.Button id="restore-filter" variant="secondary" onClick={() => setVisible(true)}>{tr(locale, "actions.restoreFilter")}</R.Button>{visible && <R.DismissibleChip removeLabel={tr(locale, "actions.removeBraOvFilter")} onRemove={() => { setVisible(false); document.getElementById('restore-filter')?.focus(); }}>Brașov</R.DismissibleChip>}</R.Cluster>; }
export function BackLinkExample({ locale }: P) { return <R.BackLink href={docsUrl(`/${locale}/components/`)} children={componentText(locale, 'back')} />; }
export function BackToTopExample({ locale }: P) { return <R.BackToTop href="#_top">{tr(locale, "actions.backToTop")}</R.BackToTop>; }
export function SkipLinkExample({ locale }: P) { return <R.Stack><R.SkipLink href="#skip-example-target" children={componentText(locale, 'skip')} /><p>{tr(locale, "actions.useTabToRevealTheSkipLink")}</p><div id="skip-example-target" tabIndex={-1}>{tr(locale, "actions.mainExampleContent")}</div></R.Stack>; }
export function ExitThisPageExample({ locale }: P) { return <R.ExitThisPage href="https://www.wikipedia.org/">{tr(locale, "actions.exitThisPageQuickly")}</R.ExitThisPage>; }
