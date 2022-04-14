import { derived, type Readable, writable } from 'svelte/store';

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
  hasHeaders: boolean;
  frontmatter: MarkdownFrontmatter;
  lastUpdated: number;
  slug: string;
};

export type KitDocsStuff = {
  meta: MarkdownMeta;
};

/** @internal */
export const __kitDocs = writable<KitDocsStuff | null>(null);

export const kitDocs: Readable<KitDocsStuff | null> = {
  subscribe: __kitDocs.subscribe,
};

export const frontmatter = derived(kitDocs, ($kitDocs) => $kitDocs?.meta.frontmatter);
