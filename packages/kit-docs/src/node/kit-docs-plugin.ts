import { highlightPlugin, type HighlightPluginOptions } from 'highlight-plugin';
import { markdownPlugin, type MarkdownPluginOptions } from 'markdown-plugin';
import Icons from 'unplugin-icons/vite';
import { type Plugin } from 'vite';

export type KitDocsPluginOptions = {
  icons?: false;
  highlight?: HighlightPluginOptions;
  markdown?: MarkdownPluginOptions;
};

export const kitDocsPlugin = (options: KitDocsPluginOptions = {}): Plugin[] =>
  [
    highlightPlugin(options.highlight),
    markdownPlugin(options.markdown),
    options.icons !== false && Icons({ compiler: 'svelte' }),
  ].filter(Boolean);
