import path from 'path';
import {
  type Highlighter,
  type HighlighterOptions,
  type Lang,
  getHighlighter,
  renderToHtml,
} from 'shiki';
import { type Plugin } from 'vite';

const PLUGIN_NAME = '@svelteness/highlight' as const;

export type HighlightPluginOptions = HighlighterOptions;

export const kitDocsHighlightPlugin = (options: HighlightPluginOptions = {}): Plugin => {
  let highlighter: Highlighter;

  const highlightQueryRE = /\?highlight/;

  return {
    name: PLUGIN_NAME,
    enforce: 'pre' as const,
    async configResolved() {
      highlighter = await getHighlighter({
        theme: 'material-palenight',
        langs: [],
        ...options,
      });
    },
    transform(code, id) {
      if (!highlightQueryRE.test(id)) {
        return null;
      }

      const lang = (new URLSearchParams(id).get('lang') ??
        path.extname(id.replace(highlightQueryRE, '')).slice(1)) as Lang;

      const tokens = highlighter.codeToThemedTokens(code, lang);

      const html = renderToHtml(tokens)
        .replace(/\sclass="shiki" style=".*?"/, '')
        .trim();

      return `
				export const tokens = ${JSON.stringify(tokens)}
				export const code = ${JSON.stringify(code)}
				export const hlCode = ${JSON.stringify(html)}
			`;
    },
  };
};
