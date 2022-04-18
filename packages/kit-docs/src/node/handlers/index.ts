import { createFilter, type FilterPattern } from '@rollup/pluginutils';
import type { RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { globbySync } from 'globby';
import { basename, dirname, extname, relative, resolve } from 'path';

import {
  createMarkdownParser,
  getFrontmatter,
  type MarkdownParser,
  parseMarkdown,
} from '../markdown-plugin/parser';
import { readDirDeepSync } from '../utils/fs';
import { kebabToTitleCase } from '../utils/string';

const CWD = process.cwd();
const ROUTES_DIR = resolve(CWD, 'src/routes');

let parser: MarkdownParser;

const restParamsRE = /\[\.\.\.(.*?)\]/g;
const restPropsRE = /\[\.\.\.(.*?)\]/;
const layoutNameRE = /@.+/g;

/**
 * Careful this function will throw if it can't match the `slug` param to a file.
 */
export async function handleMetaRequest(slugParam: string) {
  const slug = paramToSlug(slugParam);

  const glob = `src/routes/${slug
    .split('/')
    .map((s) => `*${s}*`)
    .join('/')}.md`;

  const file = globbySync(glob)[0];

  const filePath = resolve(CWD, file);

  const matchedSlug = file
    .replace(restParamsRE, '')
    .replace(layoutNameRE, '')
    .replace(extname(file), '');

  if (matchedSlug !== `src/routes/${slug}`) {
    throw Error('Could not find file.');
  }

  const content = readFileSync(filePath).toString();

  if (!parser) {
    parser = await createMarkdownParser();
  }

  return parseMarkdown(parser, content, filePath);
}

export function createMetaRequestHandler(): RequestHandler {
  return async ({ params }) => {
    try {
      const { meta } = await handleMetaRequest(params.slug);
      return { body: meta as any };
    } catch (e) {
      // no-op
    }

    return { body: null };
  };
}

const headingRE = /#\s(.*?)($|\n|\r)/;

export type HandleSidebarRequestOptions = {
  filter?: (file: string) => boolean;
};

/**
 * Careful this function will throw if it can't match the `dir` param to a directory.
 */
export async function handleSidebarRequest(
  dirParam: string,
  options: HandleSidebarRequestOptions = {},
) {
  const directory = paramToSlug(dirParam);

  const dirPath = resolve(ROUTES_DIR, directory);

  const files = readDirDeepSync(dirPath);
  const links: Record<string, { title: string; slug: string; match?: 'deep' }[]> = {};

  for (const file of files) {
    const filename = basename(file);

    if (
      filename.startsWith('_') ||
      filename.startsWith('.') ||
      !(options.filter?.(filename) ?? true)
    ) {
      continue;
    }

    const relativePath = relative(dirPath, file);
    const normalPath = relativePath.replace(restParamsRE, '').replace(layoutNameRE, '');
    const content = readFileSync(file).toString();
    const frontmatter = getFrontmatter(content);
    const props = basename(relativePath).match(restPropsRE)?.[1]?.split('_') ?? [];
    const cleanPath = relativePath.replace(restParamsRE, '');
    const category = dirname(cleanPath).split('/').reverse()[
      /index(\.md)?$/.test(cleanPath) ? 1 : 0
    ];

    const title =
      frontmatter.sidebar_title ??
      frontmatter.title ??
      content.match(headingRE)?.[1] ??
      kebabToTitleCase(basename(normalPath, extname(normalPath)));

    const slug = `/${directory}/${normalPath.replace(extname(normalPath), '')}`;

    const match = props.includes('deep') ? 'deep' : undefined;

    (links[category] ??= []).push({ title, slug, match });
  }

  return { links };
}

export type CreateSidebarRequestHandlerOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
};

export function createSidebarRequestHandler(
  options: CreateSidebarRequestHandlerOptions = {},
): RequestHandler {
  const filter = createFilter(options.include ?? /\.md($|\?)/, options.exclude);

  return async ({ params }) => {
    try {
      const { links } = await handleSidebarRequest(params.dir, { filter });
      return { body: { links } };
    } catch (e) {
      // no-op
    }

    return { body: null };
  };
}

export function paramToSlug(param: string) {
  return param.replace(/_/g, '/').replace(/\.html/, '');
}
