import fs from 'fs';
import matter from 'gray-matter';
import LRUCache from 'lru-cache';
import path from 'path';
import toml from 'toml';

import type {
  BlockMarkdownComponent,
  InlineMarkdownComponent,
  MarkdownCustomComponents,
  MarkdownMeta,
  MarkdownParser,
  MarkdownParserEnv,
  ParsedMarkdownResult,
  ParseMarkdownOptions,
} from './types';
import { commentOutTemplateTags, uncommentTemplateTags } from './utils/htmlEscape';
import { preventViteReplace } from './utils/preventViteReplace';
import { slugify } from './utils/slugify';

export type ParseMarkdownToSvelteResult = {
  component: string;
  meta: MarkdownMeta;
};

const cache = new LRUCache<string, ParseMarkdownToSvelteResult>({ max: 1024 });

export function parseMarkdownToSvelte(
  parser: MarkdownParser,
  source: string,
  filePath: string,
  options: ParseMarkdownOptions = {},
): ParseMarkdownToSvelteResult {
  const cachedResult = cache.get(source);
  if (cachedResult) return cachedResult;

  const {
    html,
    meta,
    env: parserEnv,
  } = parseMarkdown(parser, commentOutTemplateTags(source), filePath, {
    ...options,
  });

  const { hoistedTags = [] } = parserEnv as MarkdownParserEnv;

  const fileName = path.basename(filePath, path.extname(filePath));

  hoistedTags.push(...(options.tags?.({ fileName, filePath, meta, slugify }) ?? []));

  addGlobalImports(hoistedTags, options.customComponents);

  const component =
    dedupeHoistedTags(hoistedTags).join('\n') + `\n\n${uncommentTemplateTags(html)}`;

  const result: ParseMarkdownToSvelteResult = {
    component,
    meta,
  };

  cache.set(source, result);
  return result;
}

export const inlineMarkdownComponents: InlineMarkdownComponent[] = [
  'CodeInline',
  'Emphasized',
  'Image',
  'Link',
  'Strikethrough',
  'Strong',
];

export const blockMarkdownComponents: BlockMarkdownComponent[] = [
  'Blockquote',
  'CodeBlock',
  'Heading1',
  'Heading2',
  'Heading3',
  'Heading4',
  'Heading5',
  'Heading6',
  'ListItem',
  'OrderedList',
  'Paragraph',
  'Pre',
  'Table',
  'TableWrapper',
  'UnorderedList',
];

function addGlobalImports(tags: string[], components: MarkdownCustomComponents = {}) {
  const globalImports = [
    ...inlineMarkdownComponents.map(
      (component) => `import ${component} from '~kit-docs/markdown/inline/${component}.svelte'`,
    ),
    ...blockMarkdownComponents.map(
      (component) => `import ${component} from '~kit-docs/markdown/block/${component}.svelte'`,
    ),
    ...Object.keys(components).map(
      (component) => `import ${component} from '~kit-docs/markdown/custom/${component}.svelte';`,
    ),
  ].join('\n');

  tags.push(['<script>', globalImports, '</script>'].join('\n'));
}

function parseMarkdown(
  parser: MarkdownParser,
  source: string,
  filePath: string,
  options: ParseMarkdownOptions = {},
): ParsedMarkdownResult {
  const {
    data: frontmatter,
    content,
    excerpt,
  } = matter(source, {
    excerpt_separator: '<!-- more -->',
    engines: {
      toml: toml.parse.bind(toml),
    },
  });

  const parserEnv: MarkdownParserEnv = {
    filePath,
    frontmatter,
  };

  let html = parser.render(content, parserEnv);

  const excerptHtml = parser.render(excerpt ?? '');

  if (options.escapeConstants) {
    html = preventViteReplace(html, options.define);
  }

  const { headers = [], importedFiles = [], links = [], title = '' } = parserEnv;

  const _title = frontmatter.title ?? title;
  const description = frontmatter.description;

  const result: ParsedMarkdownResult = {
    content,
    html,
    links,
    importedFiles,
    env: parserEnv,
    meta: {
      excerpt: excerptHtml,
      headers,
      title: _title,
      description,
      frontmatter,
      lastUpdated: Math.round(fs.statSync(filePath).mtimeMs),
    },
  };

  return result;
}

const OPENING_SCRIPT_TAG_RE = /<\s*script[^>]*>/;
const OPENING_SCRIPT_MODULE_TAG_RE = /<\s*script[^>]*\scontext="module"\s*[^>]*>/;
const CLOSING_SCRIPT_TAG_RE = /<\/script>/;
const OPENING_STYLE_TAG_RE = /<\s*style[^>]*>/;
const CLOSING_STYLE_TAG_RE = /<\/style>/;
const OPENING_SVELTE_HEAD_TAG_RE = /<\s*svelte:head[^>]*>/;
const CLOSING_SVELTE_HEAD_TAG_RE = /<\/svelte:head>/;
function dedupeHoistedTags(tags: string[] = []): string[] {
  const dedupe = new Map();

  const merge = (key: string, tag: string, openingTagRe: RegExp, closingTagRE: RegExp) => {
    if (!dedupe.has(key)) {
      dedupe.set(key, tag);
      return;
    }

    const block = dedupe.get(key)!;
    dedupe.set(key, block.replace(closingTagRE, tag.replace(openingTagRe, '')));
  };

  tags.forEach((tag) => {
    if (OPENING_SCRIPT_MODULE_TAG_RE.test(tag)) {
      merge('module', tag, OPENING_SCRIPT_MODULE_TAG_RE, CLOSING_SCRIPT_TAG_RE);
    } else if (OPENING_SCRIPT_TAG_RE.test(tag)) {
      merge('script', tag, OPENING_SCRIPT_TAG_RE, CLOSING_SCRIPT_TAG_RE);
    } else if (OPENING_STYLE_TAG_RE.test(tag)) {
      merge('style', tag, OPENING_STYLE_TAG_RE, CLOSING_STYLE_TAG_RE);
    } else if (OPENING_SVELTE_HEAD_TAG_RE.test(tag)) {
      merge('svelte:head', tag, OPENING_SVELTE_HEAD_TAG_RE, CLOSING_SVELTE_HEAD_TAG_RE);
    } else {
      // Treat unknowns as unique and leave them as-is.
      dedupe.set(Symbol(), tag);
    }
  });

  return Array.from(dedupe.values());
}
