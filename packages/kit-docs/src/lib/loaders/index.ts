import type { Load } from '@sveltejs/kit';

import type { SidebarConfig } from '$lib/components/layout/contexts';
import type { MarkdownMeta } from '$lib/stores/kitDocs';

export function getRootDirFromUrl(url: URL) {
  return url.pathname.split('/')[1];
}

export function slugToRequestParam(slug: string) {
  return slug.replace(/\//g, '_');
}

export async function loadKitDocsMeta(
  slug: string,
  fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<MarkdownMeta> {
  return (await fetch(`/kit-docs/${slugToRequestParam(slug)}.meta.json`)).json();
}

export async function loadKitDocsSidebar(
  dir: string,
  fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<SidebarConfig> {
  return (await fetch(`/kit-docs/${dir}.sidebar.json`)).json();
}

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
