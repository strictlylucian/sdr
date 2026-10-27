import { copyFile } from 'node:fs/promises';

// Keep the standalone study download identical to the shared inline symbol source.
await copyFile('apps/docs/src/identity/romanian-eagle.svg', 'apps/docs/public/studies/romanian-eagle.svg');
