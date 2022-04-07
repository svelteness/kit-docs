import type { RequestHandler } from '@sveltejs/kit';
import { readdirSync, readFileSync, statSync } from 'fs';
import { globbySync } from 'globby';
import kleur from 'kleur';
import LRUCache from 'lru-cache';
import { getFrontmatter } from 'markdown-plugin/parser';
import { basename, dirname, extname, relative, resolve } from 'path';
import { kebabToTitleCase } from 'utils/string';

const CWD = process.cwd();
const SRC_DIR = resolve(CWD, 'src');

const orderedPathTokenRE = /\[\d\]/g;

export function createMetaRequestHandler(): RequestHandler {
  return async ({ params }) => {
    const slug = paramToPath(params.file);

    try {
      const glob = `src/${slug
        .split('/')
        .map((s) => `*${s}`)
        .join('/')}.{md,svelte}`;

      const file = globbySync(glob)[0];
      const filePath = resolve(CWD, file);
      const matchedSlug = file.replace(orderedPathTokenRE, '').replace(extname(file), '');

      if (matchedSlug !== `src/${slug}`) {
        throw Error('Could not find file.');
      }

      // TODO: this needs to write output somewhere (slugs)...
    } catch (e) {
      console.log(
        kleur.red(`\n[kit-docs]: meta request failed\n\nFile: ${params.file}.\nSlug: ${slug}\n`),
      );
    }

    return {
      body: {},
    };
  };
}

export function createSidebarRequestHandler(): RequestHandler {
  const headingRE = /#\s(.*?)($|\n|\r)/;

  return async ({ params }) => {
    const directory = paramToPath(params.dir);
    const path = resolve(SRC_DIR, directory);

    try {
      const files = readDirDeepSync(path);
      const links: Record<string, { title: string; slug: string }[]> = {};

      for (const file of files) {
        const relativePath = relative(path, file);
        const unorderedPath = relativePath.replace(orderedPathTokenRE, '');
        const content = readFileSync(file).toString();
        const frontmatter = extractFrontmatter(content);
        const category = kebabToTitleCase(dirname(unorderedPath));

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
      console.log(
        kleur.red(
          `\n[kit-docs]: sidebar request failed\n\nMessage: Directory does not exist.\nPath: ${path}\n`,
        ),
      );
    }

    return {
      body: {
        links: [],
      },
    };
  };
}

const frontmatterCache = new LRUCache({ max: 1024 });
function extractFrontmatter(content: string): Record<string, any> {
  if (frontmatterCache.has(content)) return frontmatterCache.get(content)!;
  const frontmatter = getFrontmatter(content);
  frontmatterCache.set(content, frontmatter);
  return frontmatter;
}

export function paramToPath(param: string) {
  return param.replace(/_/g, '/');
}

const ignoreFileRE = /^(\.|_)/;
export function readDirDeepSync(dir: string) {
  const files: string[] = [];

  for (const file of readdirSync(dir)) {
    const filePath = resolve(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      files.push(...readDirDeepSync(filePath));
    } else if (!ignoreFileRE.test(file)) {
      files.push(filePath);
    }
  }

  return files;
}
