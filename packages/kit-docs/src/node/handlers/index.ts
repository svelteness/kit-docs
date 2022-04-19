import { createFilter, type FilterPattern } from '@rollup/pluginutils';
import type { RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { globbySync } from 'globby';
import kleur from 'kleur';
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
const deepMatchRE = /\[\.\.\..*?_deep\]/;
const layoutNameRE = /@.+/g;

/**
 * Careful this function will throw if it can't match the `slug` param to a file.
 */
export async function handleMetaRequest(slugParam: string) {
  const slug = paramToSlug(slugParam);

  const fileGlob = slug
    .split('/')
    .map((s) => `*${s}*`)
    .join('/');

  const glob = `src/routes/${fileGlob}.{md,svelte}`;
  let file = globbySync(glob)[0];

  if (!file) {
    const glob = `src/routes/${fileGlob}/*index.{md,svelte}`;
    file = globbySync(glob)[0];
  }

  if (!file) {
    throw Error('Could not find file.');
  }

  const filePath = resolve(CWD, file);

  const matchedSlug = file
    .replace(restParamsRE, '')
    .replace(layoutNameRE, '')
    .replace(extname(file), '')
    .replace(/\/index$/, '');

  if (matchedSlug !== `src/routes/${slug}`) {
    throw Error('Could not find file.');
  }

  const content = readFileSync(filePath).toString();

  if (!parser) {
    parser = await createMarkdownParser();
  }

  return parseMarkdown(parser, content, filePath);
}

export type CreateMetaRequestHandlerOptions = {
  debug?: boolean;
};

export function createMetaRequestHandler(
  options: CreateMetaRequestHandlerOptions = {},
): RequestHandler {
  const { debug } = options;

  return async ({ params }) => {
    try {
      const { meta } = await handleMetaRequest(params.slug);
      return { body: meta as any };
    } catch (e) {
      if (debug) {
        console.log(kleur.bold(kleur.red(`\n[kit-docs]: failed to handle meta request.`)));
        console.log(`\n\n${e}\n`);
      }
    }

    return { body: null };
  };
}

const headingRE = /#\s(.*?)($|\n|\r)/;

export type HandleSidebarRequestOptions = {
  filter?: (file: string) => boolean;
  formatCategoryName?: (dirname: string) => string;
};

/**
 * Careful this function will throw if it can't match the `dir` param to a directory.
 */
export async function handleSidebarRequest(
  dirParam: string,
  options: HandleSidebarRequestOptions = {},
) {
  const { filter, formatCategoryName } = options;

  const directory = paramToDir(dirParam);

  const dirPath = resolve(ROUTES_DIR, directory);

  const files = readDirDeepSync(dirPath);
  const links: Record<string, { title: string; slug: string; match?: 'deep' }[]> = {};

  for (const file of files) {
    const filename = basename(file);
    const relativePath = relative(ROUTES_DIR, file);
    const cleanPath = relativePath.replace(restParamsRE, '').replace(layoutNameRE, extname(file));
    const cleanDirs = dirname(cleanPath).split('/');
    const cleanDirsReversed = cleanDirs.slice().reverse();
    const index = /\/index\./.test(cleanPath);
    const deepMatch = deepMatchRE.test(dirname(relativePath));

    if (
      filename.startsWith('_') ||
      filename.startsWith('.') ||
      cleanDirs.length == 1 ||
      (!index && deepMatch) ||
      !(filter?.(`/${cleanPath}`) ?? true)
    ) {
      continue;
    }

    const content = readFileSync(file).toString();
    const frontmatter = getFrontmatter(content);

    const categoryFormatter = formatCategoryName ?? kebabToTitleCase;
    const category = categoryFormatter(cleanDirsReversed[index && deepMatch ? 1 : 0]);

    const title =
      frontmatter.sidebar_title ??
      frontmatter.title ??
      (deepMatch ? categoryFormatter(cleanDirsReversed[0]) : null) ??
      content.match(headingRE)?.[1] ??
      kebabToTitleCase(basename(cleanPath, extname(cleanPath)));

    const slug = `/${cleanPath.replace(extname(cleanPath), '').replace(/\/index$/, '')}`;
    const match = deepMatch ? 'deep' : undefined;

    (links[category] ??= []).push({ title, slug, match });
  }

  return { links };
}

export type CreateSidebarRequestHandlerOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
  debug?: boolean;
  formatCategoryName?: (dirname: string) => string;
};

export function createSidebarRequestHandler(
  options: CreateSidebarRequestHandlerOptions = {},
): RequestHandler {
  const { include, debug, exclude, formatCategoryName } = options;

  const filter = createFilter(include ?? /\.(md|svelte)($|\?)/, exclude);

  return async ({ params }) => {
    try {
      const { links } = await handleSidebarRequest(params.dir, {
        filter,
        formatCategoryName,
      });

      return { body: { links } };
    } catch (e) {
      if (debug) {
        console.log(kleur.bold(kleur.red(`\n[kit-docs]: failed to handle sidebar request.`)));
        console.log(`\n\n${e}\n`);
      }
    }

    return { body: null };
  };
}

export function paramToSlug(param: string) {
  return param.replace(/_/g, '/').replace(/\.html/, '');
}

export function paramToDir(param: string) {
  return paramToSlug(param);
}
