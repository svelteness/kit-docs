export const prerender = true;
import { createKitDocsLoader } from '$lib/loaders';

export const load = createKitDocsLoader({
  sidebar: {
    '/': null,
    '/docs': '/docs',
  },
});
