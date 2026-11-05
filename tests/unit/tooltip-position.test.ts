import { expect, it, vi } from 'vitest';
import { lifecycle } from '../../packages/core/src/behaviors/lifecycle';
import { tooltipPosition } from '../../packages/core/src/behaviors/tooltip-position';

it('fits tooltip text at viewport edges, repositions on scrolling and restores host markup', () => {
  const root = document.createElement('span');
  const content = document.createElement('span');
  content.style.color = 'red'; root.append(content); document.body.append(root);
  const original = content.getAttribute('style');
  let bounds = { top: 40, left: 30, right: 200 };
  vi.spyOn(content, 'getBoundingClientRect').mockImplementation(() => bounds as DOMRect);
  const life = lifecycle(), position = tooltipPosition(root, content, life);
  position();
  expect(content.style.getPropertyValue('--sdr-tooltip-offset')).toBe('0px');
  expect(root).not.toHaveAttribute('data-sdr-tooltip-side');
  bounds = { top: -20, left: -10, right: 180 };
  document.dispatchEvent(new Event('scroll'));
  expect(root).toHaveAttribute('data-sdr-tooltip-side', 'bottom');
  expect(content.style.getPropertyValue('--sdr-tooltip-offset')).toBe('10px');
  bounds = { top: 40, left: innerWidth - 100, right: innerWidth + 40 };
  window.dispatchEvent(new Event('resize'));
  expect(content.style.getPropertyValue('--sdr-tooltip-offset')).toBe('-40px');
  content.hidden = true;
  bounds = { top: -20, left: -10, right: 180 }; position();
  expect(content.style.getPropertyValue('--sdr-tooltip-offset')).toBe('-40px');
  life.destroy();
  expect(content.getAttribute('style')).toBe(original);
  expect(root).not.toHaveAttribute('data-sdr-tooltip-side');
  document.dispatchEvent(new Event('scroll')); window.dispatchEvent(new Event('resize'));
  expect(content.getAttribute('style')).toBe(original);
  root.remove();
});

it('removes generated position styles when there were no host styles', () => {
  const root = document.createElement('span'), content = document.createElement('span');
  root.append(content); const life = lifecycle();
  tooltipPosition(root, content, life)(); life.destroy();
  expect(content).not.toHaveAttribute('style');
});
