import MarkdownIt from 'markdown-it';

import {
  anchorPlugin,
  codePlugin,
  containersPlugin,
  createShikiPlugin,
  customComponentPlugin,
  emojiPlugin,
  extractHeadersPlugin,
  extractTitlePlugin,
  hoistTagsPlugin,
  importCodePlugin,
  linksPlugin,
  tocPlugin,
} from './plugins';
import type { MarkdownCustomComponents, MarkdownParser } from './types';

export type MarkdownParserOptions = MarkdownIt.Options & {
  configureParser?(parser: MarkdownParser): void | Promise<void>;
  customComponents?: MarkdownCustomComponents;
};

export async function createMarkdownParser(
  options: MarkdownParserOptions = {},
): Promise<MarkdownParser> {
  const { configureParser, customComponents = {}, ...markdownItOptions } = options;

  const parser = MarkdownIt({
    ...markdownItOptions,
    html: true,
  });

  parser.use(emojiPlugin);
  parser.use(anchorPlugin);
  parser.use(tocPlugin);
  parser.use(extractHeadersPlugin);
  parser.use(extractTitlePlugin);
  parser.use(customComponentPlugin);
  parser.use(linksPlugin);
  parser.use(codePlugin);
  parser.use(containersPlugin);
  parser.use(importCodePlugin);
  parser.use(await createShikiPlugin());
  parser.use(hoistTagsPlugin);

  await configureParser?.(parser);

  return parser;
}
