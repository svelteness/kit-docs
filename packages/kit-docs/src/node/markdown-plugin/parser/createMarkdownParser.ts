import MarkdownIt from 'markdown-it';
import { type HighlighterOptions } from 'shiki';

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
import type {
  InlineElementRule,
  MarkdownBlockComponent,
  MarkdownComponents,
  MarkdownCustomComponent,
  MarkdownInlineComponent,
  MarkdownParser,
} from './types';

export type MarkdownParserOptions = {
  components?: MarkdownComponents;
  shiki?: HighlighterOptions;
  configureParser?(parser: MarkdownParser): void | Promise<void>;
};

export async function createMarkdownParser(
  options: MarkdownParserOptions = {},
): Promise<MarkdownParser> {
  const { configureParser, shiki = {}, components = [] } = options;

  const inlineComponents = components.filter(
    ({ type }) => type === 'inline',
  ) as MarkdownInlineComponent[];

  const blockComponents = components.filter(
    ({ type }) => type === 'block',
  ) as MarkdownBlockComponent[];

  const customComponents = components.filter(
    ({ type }) => type === 'custom',
  ) as MarkdownCustomComponent[];

  const parser = MarkdownIt({ html: true });

  parser.use(emojiPlugin);
  parser.use(anchorPlugin);
  parser.use(tocPlugin);
  parser.use(extractHeadersPlugin);
  parser.use(extractTitlePlugin);
  parser.use(customComponentPlugin);
  parser.use(linksPlugin);
  parser.use(codePlugin);
  parser.use(containersPlugin, customComponents);
  parser.use(importCodePlugin);
  parser.use(await createShikiPlugin(shiki));
  parser.use(hoistTagsPlugin);

  responsiveTablePlugin(parser);

  const inlineRuleMap: Partial<Record<InlineElementRule, string>> = {
    strikethrough: 's',
    emphasized: 'em',
  };

  for (const { name, rule } of inlineComponents) {
    if (rule === 'image') {
      parser.renderer.rules.image = function (tokens, idx, _, __, self) {
        const token = tokens[idx];
        return `<${name} ${self.renderAttrs(token)} />`;
      };
      continue;
    }

    const mappedRule = inlineRuleMap[rule] ?? rule;
    parser.renderer.rules[`${mappedRule}_open`] = () => {
      return `<${name}>`;
    };
    parser.renderer.rules[`${mappedRule}_close`] = () => {
      return `</${name}>`;
    };
  }

  for (const { name, rule } of blockComponents) {
    parser.renderer.rules[`${rule}_open`] = (tokens, idx) => {
      const token = tokens[idx];
      const props: string[] = [];

      if (/h(\d)/.test(token.tag)) {
        props.push(`level=${token.tag.slice(1)}`);
      }

      return `<${name} ${props.join(' ')}>`;
    };
    parser.renderer.rules[`${rule}_close`] = () => {
      return `</${name}>`;
    };
  }

  await configureParser?.(parser);

  return parser;
}

function responsiveTablePlugin(parser: MarkdownParser) {
  parser.renderer.rules.table_open = function () {
    return `<TableWrapper><table>`;
  };

  parser.renderer.rules.table_close = function () {
    return '</table></TableWrapper>';
  };
}
