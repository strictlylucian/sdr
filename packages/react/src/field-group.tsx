import type { ReactNode } from 'react';
import { cx } from './shared';

/** Keep the error rail outside the native fieldset/legend border geometry. */
export function FieldGroup({ error, children }: { error?: ReactNode; children: ReactNode }) {
  return <div className={cx('sdr-field-group', !!error && 'sdr-field--error')}>{children}</div>;
}
