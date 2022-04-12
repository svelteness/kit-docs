import { type HighlighterOptions } from 'shiki';
import { type Plugin } from 'vite';

import { kitDocsHighlightPlugin } from './highlight-plugin';
import { kitDocsMarkdownPlugin, type MarkdownPluginOptions } from './markdown-plugin';

export type KitDocsPluginOptions = {
  highlight?: false;
  shiki?: HighlighterOptions;
  markdown?: MarkdownPluginOptions;
};

export const kitDocsPlugin = (options: KitDocsPluginOptions = {}): Plugin[] =>
  [
    options.highlight !== false && kitDocsHighlightPlugin(options.shiki),
    kitDocsMarkdownPlugin({ ...options.markdown, shiki: options.shiki }),
  ].filter(Boolean) as Plugin[];
