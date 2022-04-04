import type { PluginWithOptions } from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import container from 'markdown-it-container';

import { titleToKebabCase } from '../../../utils/string';
import { isString } from '../../../utils/unit';
import type { MarkdownCustomComponents, MarkdownParser } from '../types';

const propsRE = /\|?(.*?)=(.*?)(?=(\||$))/g;
const bodyRE = /\((.*?)\)(?:=)(.*)/;
const tagRE = /tag=(.*?)(?:&|$)/;
const slotRE = /slot=(.*?)(?:&|$)/;

function renderDefault(tokens: Token[], idx: number) {
  const token = tokens[idx];
  const name = token.tag;

  const props: string[] = [];
  const body: string[] = [];

  for (const [propMatch, prop, value] of token.info.matchAll(propsRE)) {
    if (bodyRE.test(propMatch)) {
      const [_, content] = propMatch.match(bodyRE) ?? [];
      const tag = propMatch.match(tagRE)?.[1];
      const slot = propMatch.match(slotRE)?.[1];
      if (isString(tag) && isString(content)) {
        body.push(
          [`<${tag}${isString(slot) ? ` slot="${slot}"` : ''}>`, content, `</${tag}>`].join('\n'),
        );
      }
    } else if (isString(prop) && isString(value)) {
      props.push(`${prop}=${value}`);
    }
  }

  if (token.nesting === 1) {
    return `<${name} ${props.join(' ')}>\n ${body.join('\n ')}`;
  } else {
    return `</${name}\n`;
  }
}

export const containersPlugin: PluginWithOptions<MarkdownCustomComponents> = (
  parser: MarkdownParser,
  components = {},
) => {
  for (const componentName of Object.keys(components)) {
    const options = components[componentName];
    const name: string =
      (!isString(options) ? options.name : null) ?? titleToKebabCase(componentName);
    const marker: string = (!isString(options) ? options.marker : null) ?? ':';
    const render = (!isString(options) ? options.render : null) ?? renderDefault;
    parser.use(container(name, { marker, render }));
  }
};
