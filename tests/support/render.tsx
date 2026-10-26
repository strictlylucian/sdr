import { render, type RenderOptions } from '@testing-library/react';
import type { ReactNode } from 'react';
import { SdrProvider } from '../../packages/react/src';

export function renderSdr(ui: ReactNode, locale: string = 'en', options?: RenderOptions) {
  return render(ui, { wrapper: ({ children }) => <SdrProvider lang={locale}>{children}</SdrProvider>, ...options });
}
