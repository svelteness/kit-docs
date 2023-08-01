import {type PluginSimple} from 'markdown-it';
import {type HighlighterOptions, getHighlighter, renderToHtml} from 'shiki';

export const createShikiPlugin = async (options?: HighlighterOptions) => {
  const highlighter = await getHighlighter({
    theme: 'material-palenight',
    langs: [
      "bash",
      "css",
      "diff",
      "docker",
      "graphql",
      "html",
      "javascript",
      "json",
      "jsx",
      "markdown",
      "python",
      "rust",
      "sql",
      "svelte",
      "toml",
      "tsx",
      "typescript",
      "yaml",
    ],
    ...options,
  });

  return ((parser) => {
    parser.options.highlight = (code, lang) => {
      const tokens = highlighter.codeToThemedTokens(code, lang);
      return renderToHtml(tokens);
    };
  }) as PluginSimple;
};
