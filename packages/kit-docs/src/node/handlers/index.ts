import { createFilter, type FilterPattern } from '@rollup/pluginutils';
import type { RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { globbySync } from 'globby';
import kleur from 'kleur';
import path from 'path';

import {
  createMarkdownParser,
  getFrontmatter,
  type MarkdownParser,
  parseMarkdown,
} from '../markdown-plugin/parser';
import { readDirDeepSync } from '../utils/fs';
import { kebabToTitleCase } from '../utils/string';

const CWD = process.cwd();
const ROUTES_DIR = path.resolve(CWD, 'src/routes');

let parser: MarkdownParser;

const restParamsRE = /\[\.\.\.(.*?)\]/g;
const restPropsRE = /\[\.\.\.(.*?)\]/;
const deepMatchRE = /\[\.\.\..*?_deep\]/;
const layoutNameRE = /@.+/g;
const defaultIncludeRE = /\.(md|svelte)($|\?)/;

export type HandleMetaRequestOptions = {
  filter?: (file: string) => boolean;
  resolve?: FileResolver;
};

export type FileResolver = (
  slug: string,
) => string | null | undefined | Promise<string | null | undefined>;

/**
 * Careful this function will throw if it can't match the `slug` param to a file.
 */
export async function handleMetaRequest(
  slugParam: string,
  { filter, resolve }: HandleMetaRequestOptions = {},
) {
  const slug = paramToSlug(slugParam);

  const file = (await resolve?.(slug)) ?? resolveSlug(slug);

  if (!file) {
    throw Error('Could not find file.');
  }

  if (filter && !filter(`/${cleanFilePath(file)}`)) {
    return null;
  }

  const filePath = path.isAbsolute(file) ? file : path.resolve(CWD, file);

  const matchedSlug = file
    .replace(restParamsRE, '')
    .replace(layoutNameRE, '')
    .replace(path.extname(file), '')
    .replace(/\/index$/, slug === 'index' ? '/index' : '');

  if (matchedSlug !== `src/routes/${slug}` || !file.endsWith('.md')) {
    throw Error('Could not find file.');
  }

  const content = readFileSync(filePath).toString();

  if (!parser) {
    parser = await createMarkdownParser();
  }

  return parseMarkdown(parser, content, filePath);
}

export type CreateMetaRequestHandlerOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
  debug?: boolean;
} & HandleMetaRequestOptions;

