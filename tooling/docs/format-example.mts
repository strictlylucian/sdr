import { format } from 'prettier';

/** Format displayed examples at generation time; runtime bundles stay minified. */
type Language = 'html' | 'tsx' | 'js' | 'css' | 'json';
const parsers = { html: 'html', tsx: 'typescript', js: 'babel', css: 'css', json: 'json' } as const;
export async function formatExample(source: string, language: Language) {
  return (await format(source, {
    parser: parsers[language],
    filepath: `example.${language}`,
    tabWidth: 2,
    useTabs: false,
    printWidth: 80,
    singleQuote: true,
    singleAttributePerLine: true,
    htmlWhitespaceSensitivity: 'css',
    endOfLine: 'lf',
  })).trimEnd();
}

export async function formatGuide(markdown: string) {
  let formatted = '';
  let offset = 0;
  for (const match of markdown.matchAll(/^~~~(html|tsx|js|css|json)\r?\n([\s\S]*?)^~~~[ \t]*$/gm)) {
    formatted += markdown.slice(offset, match.index) + `~~~${match[1]}\n${await formatExample(match[2], match[1] as Language)}\n~~~`;
    offset = match.index + match[0].length;
  }
  return formatted + markdown.slice(offset);
}
