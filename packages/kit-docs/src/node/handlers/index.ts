import type { RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import {
  createMarkdownParser,
  MarkdownMeta,
  type MarkdownParser,
  parseMarkdown,
} from '../markdown-plugin/parser';

const CWD = process.cwd();
const ROUTES_DIR = resolve(CWD, 'src/routes');

let parser: MarkdownParser;

export type MarkdownMetaResponse = MarkdownMeta;

export function createMetaRequestHandler(): RequestHandler {
  return async ({ params }) => {
    const slug = paramToSlug(params.slug);

    try {
      const filePath = resolve(ROUTES_DIR, `${slug}.md`);
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

export function paramToSlug(param: string) {
  return param.replace(/_/g, '/').replace(/\.html/, '');
}
