import fs from 'fs';
import matter from 'gray-matter';
import LRUCache from 'lru-cache';
import toml from 'toml';

import { isLocalEnv } from '../../utils/env';
import { getFileNameFromPath } from '../../utils/path';
import { hashString } from '../../utils/string';
import type {
  MarkdownMeta,
  MarkdownParser,
  MarkdownParserEnv,
  ParsedMarkdownResult,
  ParseMarkdownOptions,
} from './types';
import { commentOutTemplateTags, uncommentTemplateTags } from './utils/htmlEscape';
import { preventViteReplace } from './utils/preventViteReplace';

const kitDocsImportPath = isLocalEnv() ? '$lib' : '@svelteness/kit-docs';

export type ParseMarkdownToSvelteResult = {
  component: string;
  meta: MarkdownMeta;
};

const svelteCache = new LRUCache<string, ParseMarkdownToSvelteResult>({ max: 1024 });
export function parseMarkdownToSvelte(
  parser: MarkdownParser,
  source: string,
  filePath: string,
  options: ParseMarkdownOptions = {},
): ParseMarkdownToSvelteResult {
  const isProd = options.mode === 'production';
  const cacheKey = !isProd ? hashString(filePath + source) : '';

  if (!isProd && svelteCache.has(cacheKey)) return svelteCache.get(cacheKey)!;

  const {
    html,
    meta,
    env: parserEnv,
  } = parseMarkdown(parser, commentOutTemplateTags(source), filePath, {
    ...options,
  });

  const { hoistedTags = [] } = parserEnv as MarkdownParserEnv;

  const fileName = getFileNameFromPath(filePath);

  if (kitDocsImportPath.length) {
    hoistedTags.push(
      ['<script>', `import { frontmatter } from "${kitDocsImportPath}";`, '</script>'].join('\n'),
    );
  }

  hoistedTags.push(...(options.topLevelHtmlTags?.({ fileName, filePath, meta }) ?? []));

  if (options.globalComponentFiles) {
    addGlobalImports(hoistedTags, options.globalComponentFiles);
  }

  const component =
    dedupeHoistedTags(hoistedTags).join('\n') + `\n\n${uncommentTemplateTags(html)}`;

  const result: ParseMarkdownToSvelteResult = {
    component,
    meta,
  };

  svelteCache.set(cacheKey, result);
  return result;
}

function addGlobalImports(tags: string[], files: string[]) {
  const globalImports = files
    .map((filePath) => {
      const componentName = getFileNameFromPath(filePath);
      return `import ${componentName} from '/${filePath.replace(/^\//, '')}';`;
    })
    .join('\n');

  tags.push(['<script>', globalImports, '</script>'].join('\n'));
}

const frontmatterCache = new LRUCache({ max: 1024 });
export function getFrontmatter(source: string): Record<string, any> {
  const cacheKey = hashString(source);

  if (frontmatterCache.has(cacheKey)) return frontmatterCache.get(cacheKey)!;

  const { data: frontmatter } = matter(source, {
    excerpt_separator: '<!-- more -->',
    engines: {
      toml: toml.parse.bind(toml),
    },
  });

  frontmatterCache.set(cacheKey, frontmatter ?? {});
  return frontmatter ?? {};
}

const mdCache = new LRUCache<string, ParsedMarkdownResult>({ max: 1024 });
export function parseMarkdown(
  parser: MarkdownParser,
  source: string,
  filePath: string,
  options: ParseMarkdownOptions = {},
): ParsedMarkdownResult {
  const isProd = options.mode === 'production';
  const cacheKey = !isProd ? hashString(filePath + source) : '';

  if (!isProd && mdCache.has(cacheKey)) return mdCache.get(cacheKey)!;

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

  mdCache.set(cacheKey, result);
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

export function clearMarkdownCaches() {
  frontmatterCache.clear();
  mdCache.clear();
  svelteCache.clear();
}
