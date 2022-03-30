import {exposeInMainWorld} from './exposeInMainWorld';

// Export for types in env.d.ts
export const versions = process.versions;

exposeInMainWorld('versions', versions);
