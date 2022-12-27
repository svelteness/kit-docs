import { createKitDocsLoader } from '$lib/loaders';

export const prerender = true;

/** @type {import('./$types').LayoutLoad} */
export const load = createKitDocsLoader({
  sidebar: {
    '/': null,
    '/docs': '/docs',
  },
});
