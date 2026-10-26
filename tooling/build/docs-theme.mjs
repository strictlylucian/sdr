import { themes } from '../../packages/core/src/tokens.ts';

/** Starlight adapts the library palette; it does not maintain a second one. */
export function documentationThemeStyles() {
  return Object.entries({ light: themes.light, dark: themes.dark }).map(([name, theme]) => {
    const roles = {
      'color-white': theme.text,
      'color-black': theme.surface,
      'color-gray-1': theme.text,
      'color-gray-2': theme.muted,
      'color-gray-3': theme.border,
      'color-gray-4': theme.divider,
      'color-gray-5': theme.subtle,
      'color-gray-6': theme.canvas,
      'color-gray-7': theme.canvas,
      'color-text': theme.text,
      'color-text-accent': theme.link,
      'color-accent-low': theme['info-bg'],
      'color-accent': theme.action,
      'color-accent-high': theme.link,
      'color-bg': theme.surface,
      'color-bg-sidebar': theme.canvas,
      'color-bg-nav': theme.surface,
      'color-bg-inline-code': theme.subtle,
      'color-hairline': theme.divider,
      'color-hairline-light': theme.divider,
      'color-hairline-shade': theme.canvas,
      'color-orange-low': theme['warning-bg'],
      'color-orange': theme.warning,
      'color-orange-high': theme.warning,
      'color-green-low': theme['success-bg'],
      'color-green': theme.success,
      'color-green-high': theme.success,
      'color-blue-low': theme['info-bg'],
      'color-blue': theme.info,
      'color-blue-high': theme.info,
      'color-red-low': theme['danger-bg'],
      'color-red': theme.danger,
      'color-red-high': theme.danger,
    };
    // Starlight's light grey scale runs from dark (1) to light (6).
    // Its "white"/"black" names follow appearance, rather than literal colour.
    return ':root[data-theme="' + name + '"]{' +
      Object.entries(theme).map(([role, value]) => '--sdr-' + role + ':' + value + ';').join('') +
      Object.entries(roles).map(([role, value]) => '--sl-' + role + ':' + value + ';').join('') + '}';
  }).join('\n');
}
