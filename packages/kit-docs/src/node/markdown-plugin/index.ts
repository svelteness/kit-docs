import { createFilter, type FilterPattern } from '@rollup/pluginutils';
import { type Plugin } from 'vite';

import {
  createMarkdownParser,
  type MarkdownParser,
  type MarkdownParserOptions,
  parseMarkdownToSvelte,
} from './parser';

const PLUGIN_NAME = '@svelteness/markdown' as const;

export type MarkdownPluginOptions = {
  /**
   * The markdown files to be parsed and rendered as Svelte components.
   *
   * @default /\.md($|\?)/
   */
  include?: FilterPattern;
  /**
   * The markdown files to _not_ be parsed.
   *
   * @default null
   */
  exclude?: FilterPattern;
  /**
   * Markdown parser options.
   *
   * @default null
   */
  parser?: MarkdownParserOptions;
};

const DEFAULT_INCLUDE_RE = /\.md($|\?)/;
const DEFAULT_EXCLUDE_RE = null;

export function markdownPlugin(options: MarkdownPluginOptions = {}): Plugin {
  let baseUrl: string;
  let parser: MarkdownParser;
  let isBuild: boolean;
  let define: Record<string, unknown> | undefined;

  const filter = createFilter(
    options.include ?? DEFAULT_INCLUDE_RE,
    options.exclude ?? DEFAULT_EXCLUDE_RE,
  );

  /** Page system file paths. */
  const files = new Set<string>();

  const parseOptions = () =>
    ({
      baseUrl,
      escapeConstants: isBuild,
      define,
    } as const);

  return {
    name: PLUGIN_NAME,
    enforce: 'pre' as const,
    async configResolved(config) {
      baseUrl = config.base;
      isBuild = config.command === 'build';
      define = config.define;
      parser = await createMarkdownParser(options.parser);
    },
    transform(code, id) {
      if (filter(id)) {
        const { component } = parseMarkdownToSvelte(parser, code, id, parseOptions());
        files.add(id);
        return component;
      }

      return null;
    },
    async handleHotUpdate(ctx) {
      const { file, read } = ctx;

      // Hot reload `.md` files as `.svelte` files.
      if (files.has(file)) {
        const content = await read();
        const { component } = parseMarkdownToSvelte(parser, content, file, parseOptions());
        ctx.read = () => component;
      }
    },
  };
}
