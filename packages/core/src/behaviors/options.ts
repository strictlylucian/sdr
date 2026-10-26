export interface EnhancementOptions {
  /** Application-owned copy, including sign, plurals and number formatting. */
  formatCount?: (remaining: number, root: HTMLElement) => string;
  /** Application-owned text collation. Numeric columns use numeric comparison. */
  compareText?: (left: string, right: string) => number;
}
