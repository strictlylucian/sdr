import { spacing, typography, themes, density, flagColours } from '../../packages/core/src/tokens.ts';

export function tokenStyles() {
  const vars = (prefix, values, unit = '') => Object.entries(values).map(([key, value]) => `--sdr-${prefix}${key}:${value}${unit};`).join('');
  let css = `:root,.sdr{${vars('space-', spacing, 'rem')}${vars('text-', typography, 'rem')}${vars('flag-', flagColours)}
    --sdr-font:"Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
    --sdr-mono:ui-monospace,"Cascadia Code",Consolas,monospace;
    --sdr-leading:1.6;--sdr-leading-heading:1.25;--sdr-radius:.125rem;--sdr-radius-lg:.25rem;
    --sdr-border-width:1px;--sdr-border-strong:2px;--sdr-focus-width:3px;--sdr-focus-offset:3px;
    --sdr-measure:68ch;--sdr-container:64rem;--sdr-page-gutter:var(--sdr-space-4);--sdr-control-height:3rem;
    --sdr-control-padding:var(--sdr-space-2);--sdr-duration:120ms;--sdr-shadow:0 8px 32px #00000020;
    --sdr-field-gap:var(--sdr-space-2);--sdr-group-gap:var(--sdr-space-4);
    --sdr-section-gap:var(--sdr-space-6);--sdr-layout-gap:var(--sdr-space-4);
    --sdr-navigation-gap:var(--sdr-space-4);--sdr-navigation-item-padding:var(--sdr-space-2);}`;
  for (const [name, values] of Object.entries(themes)) {
    css += `${name === 'light' ? ':root,.sdr,' : ''}[data-sdr-theme="${name}"]{${vars('', values)}color-scheme:${name === 'dark' ? 'dark' : 'light'};}`;
  }
  for (const [name, values] of Object.entries(density)) {
    css += `[data-sdr-density="${name}"]{--sdr-control-height:${values.control}rem;--sdr-control-padding:var(--sdr-space-${values['control-padding']});}`;
  }
  return css;
}

export function utilityStyles() {
  const rules = [];
  const sides = { '': '', top: '-block-start', bottom: '-block-end', left: '-inline-start', right: '-inline-end', block: '-block', inline: '-inline' };
  for (const property of ['margin', 'padding', 'gap', 'row-gap', 'column-gap']) {
    for (const [side, suffix] of Object.entries(property.includes('gap') ? { '': '' } : sides)) {
      for (const key of Object.keys(spacing)) {
        const name = `${property}${side ? `-${side}` : ''}-${key}`;
        rules.push(`.sdr-u-${name}{${property}${suffix}:var(--sdr-space-${key})!important}`);
        rules.push(`@media(min-width:48rem){.sdr-u-md-${name}{${property}${suffix}:var(--sdr-space-${key})!important}}`);
      }
    }
  }
  for (const [name, value] of Object.entries({ full: '100%', 'three-quarters': '75%', 'two-thirds': '66.666667%', 'one-half': '50%', 'one-third': '33.333333%', 'one-quarter': '25%', auto: 'auto' })) {
    rules.push(`.sdr-u-width-${name}{inline-size:${name === 'auto' ? 'auto' : '100%'}!important;max-inline-size:100%}`);
    rules.push(`@media(min-width:40rem){.sdr-u-width-${name}{inline-size:${value}!important}}`);
  }
  for (const name of Object.keys(typography)) rules.push(`.sdr-u-text-${name}{font-size:var(--sdr-text-${name})!important}`);
  for (const name of ['block', 'inline', 'inline-block', 'none', 'flex', 'grid']) rules.push(`.sdr-u-display-${name}{display:${name}!important}`);
  for (const name of ['start', 'end', 'center']) rules.push(`.sdr-u-text-${name}{text-align:${name}!important}`);
  for (const [name, value] of Object.entries({ regular: 400, medium: 500, bold: 700 })) rules.push(`.sdr-u-weight-${name}{font-weight:${value}!important}`);
  rules.push('.sdr-u-tabular{font-variant-numeric:tabular-nums}.sdr-u-measure{max-inline-size:var(--sdr-measure)}');
  rules.push('@media print{.sdr-u-hide-print{display:none!important}}');
  return rules.join('');
}
