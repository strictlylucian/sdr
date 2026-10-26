import { expect, it } from 'vitest';
import { themes } from '../../packages/core/src/tokens';
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * r + .7152 * g + .0722 * b;
}
function ratio(a: string, b: string) { const values = [luminance(a), luminance(b)].sort((x, y) => y - x); return (values[0] + .05) / (values[1] + .05); }
it('uses the shared semantic red for light errors and retains readable error text across every themed surface', () => {
  expect(themes.light.danger).toBe('#ca3535');
  expect(themes.heritage.danger).toBe('#ca3535');
  for (const theme of Object.values(themes)) {
    for (const surface of [theme.surface, theme.canvas, theme.subtle, theme['danger-bg']]) {
      expect(ratio(theme.danger, surface), `${theme.danger} on ${surface}`).toBeGreaterThanOrEqual(4.5);
    }
  }
});
for (const [name, theme] of Object.entries(themes)) {
  it(`${name}: all supported text and action pairs meet AA normal-text contrast`, () => {
    const pairs: [string, string][] = [[theme.text, theme.surface], [theme.text, theme.canvas], [theme.muted, theme.surface], [theme.muted, theme.subtle], [theme.link, theme.surface], [theme.action, theme['on-action']], [theme['action-hover'], theme['on-action']], [theme.danger, theme['danger-bg']], [theme.warning, theme['warning-bg']], [theme.success, theme['success-bg']], [theme.info, theme['info-bg']], [theme.accent, theme['on-accent']], [theme['on-masthead'], theme.masthead]];
    pairs.push([theme['on-pressed'], theme['pressed-bg']]);
    pairs.push([theme['on-button'], theme['button-bg']], [theme['on-button'], theme['button-hover']]);
    pairs.push([theme['on-button-danger'], theme['button-danger-bg']], [theme['on-button-danger'], theme['button-danger-hover']], [theme.danger, theme.surface]);
    for (const [foreground, background] of pairs) expect(ratio(foreground, background), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
  });
  it(`${name}: control borders and focus contrast meet 3:1 on supported surfaces`, () => {
    for (const surface of [theme.surface, theme.subtle, theme.canvas]) expect(ratio(theme.border, surface)).toBeGreaterThanOrEqual(3);
    for (const surface of [theme.surface, theme.subtle, theme.canvas]) expect(ratio(theme['button-border'], surface)).toBeGreaterThanOrEqual(3);
    for (const surface of [theme.surface, theme.subtle, theme.canvas]) {
      expect(ratio(theme['button-danger-border'], surface)).toBeGreaterThanOrEqual(3);
      expect(ratio(theme.danger, surface)).toBeGreaterThanOrEqual(3);
    }
    expect(ratio(theme.focus, theme['focus-gap'])).toBeGreaterThanOrEqual(3);
    expect(ratio(theme['masthead-focus'], theme.masthead)).toBeGreaterThanOrEqual(3);
    expect(ratio(theme['masthead-border'], theme.masthead)).toBeGreaterThanOrEqual(3);
    expect(ratio(theme['pressed-border'], theme['pressed-bg'])).toBeGreaterThanOrEqual(3);
    for (const surface of [theme.surface, theme.subtle, theme.canvas]) {
      expect(Math.max(ratio(theme.focus, surface), ratio(theme['focus-gap'], surface))).toBeGreaterThanOrEqual(3);
    }
  });
}
