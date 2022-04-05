import { createFilter, type FilterPattern } from '@rollup/pluginutils';
import { normalizePath, type Plugin } from 'vite';

import {
  AddTopLevelHtmlTags,
  createMarkdownParser,
  type MarkdownComponents,
  type MarkdownParser,
  type MarkdownParserOptions,
  type ParseMarkdownOptions,
  parseMarkdownToSvelte,
} from './parser';

const PLUGIN_NAME = '@svelteness/markdown' as const;

export type MarkdownPluginOptions = {
  /**
   * The markdown files to be parsed and rendered as Svelte components.
   *
   * @defaultValue /\.md($|\?)/
   */
  include?: FilterPattern;
  /**
   * The markdown files to _not_ be parsed.
   *
   * @defaultValue `null`
   */
  exclude?: FilterPattern;
  /**
   * A glob pointing to Svelte component files that will be imported into every single
   * markdown file. Minification/treeshaking will remove them if they're not being used.
   *
   * @defaultValue 'src/lib/components/markdown/**\/[^_]*.svelte'
   */
  globalComponents?: string;
  /**
   * Add custom top-level tags (e.g., `<svelte:head>`, `<script>` or `<style>`) to a markdown
   * Svelte component.
   *
   * @defaultValue `null`
   */
  topLevelHtmlTags?: AddTopLevelHtmlTags;
  /**
   * Markdown parser options.
   *
   * @defaultValue `null`
   */
  parser?: MarkdownParserOptions;
};

const DEFAULT_INCLUDE_RE = /\.md($|\?)/;
const DEFAULT_EXCLUDE_RE = null;
const DEFAULT_GLOBAL_COMPONENTS = 'src/lib/components/markdown/**/[^_]*.svelte';

export function markdownPlugin(options: MarkdownPluginOptions = {}): Plugin {
  let baseUrl: string;
  let parser: MarkdownParser;
  let isBuild: boolean;
  let define: Record<string, unknown> | undefined;

  const topLevelHtmlTags = options.topLevelHtmlTags;
  const globalComponents = options.globalComponents ?? DEFAULT_GLOBAL_COMPONENTS;

  const filter = createFilter(
    options.include ?? DEFAULT_INCLUDE_RE,
    options.exclude ?? DEFAULT_EXCLUDE_RE,
  );

  /** Page system file paths. */
  const files = new Set<string>();

  const parseOptions = (): ParseMarkdownOptions => ({
    baseUrl,
    escapeConstants: isBuild,
    define,
    globalComponents,
    topLevelHtmlTags,
  });

  // TODO: extend this with global custom components
  // TODO: add custom kit docs components if don't exist
  const components: MarkdownComponents = options.parser?.components ?? {};

  return {
    name: PLUGIN_NAME,
    enforce: 'pre' as const,
    async configResolved(config) {
      baseUrl = config.base;
      isBuild = config.command === 'build';
      define = config.define;
      parser = await createMarkdownParser({
        ...options.parser,
        components,
      });
    },
    configureServer(server) {
      function restart() {
        files.clear();
        server.restart();
      }

      server.watcher
        .add(globalComponents)
        .on('add', () => restart())
        .on('unlink', () => restart());
    },
    transform(code, id) {
      if (filter(id)) {
        const filePath = normalizePath(id);
        const { component } = parseMarkdownToSvelte(parser, code, filePath, parseOptions());
        files.add(filePath);
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
