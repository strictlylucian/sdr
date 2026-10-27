/** Every space, theme and utility is generated from this contract. Values use rem. */
export const spacing = { 0: 0, 1: .25, 2: .5, 3: .75, 4: 1, 5: 1.5, 6: 2, 7: 3, 8: 4, 9: 6 } as const;
export type Space = keyof typeof spacing;
/** Large-screen scale; the CSS contract switches at 40rem without shrinking body copy. */
export const typography = { xs: .875, sm: 1, md: 1.1875, lg: 1.25, xl: 1.5, '2xl': 2.25, '3xl': 3, '4xl': 4 } as const;
export const typographySmall = { ...typography, lg: 1.1875, xl: 1.3125, '2xl': 1.6875, '3xl': 2, '4xl': 3 } as const;
/** Space-token pairs are [small screen, large screen]; top space applies after content. */
export const headingSpacing = {
  xl: { before: [7, 8], after: [6, 7] },
  lg: { before: [7, 8], after: [5, 6] },
  md: { before: [6, 7], after: [4, 5] },
  sm: { before: [5, 6], after: [4, 5] },
} as const;
export type TextSize = keyof typeof typography;
/** Law 176/2023, annex: RGB 0-43-127, 252-209-22, 206-17-38. */
export const flagColours = { blue: '#002b7f', yellow: '#fcd116', red: '#ce1126' } as const;
const errorColours = { base: '#ca3535', onDark: '#d76868', strong: '#982828', stronger: '#651b1b', subtle: '#fcf5f5' } as const;
const civic = {
  'motif-ground': '#ffffff', 'motif-primary': flagColours.red, 'motif-secondary': flagColours.blue,
  masthead: flagColours.blue, 'on-masthead': '#ffffff', 'masthead-border': '#7d91ac',
  'masthead-focus': flagColours.yellow, 'masthead-accent': flagColours.red,
  'pressed-bg': flagColours.yellow, 'on-pressed': '#131f33', 'pressed-border': '#131f33',
  'button-bg': flagColours.blue, 'button-hover': '#001f5c', 'on-button': '#ffffff', 'button-border': flagColours.blue,
  'button-danger-bg': errorColours.base, 'button-danger-hover': errorColours.strong, 'on-button-danger': '#ffffff', 'button-danger-border': errorColours.base,
} as const;
export const themes = {
  light: {
    ...civic,
    canvas: '#f7f8fa', surface: '#ffffff', subtle: '#edf0f5', text: '#182439', muted: '#49566b',
    border: '#6b778b', divider: '#d7dce5', action: flagColours.blue, 'action-hover': '#001f5c', 'on-action': '#ffffff',
    link: flagColours.blue, focus: flagColours.yellow, 'focus-gap': '#131f33', danger: errorColours.base, 'danger-bg': errorColours.subtle,
    success: '#17613d', 'success-bg': '#eaf6ef', warning: '#754700', 'warning-bg': '#fff5d9',
    info: flagColours.blue, 'info-bg': '#edf3ff', accent: flagColours.red, 'on-accent': '#ffffff',
  },
  dark: {
    ...civic, 'motif-ground': '#080c12', 'motif-secondary': '#edf1f7', 'button-border': '#75849a', 'button-danger-border': errorColours.onDark,
    canvas: '#080c12', surface: '#0e141e', subtle: '#192332', text: '#edf1f7', muted: '#b3bdcc',
    border: '#75849a', divider: '#2b384b', action: '#a8c7fa', 'action-hover': '#c8dcff', 'on-action': '#0a1728',
    link: '#a8c7fa', focus: flagColours.yellow, 'focus-gap': '#131f33', danger: errorColours.onDark, 'danger-bg': '#291515',
    success: '#9be1b9', 'success-bg': '#10291e', warning: '#ffdc88', 'warning-bg': '#2b2312',
    info: '#a8c7fa', 'info-bg': '#14243b', accent: '#ffa9b9', 'on-accent': '#29121c',
  },
  heritage: {
    ...civic,
    canvas: '#faf7ef', surface: '#fffdf7', subtle: '#f5f0e6', text: '#29251f', muted: '#625548',
    border: '#877461', divider: '#ded4c2', action: '#254e80', 'action-hover': '#193a63', 'on-action': '#ffffff',
    link: '#254e80', focus: flagColours.yellow, 'focus-gap': '#131f33', danger: errorColours.base, 'danger-bg': errorColours.subtle,
    success: '#245d3d', 'success-bg': '#eaf3e8', warning: '#754900', 'warning-bg': '#fff1ce',
    info: '#254e80', 'info-bg': '#edf1f9', accent: '#972d3b', 'on-accent': '#ffffff',
  },
  contrast: {
    ...civic, 'masthead-border': '#ffffff', 'button-danger-bg': errorColours.strong, 'button-danger-hover': errorColours.stronger, 'button-danger-border': errorColours.strong,
    canvas: '#ffffff', surface: '#ffffff', subtle: '#eeeeee', text: '#000000', muted: '#292929',
    border: '#000000', divider: '#000000', action: '#002a80', 'action-hover': '#001a50', 'on-action': '#ffffff',
    link: '#002a80', focus: flagColours.yellow, 'focus-gap': '#131f33', danger: errorColours.strong, 'danger-bg': '#ffffff',
    success: '#004522', 'success-bg': '#ffffff', warning: '#533200', 'warning-bg': '#ffffff',
    info: '#002a80', 'info-bg': '#ffffff', accent: '#850018', 'on-accent': '#ffffff',
  },
} as const;
export type Theme = keyof typeof themes;
export const density = {
  comfortable: { control: 3, 'control-padding': 2, 'form-group-gap': 5, 'form-group-gap-large': 6 },
  compact: { control: 2.75, 'control-padding': 1, 'form-group-gap': 4, 'form-group-gap-large': 5 },
} as const;
