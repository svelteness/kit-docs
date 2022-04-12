import { createFilter, type FilterPattern, normalizePath } from '@rollup/pluginutils';
import { globbySync } from 'globby';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { type Plugin } from 'vite';

import { getFileNameFromPath } from '../utils/path';
import {
  AddTopLevelHtmlTags,
  clearMarkdownCaches,
  createMarkdownParser,
  MarkdownComponentContainer,
  type MarkdownComponents,
  type MarkdownParser,
  type MarkdownParserOptions,
  type ParseMarkdownOptions,
  parseMarkdownToSvelte,
} from './parser';

const PLUGIN_NAME = '@svelteness/markdown' as const;

// @ts-ignore
const __dirname = fileURLToPath(import.meta.url);

export type MarkdownPluginOptions = MarkdownParserOptions & {
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
   * markdown file.
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
};

const DEFAULT_INCLUDE_RE = /\.md($|\?)/;
const DEFAULT_EXCLUDE_RE = null;
const DEFAULT_GLOBAL_COMPONENTS = 'src/lib/components/markdown/**/[^_]*.svelte';

export function kitDocsMarkdownPlugin(options: MarkdownPluginOptions = {}): Plugin {
  let baseUrl: string;
  let parser: MarkdownParser;
  let isBuild: boolean;
  let define: Record<string, unknown> | undefined;

  const {
    include = DEFAULT_INCLUDE_RE,
    exclude = DEFAULT_EXCLUDE_RE,
    globalComponents = DEFAULT_GLOBAL_COMPONENTS,
    topLevelHtmlTags,
    ...parserOptions
  } = options;

  const filter = createFilter(
    options.include ?? DEFAULT_INCLUDE_RE,
    options.exclude ?? DEFAULT_EXCLUDE_RE,
  );

  /** Page system file paths. */
  const files = new Set<string>();

  const globalComponentFiles = globbySync(globalComponents).map(normalizePath);

  const parseOptions = (): ParseMarkdownOptions => ({
    baseUrl,
    escapeConstants: isBuild,
    define,
    globalComponentFiles,
    topLevelHtmlTags,
  });

  const components: MarkdownComponents = parserOptions?.components ?? [];

  function addGlobalComponents(files: string[]) {
    for (const file of files) {
      const name = getFileNameFromPath(file);
      const has = globalComponentFiles.some((file) => getFileNameFromPath(file) === name);
      if (!has) globalComponentFiles.push(file);
    }
  }

  function addMarkdownComponents(files: string[]) {
    for (const file of files) {
      const componentName = getFileNameFromPath(file);
      const has = components.some(({ name, type }) => type === 'custom' && name === componentName);
      if (!has) {
        components.push({
          name: componentName,
          type: 'custom',
          container: getMarkdownContainer(file, componentName),
        });
      }
    }
  }

  addMarkdownComponents(globalComponentFiles);

  try {
    const root = resolve(__dirname, '../../client/components/markdown');
    const paths = globbySync('**/*.svelte', { cwd: root }).map(normalizePath);
    const absPaths = paths.map((path) => join(root, path));
    addMarkdownComponents(absPaths);
    addGlobalComponents(absPaths);
  } catch (e) {
    // no-op
  }

  return {
    name: PLUGIN_NAME,
    enforce: 'pre' as const,
    async configResolved(config) {
      baseUrl = config.base;
      isBuild = config.command === 'build';
      define = config.define;
      parser = await createMarkdownParser({
        ...parserOptions,
        components,
      });
    },
    configureServer(server) {
      function restart() {
        clearMarkdownCaches();
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

function getMarkdownContainer(path: string, name: string): MarkdownComponentContainer | undefined {
  if (!path.includes('@svelteness/kit-docs') && !path.includes('kit-docs/kit-docs')) {
    return;
  }

  if (name === 'Step') return { marker: '!' };

  return undefined;
}
