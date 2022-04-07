import type { Load } from '@sveltejs/kit';

import type { SidebarConfig } from '$lib/components/layout/contexts';
import type { MarkdownMeta } from '$lib/stores/kitDocs';

export function getRootDirFromUrl(url: URL) {
  return url.pathname.split('/')[1];
}

export function slugToRequestParam(slug: string) {
  return slug.replace(/\//g, '_');
}

/**
 * @param dir - A slug relative to the `src` directory that will be mapped to a markdown
 * file, from which a meta object will be built (e.g., `docs/introduction`).
 * @param fetch - SvelteKit fetch function.
 */
export async function loadKitDocsMeta(
  slug: string,
  fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<MarkdownMeta> {
  return (await fetch(`/kit-docs/${slugToRequestParam(slug.replace(/^\//, ''))}.meta.json`)).json();
}

/**
 * @param dir - A directory path relative to the `src` directory from which all markdown files
 * will be used to build a sidebar config (e.g., `docs`).
 * @param fetch - SvelteKit fetch function.
 */
export async function loadKitDocsSidebar(
  dir: string,
  fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<SidebarConfig> {
  return (await fetch(`/kit-docs/${dir.replace(/^\//, '')}.sidebar.json`)).json();
}

/**
 * @param dir - A directory path relative to the `src` directory from which markdown files will be
 * loaded (e.g., `docs`). The given directory will be treated as the root for all requests.
 */
export function createKitDocsLoader(dir: string): Load {
  const normalizedDir = dir.replace(/^\//, '');

  return async ({ params, fetch }): Promise<LoadKitDocsResult> => {
    return {
      props: {
        meta: await loadKitDocsMeta(`${normalizedDir}/${params.slug}`, fetch),
        sidebar: await loadKitDocsSidebar(normalizedDir, fetch),
      },
    };
  };
}

export type LoadKitDocsResult = {
  props: {
    meta: MarkdownMeta;
    sidebar: SidebarConfig;
  };
};
