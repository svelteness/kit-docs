import katex from 'katex';
import type { PluginSimple } from 'markdown-it';
import rawKatexPlugin from 'markdown-it-texmath';

export const katexPlugin: PluginSimple = (parser) => {
  return rawKatexPlugin(parser, {
    engine: katex,
    delimiters: 'dollars',
  });
};
