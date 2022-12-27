import { resolve } from 'path';
import { type HighlighterOptions } from 'shiki';
import { type Plugin } from 'vite';

import { kitDocsHighlightPlugin } from './highlight-plugin';
import { type MarkdownPluginOptions, kitDocsMarkdownPlugin } from './markdown-plugin';

const __cwd = process.cwd();

export type KitDocsPluginOptions = {
  highlight?: false;
  shiki?: HighlighterOptions;
  markdown?: MarkdownPluginOptions;
};

export const kitDocsPlugin = (options: KitDocsPluginOptions = {}): Plugin[] =>
  [
    corePlugin(),
    options.highlight !== false && kitDocsHighlightPlugin(options.shiki),
    kitDocsMarkdownPlugin({ ...options.markdown, shiki: options.shiki }),
  ].filter(Boolean) as Plugin[];

function corePlugin(): Plugin {
  return {
    name: '@svelteness/kit-docs',
    enforce: 'pre',
    config(config) {
      const userAlias = config.resolve?.alias;

      const aliasKeys: string[] = !Array.isArray(userAlias)
        ? Object.keys(userAlias ?? {})
        : userAlias.map((alias) => alias.find) ?? [];

      const hasAlias = (alias: string) => aliasKeys.includes(alias);

      const alias = {
        $fonts: resolve(__cwd, 'src/fonts'),
        $img: resolve(__cwd, 'src/img'),
        $kitDocs: resolve(__cwd, 'src/kit-docs'),
      };

      for (const find of Object.keys(alias)) {
        if (hasAlias(find)) {
          delete alias[find];
        }
      }

      return {
        optimizeDeps: {
          include: ['shiki'],
          exclude: ['@svelteness/kit-docs'],
        },
        resolve: {
          alias,
        },
        build: {
          rollupOptions: {
            external: ['@svelteness/kit-docs/node'],
          },
        },
      };
    },
  };
}
