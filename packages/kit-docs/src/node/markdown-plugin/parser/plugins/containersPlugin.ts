import type { PluginWithOptions } from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import container from 'markdown-it-container';

import { titleToSnakeCase } from '../../../utils/string';
import { isString } from '../../../utils/unit';
import type { MarkdownCustomComponent, MarkdownParser } from '../types';

const propsRE = /(?:\s|\|)(.*?)=(.*?)(?=(\||$))/g;
const bodyRE = /\((.*?)\)(?:=)(.*)/;
const tagRE = /tag=(.*?)(?:&|\))/;
const slotRE = /slot=(.*?)(?:&|\))/;

function renderDefault(parser: MarkdownParser, componentName: string) {
  return function (tokens: Token[], idx: number) {
    const token = tokens[idx];

    const props: string[] = [];
    const body: string[] = [];

    const matchedProps = token.info.trim().matchAll(propsRE);

    for (const [propMatch, prop, value] of matchedProps) {
      if (bodyRE.test(propMatch)) {
        const [_, __, content] = propMatch.match(bodyRE) ?? [];
        const tag = propMatch.match(tagRE)?.[1] ?? 'p';
        const slot = propMatch.match(slotRE)?.[1];
        if (isString(tag) && isString(content)) {
          body.push(
            [
              `<${tag}${isString(slot) ? ` slot="${slot}"` : ''}>`,
              parser
                .render(content)
                .replace(/^<p>/, '')
                .replace(/<\/p>\n?$/, ''),
              `</${tag}>`,
            ].join('\n'),
          );
        }
      } else if (isString(prop) && isString(value)) {
        props.push(`${prop}=${value}`);
      }
    }

    if (token.nesting === 1) {
      return `<${componentName} ${props.join(' ')}>\n ${body.join('\n ')}\n`;
    } else {
      return `</${componentName}>\n`;
    }
  };
}

export const containersPlugin: PluginWithOptions<MarkdownCustomComponent[]> = (
  parser: MarkdownParser,
  components = [],
) => {
  for (const { name: componentName, container: options } of components) {
    const name: string = options?.name ?? titleToSnakeCase(componentName);
    const marker: string = options?.marker ?? ':';
    const render = options?.renderer?.(componentName) ?? renderDefault(parser, componentName);
    parser.use(container, name, { marker, render });
  }
};
