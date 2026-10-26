import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { destroy } from '../../packages/core/src/portable';
import { mockViewport } from './media';

beforeEach(() => { mockViewport(); });
afterEach(() => {
  cleanup();
  destroy(document);
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});
