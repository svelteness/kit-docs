import type { Load } from '@sveltejs/kit';

import type { MarkdownMeta } from '$lib/stores/kitDocs';

export function getRootDirFromUrl(url: URL) {
  return url.pathname.split('/')[1];
}

export function slugToRequestParam(slug: string) {
  return slug.replace(/\//g, '_');
}

/**
 * @param slug - A slug relative to the `src/routes` directory that will be resolved to a markdown
 * file, from which a meta object will be built (e.g., `docs/introduction`).
 * @param fetch - SvelteKit fetch function.
 */
export async function loadKitDocsMeta(
  slug: string,
  fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<MarkdownMeta> {
  return (await fetch(`/kit-docs/${slugToRequestParam(slug.replace(/^\//, ''))}.meta.json`)).json();
}

export function createKitDocsLoader(): Load {
  return async ({ url, fetch }): Promise<LoadKitDocsResult> => {
    return {
      props: {
        meta: await loadKitDocsMeta(url.pathname, fetch),
      },
    };
  };
}

export type LoadKitDocsResult = {
  props: {
    meta: MarkdownMeta;
  };
};
