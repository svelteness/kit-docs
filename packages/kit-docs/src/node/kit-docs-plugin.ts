import { type Plugin } from 'vite';

import { type HighlightPluginOptions, kitDocsHighlightPlugin } from './highlight-plugin';
import { kitDocsMarkdownPlugin, type MarkdownPluginOptions } from './markdown-plugin';

export type KitDocsPluginOptions = {
  highlight?: false | HighlightPluginOptions;
  markdown?: MarkdownPluginOptions;
};

export const kitDocsPlugin = (options: KitDocsPluginOptions = {}): Plugin[] =>
  [
    options.highlight !== false && kitDocsHighlightPlugin(options.highlight),
    kitDocsMarkdownPlugin(options.markdown),
  ].filter(Boolean) as Plugin[];
