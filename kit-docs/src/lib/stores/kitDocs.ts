import { type Readable, writable } from 'svelte/store';

export type MarkdownFrontmatter = Record<string, unknown>;

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
  file: string;
};

export type KitDocsContext = {
  meta: MarkdownMeta;
};

/** @internal */
export const __kitDocs = writable<KitDocsContext | null>(null);

export const kitDocs: Readable<KitDocsContext | null> = {
  subscribe: __kitDocs.subscribe,
};
