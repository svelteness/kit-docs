import type { PluginWithOptions } from 'markdown-it';

export const katexPlugin: PluginWithOptions = (parser, { plugin, katex }) => {
  return plugin.default(parser, {
    engine: katex.default,
    delimiters: 'dollars',
  });
};
