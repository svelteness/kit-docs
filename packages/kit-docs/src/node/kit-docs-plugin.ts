import { highlightPlugin, type HighlightPluginOptions } from 'highlight-plugin';
import { markdownPlugin, type MarkdownPluginOptions } from 'markdown-plugin';
import Icons from 'unplugin-icons/vite';
import { type Plugin } from 'vite';
import WindiCSS from 'vite-plugin-windicss';

export type KitDocsPluginOptions = {
  highlight?: HighlightPluginOptions;
  markdown?: MarkdownPluginOptions;
  icons?: false;
  windi?: false;
};

export const kitDocsPlugin = (options: KitDocsPluginOptions = {}): Plugin[] =>
  [
    highlightPlugin(options.highlight),
    markdownPlugin(options.markdown),
    options.icons !== false && Icons({ compiler: 'svelte' }),
    options.windi !== false && WindiCSS(),
  ].filter(Boolean);
