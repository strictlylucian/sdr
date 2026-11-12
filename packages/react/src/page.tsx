import type { HTMLAttributes, ReactNode } from 'react';
import { SkipLink } from './actions';
import { Container } from './layout';
import { Footer } from './navigation';
import { cx } from './shared';

export interface PageProps extends HTMLAttributes<HTMLDivElement> {
  mainId: string;
  skipLabel: string;
  header: ReactNode;
  navigation?: ReactNode;
  beforeContent?: ReactNode;
  footer?: ReactNode;
  /** Embedded examples use a section rather than nesting a main landmark. */
  embedded?: boolean;
  mainLabelledBy?: string;
}

/** Full-width service chrome with one shared, responsive content container. */
export function Page({ mainId, skipLabel, header, navigation, beforeContent, footer, embedded = false, mainLabelledBy, className, children, ...props }: PageProps) {
  const Content = embedded ? 'section' : 'main';
  return <div {...props} className={cx('sdr-page', className)}>
    <SkipLink href={`#${mainId}`}>{skipLabel}</SkipLink>
    {header}
    {navigation}
    <Container>
      {beforeContent && <div className="sdr-u-padding-top-4">{beforeContent}</div>}
      <Content id={mainId} tabIndex={-1} aria-labelledby={mainLabelledBy} className="sdr-main-wrapper sdr-stack">{children}</Content>
    </Container>
    {footer && <Footer className="sdr-u-padding-inline-0"><Container>{footer}</Container></Footer>}
  </div>;
}
