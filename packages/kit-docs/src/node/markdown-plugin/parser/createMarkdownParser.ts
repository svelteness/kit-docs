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
import type { InlineElementRule, MarkdownComponents, MarkdownParser } from './types';

export type MarkdownParserOptions = MarkdownIt.Options & {
  components?: MarkdownComponents;
  configureParser?(parser: MarkdownParser): void | Promise<void>;
};

export async function createMarkdownParser(
  options: MarkdownParserOptions = {},
): Promise<MarkdownParser> {
  const { configureParser, components = {}, ...markdownItOptions } = options;

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
  parser.use(containersPlugin, components);
  parser.use(importCodePlugin);
  parser.use(await createShikiPlugin());
  parser.use(hoistTagsPlugin);

  const inlineRuleMap: Partial<Record<InlineElementRule, string>> = {
    strikethrough: 's',
    emphasized: 'em',
  };

  for (const { name, rule } of components.inline ?? []) {
    const mappedRule = inlineRuleMap[rule] ?? rule;
    parser.renderer.rules[mappedRule] = () => {
      return `<${name} />`;
    };
  }

  for (const { name, rule } of components.block ?? []) {
    parser.renderer.rules[`${rule}_open`] = () => {
      return `<${name}>`;
    };
    parser.renderer.rules[`${rule}_close`] = () => {
      return `</${name}>`;
    };
  }

  await configureParser?.(parser);

  return parser;
}
