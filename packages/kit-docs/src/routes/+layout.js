export const prerender = true;
import { createKitDocsLoader } from '$lib/loaders';
/** @type {import('./$types').LayoutLoad} */
export const load = createKitDocsLoader({
  sidebar: {
    '/': null,
    '/docs': '/docs',
  },
});
