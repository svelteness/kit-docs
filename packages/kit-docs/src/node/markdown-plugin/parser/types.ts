import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';

import { type slugify } from './utils/slugify';

export type MarkdownParser = MarkdownIt;

export type ParseMarkdownOptions = {
  baseUrl?: string;
  escapeConstants?: boolean;
  define?: Record<string, unknown>;
  tags?: AddTagsFn;
  customComponents?: MarkdownCustomComponents;
};

export type AddTagsFn = (data: {
  fileName: string;
  filePath: string;
  meta: MarkdownMeta;
  slugify: typeof slugify;
}) => string[] | undefined | null;

export type InlineMarkdownComponent =
  | 'CodeInline'
  | 'Emphasized'
  | 'Image'
  | 'Link'
  | 'Strikethrough'
  | 'Strong';

export type BlockMarkdownComponent =
  | 'Blockquote'
  | 'CodeBlock'
  | 'Heading1'
  | 'Heading2'
  | 'Heading3'
  | 'Heading4'
  | 'Heading5'
  | 'Heading6'
  | 'ListItem'
  | 'OrderedList'
  | 'Paragraph'
  | 'Pre'
  | 'Table'
  | 'TableWrapper'
  | 'UnorderedList';

export type MarkdownCustomComponents = Record<string, MarkdownComponentContainer>;

export type MarkdownComponentContainer =
  | string
  | { name: string; marker?: string; render(tokens: Token[], idx: number): string };

export type MarkdownMeta = {
  title: string;
  description: string;
  excerpt: string;
  headers: MarkdownHeader[];
  frontmatter: MarkdownFrontmatter;
  lastUpdated: number;
};

export type MarkdownFrontmatter = Record<string, unknown>;

export type MarkdownHeader = {
  level: number;
  title: string;
  slug: string;
  children: MarkdownHeader[];
};

export type MarkdownLinks = string[];

export type ParsedMarkdownResult = {
  content: string;
  meta: MarkdownMeta;
  html: string;
  links: MarkdownLinks;
  importedFiles: string[];
  env: MarkdownParserEnv;
};

/**
 * Metadata provided to markdown parser.
 */
export type MarkdownParserEnvInput = {
  /** Absolute system file path of the markdown file. */
  filePath?: string | null;
  /** Frontmatter of the markdown file. */
  frontmatter?: MarkdownFrontmatter;
};

/**
 * Resources extracted from markdown parser.
 */
export type MarkdownParserEnvOutput = {
  /** Headers that are extracted by `extractHeadersPlugin`. */
  headers?: MarkdownHeader[];
  /** Imported files that are extracted by `importCodePlugin`. */
  importedFiles?: string[];
  /** Hoisted `<script>` and `<style>` tags. */
  hoistedTags?: string[];
  /** Links that are extracted by `linksPlugin`. */
  links?: MarkdownLinks;
  /** Title that is extracted by `extractTitlePlugin`. */
  title?: string;
};

/**
 * The `env` object to be passed to `markdown-it` render function.
 */
export type MarkdownParserEnv = MarkdownParserEnvInput & MarkdownParserEnvOutput;
