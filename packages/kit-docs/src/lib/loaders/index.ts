import type { Load } from '@sveltejs/kit';

import type { ResolvedSidebarConfig } from '$lib/components/layout/contexts.js';
import type { MarkdownMeta } from '$lib/stores/kitDocs.js';

export function getRootDirFromUrl(url: URL) {
  return url.pathname.split('/')[1];
}

export function slugToRequestParam(slug: string) {
  return normalizePath(slug).replace(/\//g, '_');
}

export function normalizePath(path: string) {
  return path.replace(/^\//, '').replace(/\/$/, '');
}

/**
 * @param slug - A slug that will be resolved to a markdown file from which a meta object will be
 * built (e.g., `docs/introduction`).
 * @param fetch - SvelteKit fetch function.
 */
export async function loadKitDocsMeta(
  slug: string,
  fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<MarkdownMeta | null> {
  try {
    const res = await fetch(
      `/kit-docs/${
        slug === '/' ? 'index' : slugToRequestParam(slug.replace(/\.html$/, ''))
      }.meta.json`,
    );
    return await res.json();
  } catch (e) {
    return null;
  }
}

/**
 * @param path - A path relative to the `routes/` directory. Markdown files will be resolved from
 * the matched directory and used to build a sidebar config object (e.g., `/docs`).
 * @param fetch - SvelteKit fetch function.
 */
export async function loadKitDocsSidebar(
  path: string,
  fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<ResolvedSidebarConfig | null> {
  try {
    const res = await fetch(`/kit-docs/${slugToRequestParam(path)}.sidebar.json`);
    return res.json();
  } catch (e) {
    return null;
  }
}

export type KitDocsLoaderOptions = {
  /**
   * A path relative to the `routes/` directory. Markdown files will be resolved from the
   * matched directory and used to build a sidebar config object.
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
    sidebar?: ResolvedSidebarConfig;
  };
};