export function createMetaRequestHandler(
  options: CreateMetaRequestHandlerOptions = {},
): RequestHandler {
  const { include, exclude, debug, ...handlerOptions } = options;

  const filter = createFilter(include ?? defaultIncludeRE, exclude);

  return async ({ params }) => {
    try {
      const res = await handleMetaRequest(params.slug, { filter, ...handlerOptions });

      if (!res) {
        return { body: null };
      }

      return { body: res.meta as any };
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
  resolveTitle?: SidebarMetaResolver;
};

export type SidebarMetaResolver = (data: {
  filePath: string;
  relativeFilePath: string;
  cleanFilePath: string;
  frontmatter: Record<string, any>;
  content: string;
}) => string | null | undefined | Promise<string | null | undefined>;

/**
 * Careful this function will throw if it can't match the `dir` param to a directory.
 */
export async function handleSidebarRequest(
  dirParam: string,
  options: HandleSidebarRequestOptions = {},
) {
  const { filter, formatCategoryName, resolveTitle } = options;

  const directory = paramToDir(dirParam);

  const dirPath = path.resolve(ROUTES_DIR, directory);

  const filePaths = readDirDeepSync(dirPath);
  const links: Record<string, { title: string; slug: string; match?: 'deep' }[]> = {};

  for (const filePath of filePaths) {
    const filename = path.basename(filePath);
    const relativeFilePath = path.relative(ROUTES_DIR, filePath);
    const dirs = path.dirname(relativeFilePath).split('/');
    const cleanPath = cleanFilePath(filePath);
    const cleanDirs = path.dirname(cleanPath).split('/');
    const cleanDirsReversed = cleanDirs.slice().reverse();
    const index = /\/index\./.test(cleanPath);

    let deepMatch = false;
    let validDeepMatch = false;
    if (deepMatchRE.test(relativeFilePath)) {
      const deepMatchDir = dirs.findIndex((dir) => deepMatchRE.test(dir));
      deepMatch = deepMatchDir >= 0;

      const glob = (depth: number) =>
        `src/routes/*${cleanDirs.slice(0, depth).join('/*')}/*index*.{md,svelte}`;

      let file = deepMatch ? globbySync(glob(deepMatchDir + 1))?.[0] : null;

      if (deepMatch && !file) {
        file = deepMatch ? globbySync(glob(deepMatchDir + 2))?.[0] : null;
      }

      validDeepMatch = deepMatch ? file === `src/routes/${relativeFilePath}` : false;
    }

    if (
      filename.startsWith('_') ||
      filename.startsWith('.') ||
      cleanDirs.length == 1 ||
      (deepMatch && !validDeepMatch) ||
      !(filter?.(`/${cleanPath}`) ?? true)
    ) {
      continue;
    }

    const content = readFileSync(filePath).toString();
    const frontmatter = getFrontmatter(content);

    const resolverData = {
      filePath,
      relativeFilePath,
      cleanFilePath: cleanPath,
      frontmatter,
      content,
    };

    const categoryFormatter = formatCategoryName ?? kebabToTitleCase;
    const category = categoryFormatter(cleanDirsReversed[index && deepMatch ? 1 : 0]);

    const title =
      (await resolveTitle?.(resolverData)) ??
      frontmatter.sidebar_title ??
      frontmatter.title ??
      (deepMatch ? categoryFormatter(cleanDirsReversed[0]) : null) ??
      content.match(headingRE)?.[1] ??
      kebabToTitleCase(path.basename(cleanPath, path.extname(cleanPath)));

    const slug = `/${cleanPath.replace(path.extname(cleanPath), '').replace(/\/index$/, '')}`;
    const match = deepMatch ? 'deep' : undefined;

    (links[category] ??= []).push({ title, slug, match });
  }

  return { links };
}

export type CreateSidebarRequestHandlerOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
  debug?: boolean;
} & HandleSidebarRequestOptions;

export function createSidebarRequestHandler(
  options: CreateSidebarRequestHandlerOptions = {},
): RequestHandler {
  const { include, debug, exclude, ...handlerOptions } = options;

  const filter = createFilter(include ?? defaultIncludeRE, exclude);

  return async ({ params }) => {
    try {
      const { links } = await handleSidebarRequest(params.dir, {
        filter,
        ...handlerOptions,
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

/**
 * Attempts to resolve the given slug to a file in the `routes` directory. This function returns
 * a relative file path.
 */
export function resolveSlug(slug: string): string | null {
  const fileGlobBase = `src/routes/${slug
    .split('/')
    .slice(0, -1)
    .map((s) => `*${s}`)
    .join('/')}`;

  const glob = `${fileGlobBase}/*${path.basename(slug)}*.{md,svelte}`;
  let file = globbySync(glob)?.[0];

  if (!file) {
    const glob = `${fileGlobBase}/*${path.basename(slug)}/*index*.{md,svelte}`;
    file = globbySync(glob)?.[0];
  }

  return file ?? null;
}

/**
 * Takes an absolute or relative file path and maps it to a relative path to `src/routes`, and
 * strips out rest params and layout ids `{[...1]}index{@layout-id}.md`.
 *
 * @example `src/routes/docs/[...1getting-started]/[...1]intro.md` -> `src/routes/docs/getting-started/intro.md`
 */
export function cleanFilePath(filePath: string) {
  const relativePath = path.isAbsolute(filePath) ? path.relative(ROUTES_DIR, filePath) : filePath;
  return relativePath.replace(restParamsRE, '').replace(layoutNameRE, path.extname(filePath));
}

export function paramToSlug(param: string) {
  return param.replace(/_/g, '/').replace(/\.html/, '');
}

export function paramToDir(param: string) {
  return paramToSlug(param);
}
