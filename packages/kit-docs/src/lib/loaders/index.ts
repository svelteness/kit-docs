import type { Load } from '@sveltejs/kit';

import type { NormalizedSidebarConfig } from '$lib/components/layout/contexts';
import type { MarkdownMeta } from '$lib/stores/kitDocs';

export function getRootDirFromUrl(url: URL) {
  return url.pathname.split('/')[1];
}

export function slugToRequestParam(slug: string) {
  return slug.replace(/\//g, '_');
}

/**
 * @param slug - A slug that will be resolved to a markdown file from which a meta object will be
 * built (e.g., `docs/introduction`).
 * @param fetch - SvelteKit fetch function.
 */
export async function loadKitDocsMeta(
  slug: string,
  fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<MarkdownMeta> {
  return (await fetch(`/kit-docs/${slugToRequestParam(slug.replace(/^\//, ''))}.meta.json`)).json();
}

/**
 * @param slug - A slug that will be resolved to a directory inside the `routes` folder. Markdown
 * files will be resolved from the found directory and used to build a sidebar config
 * object (e.g., `/docs`).
 * @param fetch - SvelteKit fetch function.
 */
export async function loadKitDocsSidebar(
  slug: string,
  fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<NormalizedSidebarConfig> {
  return (
    await fetch(`/kit-docs/${slugToRequestParam(slug.replace(/^\//, ''))}.sidebar.json`)
  ).json();
}

export type KitDocsLoaderOptions = {
  /**
   * A slug that will be resolved to a directory inside the `routes` folder. Markdown files
   * will be resolved from the found directory and used to build a sidebar config object.
   *
   * @example `/docs`
   */
  sidebar?: string;
};

export function createKitDocsLoader(options: KitDocsLoaderOptions = {}): Load {
  return async ({ url, fetch }): Promise<LoadKitDocsResult> => {
    const meta = await loadKitDocsMeta(url.pathname, fetch);
    return {
      props: options.sidebar
        ? { meta, sidebar: await loadKitDocsSidebar(options.sidebar, fetch) }
        : { meta },
    };
  };
}

export type LoadKitDocsResult = {
  props: {
    meta: MarkdownMeta;
    sidebar?: NormalizedSidebarConfig;
  };
};
