export type LocalisedText = Record<'ro' | 'en', string>;
export interface ComponentDefinition {
  name: string; slug: string; family: string;
  title: LocalisedText; description: LocalisedText; caution: LocalisedText;
}
export interface ComponentVariant {
  name: string; parent: string; apiName?: string; anchor: LocalisedText; title: LocalisedText; guidance: LocalisedText;
}
export interface PatternDefinition {
  slug: string; example: string; title: LocalisedText; guidance: LocalisedText;
}
export interface PatternGroup {
  slug: string; primary: string; variants: string[]; title: LocalisedText;
}
