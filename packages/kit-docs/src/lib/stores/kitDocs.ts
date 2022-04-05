import { type Readable, writable } from 'svelte/store';

import type { NavbarConfig, SidebarConfig } from '$lib/components/layout/contexts';

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
  frontmatter: MarkdownFrontmatter;
  lastUpdated: number;
  slug: string;
  rootPath: string;
  hasHeaders: boolean;
};

export type KitDocsContext = {
  meta: MarkdownMeta;
  navbar: NavbarConfig;
  sidebar: SidebarConfig;
};

/** @internal */
export const __kitDocs = writable<KitDocsContext | null>(null);

export const kitDocs: Readable<KitDocsContext | null> = {
  subscribe: __kitDocs.subscribe,
};
