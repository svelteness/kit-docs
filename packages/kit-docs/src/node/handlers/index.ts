import type { RequestHandler } from '@sveltejs/kit';
import { readdirSync, readFileSync, statSync } from 'fs';
import LRUCache from 'lru-cache';
import { getFrontmatter } from 'markdown-plugin/parser';
import { basename, dirname, extname, relative, resolve } from 'path';
import { kebabToTitleCase } from 'utils/string';

const SRC_DIR = resolve(process.cwd(), 'src');

export function createMetaRequestHandler(): RequestHandler {
  return async () => {
    // TODO: when looking for file, we need to account for numbers [1]introduction/[2]...
    // TODO: this needs to write output somewhere (slugs)...

    return {
      body: {
        hasHeaders: false,
      },
    };
  };
}

export function createSidebarRequestHandler(): RequestHandler {
  const orderedPathTokenRE = /\[\d\]/g;
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
      console.warn(
        `\n[kit-docs]: sidebar request failed\n\nMessage: Directory does not exist.\nPath: ${path}\n`,
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
