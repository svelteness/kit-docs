import type { RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { globbySync } from 'globby';
import { basename, dirname, extname, relative, resolve } from 'path';

import {
  createMarkdownParser,
  getFrontmatter,
  MarkdownMeta,
  type MarkdownParser,
  parseMarkdown,
} from '../markdown-plugin/parser';
import { readDirDeepSync } from '../utils/fs';
import { kebabToTitleCase } from '../utils/string';

const CWD = process.cwd();
const ROUTES_DIR = resolve(CWD, 'src/routes');

const orderedPathTokenRE = /\[\.\.\.\d+\]/g;

let parser: MarkdownParser;

export type MarkdownMetaResponse = MarkdownMeta;

export function createMetaRequestHandler(): RequestHandler {
  return async ({ params }) => {
    const slug = paramToSlug(params.slug);

    try {
      const glob = `src/routes/${slug
        .split('/')
        .map((s) => `*${s}`)
        .join('/')}.md`;

      const file = globbySync(glob)[0];

      const filePath = resolve(CWD, file);

      const matchedSlug = file.replace(orderedPathTokenRE, '').replace(extname(file), '');
      if (matchedSlug !== `src/routes/${slug}`) {
        throw Error('Could not find file.');
      }

      const content = readFileSync(filePath).toString();

      if (!parser) {
        parser = await createMarkdownParser();
      }

      const { meta } = parseMarkdown(parser, content, filePath);

      return {
        body: meta as any,
      };
    } catch (e) {
      // no-op
    }

    return {
      body: {},
    };
  };
}

export function createSidebarRequestHandler(): RequestHandler {
  const headingRE = /#\s(.*?)($|\n|\r)/;

  return async ({ params }) => {
    const directory = paramToSlug(params.dir);

    try {
      const dirPath = resolve(ROUTES_DIR, directory);

      const files = readDirDeepSync(dirPath);
      const links: Record<string, { title: string; slug: string }[]> = {};

      for (const file of files) {
        const filename = basename(file);

        if (filename.startsWith('_') || filename.startsWith('.') || !filename.endsWith('.md')) {
          continue;
        }

        const relativePath = relative(dirPath, file);
        const unorderedPath = relativePath.replace(orderedPathTokenRE, '');
        const content = readFileSync(file).toString();
        const frontmatter = getFrontmatter(content);
        const category = dirname(unorderedPath);

        const title =
          frontmatter.sidebar_title ??
          frontmatter.title ??
          content.match(headingRE)?.[1] ??
          kebabToTitleCase(basename(unorderedPath, extname(unorderedPath)));

        const slug = `/${params.dir}/${unorderedPath
          .replace(orderedPathTokenRE, '')
          .replace(extname(unorderedPath), '')}`;

        (links[category] ??= []).push({ title, slug });
      }

      return {
        body: {
          links,
        },
      };
    } catch (e) {
      // no-op
    }

    return {
      body: {
        links: [],
      },
    };
  };
}

export function paramToSlug(param: string) {
  return param.replace(/_/g, '/').replace(/\.html/, '');
}
