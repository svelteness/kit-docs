import { type HighlightPluginOptions, kitDocsHighlightPlugin } from 'highlight-plugin';
import { kitDocsMarkdownPlugin, type MarkdownPluginOptions } from 'markdown-plugin';
import { type Plugin } from 'vite';

export type KitDocsPluginOptions = {
  highlight?: false | HighlightPluginOptions;
  markdown?: MarkdownPluginOptions;
};

export const kitDocsPlugin = (options: KitDocsPluginOptions = {}): Plugin[] =>
  [
    kitDocsHashMapPlugin(),
    options.highlight !== false && kitDocsHighlightPlugin(options.highlight),
    kitDocsMarkdownPlugin(options.markdown),
  ].filter(Boolean) as Plugin[];

export function kitDocsHashMapPlugin(): Plugin {
  return {
    name: '@svelteness/hash-map',
    enforce: 'pre',
    // ...
  };
}
