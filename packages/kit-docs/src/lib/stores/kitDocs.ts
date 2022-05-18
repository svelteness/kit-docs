import { derived, writable, type Readable } from 'svelte/store';

export type MarkdownFrontmatter = Record<string, any>;

export type MarkdownHeader = {
  level: number;
  title: string;
  slug: string;
  children?: MarkdownHeader[];
};

export type MarkdownMeta = {
  title: string;
  description: string;
  excerpt: string;
  headers: MarkdownHeader[];
  frontmatter: MarkdownFrontmatter;
  lastUpdated: number;
  slug: string;
};

export type KitDocsStuff = {
  meta: MarkdownMeta | null;
};

/** @internal */
export const __kitDocs = writable<KitDocsStuff>({ meta: null });

export const kitDocs: Readable<KitDocsStuff> = {
  subscribe: __kitDocs.subscribe,
};

export const frontmatter = derived(kitDocs, ($kitDocs) => $kitDocs?.meta?.frontmatter);

export function hasMarkdownHeaders(meta?: MarkdownMeta) {
  if (!meta) return false;

  const { headers } = meta;

  return (
    headers && [...headers.map((h) => h.title), ...headers.map((h) => h.children).flat()].length > 1
  );
}
