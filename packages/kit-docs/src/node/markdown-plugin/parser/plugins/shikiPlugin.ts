import { type PluginSimple } from 'markdown-it';
import { type HighlighterOptions, getHighlighter, renderToHtml } from 'shiki';

export const createShikiPlugin = async (options?: HighlighterOptions) => {
  const highlighter = await getHighlighter({
    theme: 'material-palenight',
    langs: ["bash", "javascript", "typescript", "svelte", "markdown", "html", "diff", "css"],
    ...options,
  });

  return ((parser) => {
    parser.options.highlight = (code, lang) => {
      const tokens = highlighter.codeToThemedTokens(code, lang);
      return renderToHtml(tokens);
    };
  }) as PluginSimple;
};
