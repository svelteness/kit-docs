import MarkdownIt from 'markdown-it';

import {
  admonitionPlugin,
  anchorPlugin,
  codePlugin,
  createShikiPlugin,
  customComponentPlugin,
  emojiPlugin,
  extractHeadersPlugin,
  extractTitlePlugin,
  hoistTagsPlugin,
  importCodePlugin,
  linksPlugin,
  responsiveTablePlugin,
  stepsPlugin,
  tocPlugin,
  yesNoPlugin,
} from './plugins';
import { type MarkdownParser } from './types';

export type MarkdownParserOptions = MarkdownIt.Options & {
  configureParser?(parser: MarkdownParser): void | Promise<void>;
};

export async function createMarkdownParser(
  options: MarkdownParserOptions = {},
): Promise<MarkdownParser> {
  const { configureParser, ...markdownItOptions } = options;

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
  parser.use(yesNoPlugin);
  parser.use(importCodePlugin);
  parser.use(responsiveTablePlugin);
  parser.use(await createShikiPlugin());
  parser.use(admonitionPlugin);
  parser.use(stepsPlugin);
  parser.use(hoistTagsPlugin);

  await configureParser?.(parser);

  return parser;
}
