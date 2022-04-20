import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';

export type MarkdownParser = MarkdownIt;

export type ParseMarkdownOptions = {
  mode?: string;
  baseUrl?: string;
  escapeConstants?: boolean;
  define?: Record<string, unknown>;
  globalComponentFiles?: string[];
  topLevelHtmlTags?: AddTopLevelHtmlTags;
};

export type AddTopLevelHtmlTags = (data: {
  fileName: string;
  filePath: string;
  meta: MarkdownMeta;
}) => string[] | undefined | null;

export type InlineElementRule = 'emphasized' | 'image' | 'strikethrough' | 'strong';

export type BlockElementRule =
  | 'blockquote'
  | 'heading'
  | 'list_item'
  | 'ordered_list'
  | 'paragraph'
  | 'table'
  | 'bullet_list';

export type MarkdownInlineComponent = {
  name: string;
  type: 'inline';
  rule: InlineElementRule;
};

export type MarkdownBlockComponent = {
  name: string;
  type: 'block';
  rule: BlockElementRule;
};

export type MarkdownCustomComponent = {
  name: string;
  type: 'custom';
  container?: MarkdownComponentContainer;
};

export type MarkdownComponentContainer = {
  name?: string;
  marker?: string;
  renderer?(componentName: string): (tokens: Token[], idx: number) => string;
};

export type MarkdownComponents = (
  | MarkdownInlineComponent
  | MarkdownBlockComponent
  | MarkdownCustomComponent
)[];

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
  children?: MarkdownHeader[];
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
