import type { Load } from '@sveltejs/kit';
import { get } from 'svelte/store';

import type { ResolvedSidebarConfig } from '$lib/components/layout/contexts.js';
import type { MarkdownMeta } from '$lib/stores/kitDocs.js';
import { isString } from '$lib/utils/unit';

export function getRootDirFromUrl(url: URL) {
  return url.pathname.split('/')[1];
}

export function slugToRequestParam(slug: string) {
  return normalizePath(slug).replace(/\//g, '_');
}

export function normalizePath(path: string) {
  return path.replace(/^\//, '').replace(/\/$/, '');
}

export type LoaderFetchFn = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

/**
 * @param slug - A slug that will be resolved to a markdown file from which a meta object will be
 * built (e.g., `docs/introduction`).
 * @param input - SvelteKit loader input.
 */
export async function loadKitDocsMeta(
  slug: string,
  { fetch }: { fetch: LoaderFetchFn },
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

export type SidebarLoaderPath = string | { [path: string]: string };

/**
 * @param path - A path relative to the `routes/` directory. Markdown files will be resolved from
 * the matched directory and used to build a sidebar config object (e.g., `/docs`). You can also
 * provide a multi-path configuration that will resolve the directory to the key that matches the
 * current path (e..g, `{ '/': null, '/docs': '/docs' }`).
 * @param input - SvelteKit loader input.
 */
export async function loadKitDocsSidebar(
  path: SidebarLoaderPath,
  { url, fetch }: { url: URL; fetch: LoaderFetchFn },
): Promise<ResolvedSidebarConfig | null> {
  const matchedPath = matchSidebarPath(url, path);

  if (!matchedPath) {
    return null;
  }

  try {
    const res = await fetch(`/kit-docs/${slugToRequestParam(matchedPath)}.sidebar.json`);
    return res.json();
  } catch (e) {
    return null;
  }
}

export function matchSidebarPath(url: URL, path: SidebarLoaderPath): string | null {
  if (isString(path)) return path;

  const currentPath = url.pathname;
  // Match deep paths first.
  const sortedPaths = Object.keys(path).sort((a, b) => b.length - a.length);

  for (const possiblePath of sortedPaths) {
    if (currentPath.startsWith(possiblePath)) {
      return path[possiblePath];
    }
  }

  return null;
}

export type KitDocsLoaderOptions = {
  /**
   * A path relative to the `routes/` directory. Markdown files will be resolved from the
   * matched directory and used to build a sidebar config object. You can also provide a
   * multi-path configuration that will resolve the directory to the key that matches the current
   * path.
   *
   * @example `/docs`
   * @example
   * ```js
   * {
   *   '/': null,
   *   '/docs': '/docs',
   *   '/faq': '/faq',
   * }
   * ```
   */
  sidebar?: SidebarLoaderPath;
};

export function createKitDocsLoader(options: KitDocsLoaderOptions = {}): Load {
  return async ({ url, fetch }): Promise<LoadKitDocsResult> => {
    const meta = await loadKitDocsMeta(url.pathname, { fetch });
    return {
      props: options.sidebar
        ? { meta, sidebar: await loadKitDocsSidebar(options.sidebar, { url, fetch }) }
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
