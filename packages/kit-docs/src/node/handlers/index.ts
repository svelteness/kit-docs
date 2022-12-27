import { type FilterPattern, createFilter } from '@rollup/pluginutils';
import { json, RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { globbySync } from 'globby';
import kleur from 'kleur';
import path from 'path';

import {
  type MarkdownParser,
  type ParsedMarkdownResult,
  createMarkdownParser,
  getFrontmatter,
  parseMarkdown,
} from '../markdown-plugin/parser';
import { readDirDeepSync, sortOrderedFiles } from '../utils/fs';
import { kebabToTitleCase } from '../utils/string';
import { isString } from '../utils/unit';

const CWD = process.cwd();
const ROUTES_DIR = path.resolve(CWD, 'src/routes');

let parser: MarkdownParser;

const restParamsRE = /\[\.\.\.(.*?)\]/g;
const restPropsRE = /\[\.\.\.(.*?)\]/;
const deepMatchRE = /\[\.\.\..*?_deep\]/;
const layoutNameRE = /@.+/g;
const defaultIncludeRE = /\.md($|\?)/;

export type NoValue = null | undefined | void;

export type FalsyValue = false | NoValue;

export type HandleMetaRequestOptions = {
  extensions?: string[];
  filter?: (file: string) => boolean;
  resolve?: FileResolver | null | (FileResolver | FalsyValue)[];
  transform?: MetaTransform | null | (MetaTransform | FalsyValue)[];
};

export type FileResolver = (
  slug: string,
  helpers: { resolve: typeof resolveSlug },
) => ResolvedFile | FalsyValue | Promise<ResolvedFile | FalsyValue>;

export type ResolvedFile =
  | string
  | { file: string; transform: MetaTransform | (MetaTransform | FalsyValue)[] };

export type MetaTransform = (
  data: { slug: string; filePath: string; parser: MarkdownParser } & ParsedMarkdownResult,
) => void | Promise<void>;

/**
 * Careful this function will throw if it can't match the `slug` param to a file.
 */
export async function handleMetaRequest(slugParam: string, options: HandleMetaRequestOptions = {}) {
  const { filter, extensions, resolve, transform } = options;

  const slug = paramToSlug(slugParam);

  const resolverArgs: Parameters<FileResolver> = [slug, { resolve: resolveSlug }];

  let resolution: ResolvedFile | FalsyValue = null;

  if (Array.isArray(resolve)) {
    for (const resolver of resolve) {
      if (resolver) resolution = await resolver?.(...resolverArgs);
      if (resolution) break;
    }
  } else {
    resolution = await resolve?.(...resolverArgs);
  }

  if (!resolution) {
    resolution = resolveSlug(slug, { extensions });
  }

  const resolvedFile = isString(resolution) ? resolution : resolution?.file;
  const resolvedTransform = isString(resolution) ? null : resolution?.transform;
  if (!resolvedFile) {
    throw Error('Could not find file.');
  }

  if (filter && !filter(`/${cleanFilePath(resolvedFile)}`)) {
    return null;
  }

  const filePath = path.isAbsolute(resolvedFile) ? resolvedFile : path.resolve(CWD, resolvedFile);
  const content = readFileSync(filePath).toString();
  if (!parser) {
    parser = await createMarkdownParser();
  }

  let result = parseMarkdown(parser, content, filePath);
  result = JSON.parse(JSON.stringify(result));

  const transformerArgs: Parameters<MetaTransform> = [{ slug, filePath, parser, ...result }];

  const runTransform = async (transform?: HandleMetaRequestOptions['transform']) => {
    if (Array.isArray(transform)) {
      for (const transformer of transform) {
        if (transformer) await transformer?.(...transformerArgs);
      }
    } else {
      await transform?.(...transformerArgs);
    }
  };

  await runTransform(transform);
  await runTransform(resolvedTransform);
  return result;
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

  const filter = createFilter(
    include ?? handlerOptions.extensions?.map((ext) => new RegExp(`${ext}$`)) ?? defaultIncludeRE,
    exclude,
  );

  return async ({ params }) => {
    try {
      const res = await handleMetaRequest(params.slug as string, { filter, ...handlerOptions });
      if (!res) return new Response(null);
      return json(res.meta);
    } catch (e) {
      if (debug) {
        console.log(kleur.bold(kleur.red(`\n[kit-docs]: failed to handle meta request.`)));
        console.log(`\n\n${e}\n`);
      }
    }

    return new Response(null);
  };
}

const headingRE = /#\s(.*?)($|\n|\r)/;

export type HandleSidebarRequestOptions = {
  extensions?: string[];
  filter?: (file: string) => boolean;
  resolveTitle?: SidebarMetaResolver;
  resolveCategory?: SidebarMetaResolver;
  resolveSlug?: SidebarMetaResolver;
  formatCategoryName?: (name: string, helpers: { format: (name: string) => string }) => string;
};

export type SidebarMetaResolver = (data: {
  filePath: string;
  relativeFilePath: string;
  cleanFilePath: string;
  dirname: string;
  cleanDirname: string;
  frontmatter: Record<string, any>;
  fileContent: string;
  resolve: () => string;
  slugify: typeof slugifyFilePath;
}) => string | void | null | undefined | Promise<string | void | null | undefined>;

/**
 * Careful this function will throw if it can't match the `dir` param to a directory.
 */
export async function handleSidebarRequest(
  dirParam: string,
  options: HandleSidebarRequestOptions = {},
) {
  const { extensions, filter, formatCategoryName, resolveTitle, resolveCategory, resolveSlug } =
    options;

  const exts = extensions ?? ['.md'];
  const globExt =
    exts.length > 1 ? `.{${exts.map((ext) => ext.replace(/^\./, '')).join(',')}}` : exts[0];

  const directory = paramToDir(dirParam);
  const dirPath = path.resolve(ROUTES_DIR, directory);

  const filePaths = sortOrderedFiles(readDirDeepSync(dirPath));

  const links: Record<string, { title: string; slug: string; match?: 'deep' }[]> = {};

  // Root at top.
  links['.'] = [];
  let hasRoot = false;

  for (const filePath of filePaths) {
    const filename = path.basename(filePath);
    const relativeFilePath = path.relative(ROUTES_DIR, filePath);
    const dirs = path.dirname(relativeFilePath).split('/');
    const cleanPath = cleanFilePath(filePath);
    const cleanDirs = path.dirname(cleanPath).split('/').slice(0, -1);
    const cleanDirsReversed = cleanDirs.slice().reverse();
    const isIndexFile = /\/\+page\./.test(cleanPath);
    const isShallowRoot = cleanDirs.length === 0;
    const isRoot = isShallowRoot || deepMatchRE.test(dirs[1]);
    let isDeepMatch = false;
    let isValidDeepMatch = false;

    if (deepMatchRE.test(relativeFilePath)) {
      const deepMatchDir = dirs.findIndex((dir) => deepMatchRE.test(dir));
      isDeepMatch = deepMatchDir >= 0;

      const glob = (depth: number) =>
        `src/routes/*${cleanDirs.slice(0, depth).join('/*')}/*+page*${globExt}`;

      let file = isDeepMatch ? globbySync(glob(deepMatchDir + 1))?.[0] : null;

      if (isDeepMatch && !file) {
        file = isDeepMatch ? globbySync(glob(deepMatchDir + 2))?.[0] : null;
      }

      isValidDeepMatch = isDeepMatch ? file === `src/routes/${relativeFilePath}` : false;
    }

    if (
      filename.startsWith('_') ||
      filename.startsWith('.') ||
      (isShallowRoot && isIndexFile) ||
      (isDeepMatch && !isValidDeepMatch) ||
      !(filter?.(`/${cleanPath}`) ?? true)
    ) {
      continue;
    }

    const fileContent = readFileSync(filePath).toString();
    const frontmatter = getFrontmatter(fileContent);

    const resolverData = {
      filePath,
      relativeFilePath,
      cleanFilePath: cleanPath,
      frontmatter,
      fileContent,
      dirname: path.dirname(filePath),
      cleanDirname: path.dirname(cleanPath),
      slugify: slugifyFilePath,
    };

    const categoryFormatter = formatCategoryName ?? kebabToTitleCase;

    const formatCategory = (dirname: string) =>
      categoryFormatter(dirname, { format: (name) => kebabToTitleCase(name) });

    const resolveDefaultTitle = () =>
      frontmatter.sidebar_title ??
      frontmatter.title ??
      (isDeepMatch ? formatCategory(cleanDirsReversed[0]) : null) ??
      fileContent.match(headingRE)?.[1] ??
      kebabToTitleCase(path.basename(cleanPath, path.extname(cleanPath)));

    const resolveDefaultCategory = () =>
      isRoot ? '.' : cleanDirsReversed[isIndexFile && isDeepMatch ? 1 : 0];

    const resolveDefaultSlug = () => slugifyFilePath(filePath);

    const category = formatCategory(
      (await resolveCategory?.({ ...resolverData, resolve: resolveDefaultCategory })) ??
        resolveDefaultCategory(),
    );

    const title =
      (await resolveTitle?.({ ...resolverData, resolve: resolveDefaultTitle })) ??
      resolveDefaultTitle();

    const slug =
      (await resolveSlug?.({ ...resolverData, resolve: resolveDefaultSlug })) ??
      resolveDefaultSlug();

    const match = isDeepMatch ? 'deep' : undefined;

    (links[category] ??= []).push({ title, slug, match });
    if (!hasRoot) hasRoot = category === '.';
  }

  if (!hasRoot) {
    delete links['.'];
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

  const filter = createFilter(
    include ?? handlerOptions.extensions?.map((ext) => new RegExp(`${ext}$`)) ?? defaultIncludeRE,
    exclude,
  );

  return async ({ params }) => {
    try {
      const { links } = await handleSidebarRequest(params.dir as string, {
        filter,
        ...handlerOptions,
      });

      return json({ links });
    } catch (e) {
      if (debug) {
        console.log(kleur.bold(kleur.red(`\n[kit-docs]: failed to handle sidebar request.`)));
        console.log(`\n\n${e}\n`);
      }
    }

    return new Response(null);
  };
}

export type ResolveSlugOptions = {
  extensions?: string[];
};

/**
 * Attempts to resolve the given slug to a file in the `routes` directory. This function returns
 * a relative file path.
 */
export function resolveSlug(slug: string, options: ResolveSlugOptions = {}): string | null {
  const { extensions } = options;

  const exts = extensions ?? ['.md'];

  const globExt =
    exts.length > 1 ? `.{${exts.map((ext) => ext.replace(/^\./, '')).join(',')}}` : exts[0];

  const fileGlobBase = `src/routes/${slug
    .split('/')
    .slice(0, -1)
    .map((s) => `*${s}`)
    .join('/')}`;

  const glob = `${fileGlobBase}/*${path.basename(slug)}/*${globExt}`;
  let file = globbySync(glob)?.[0];

  if (!file) {
    const glob = `${fileGlobBase}/*${path.basename(slug)}/*index*${globExt}`;
    file = globbySync(glob)?.[0];
  }

  if (!file) {
    return null;
  }

  const matchedSlug = file
    .replace(restParamsRE, '')
    .replace(layoutNameRE, '')
    .replace(path.extname(file), '')
    .replace(/\/index$/, slug === 'index' ? '/index' : '');

  if (matchedSlug !== `src/routes/${slug}/+page` || !exts.some((ext) => file.endsWith(ext))) {
    return null;
  }
  return file;
}

/**
 * Takes an absolute or relative file path and maps it to a relative path to `src/routes`, and
 * strips out rest params and layout ids `{[...1]}index{@layout-id}.md`.
 *
 * @example `src/routes/docs/[...1getting-started]/[...1]intro.md` = `docs/getting-started/intro.md`
 */
export function cleanFilePath(filePath: string) {
  const relativePath = path.relative(ROUTES_DIR, filePath);
  return relativePath.replace(restParamsRE, '').replace(layoutNameRE, path.extname(filePath));
}

export function paramToSlug(param: string) {
  return param.replace(/_/g, '/').replace(/\.html/, '');
}

export function paramToDir(param: string) {
  return paramToSlug(param);
}

/**
 * Maps a path that points to a file in the `routes` directory to a slug. The file path
 * can be absolute or relative to the `routes` directory.
 */
export function slugifyFilePath(filePath: string) {
  const cleanPath = cleanFilePath(filePath);
  return `/${cleanPath
    .replace(path.extname(cleanPath), '')
    .replace(/\/?index$/, '')
    .replace(/\/\+page$/, '')}`;
}
