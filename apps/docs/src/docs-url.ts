/** Shared by the documentation renderer, interactive examples and HTML generator. */
export function withDocsBase(path: string, base: string) {
  if (!/^\/(?:[\w-]+\/)*$/.test(base)) throw new Error('Invalid documentation base path');
  if (!path.startsWith('/') || path.startsWith('//') || base === '/' || path === base.slice(0, -1) || path.startsWith(base)) return path;
  return base.slice(0, -1) + path;
}

export function docsUrl(path: string) {
  return withDocsBase(path, process.env.SDR_DOCS_BASE ?? '/');
}
