import type { PluginSimple } from 'markdown-it';

import { uncommentTemplateTags } from '../../utils/htmlEscape';
import { resolveHighlightLines } from './resolveHighlightLines';
import { resolveLanguage } from './resolveLanguage';

/**
 * Plugin to enable styled code fences with line numbers, syntax highlighting, etc.
 */
export const codePlugin: PluginSimple = (parser) => {
  parser.renderer.rules.code_inline = (tokens, idx) => {
    const token = tokens[idx];
    const code = token.content;
    const props = [`code={${JSON.stringify(code)}}`].join(' ');
    return `<CodeInline ${props} />`;
  };

  // Override default fence renderer.
  parser.renderer.rules.fence = (tokens, idx, options) => {
    const token = tokens[idx];

    // Get token info.
    const info = token.info ? parser.utils.unescapeAll(token.info).trim() : '';

    // Resolve language from token info.
    const language = resolveLanguage(info);

    // Get un-escaped code content.
    const content = uncommentTemplateTags(token.content);

    // Try to get highlighted code.
    const html =
      options.highlight?.(content, language.name, '') || parser.utils.escapeHtml(content);

    const code = html.replace(/\sclass="shiki" style=".*?"/, '').trim();

    const rawCode = token.content
      .replace(/<script/g, '<script&#8203')
      .replace(/<style/g, '<style&#8203');

    const linesCount = (html.match(/"line"/g) || []).length;

    // Resolve highlight line ranges from token info.
    const highlightLinesRanges = resolveHighlightLines(info);

    const highlight = `[${highlightLinesRanges
      ?.map((range) => `[${range[0]}, ${range[1]}]`)
      .join(',')}]`;

    const title = info.match(/\|?title="?(.*?)"?(\||{|$)/)?.[1];
    const useLineNumbers = /\|?lineNumbers/.test(info);
    const showCopyCode = /\|?copy/.test(info);
    const copyHighlightOnly = /\|?copyHighlight/.test(info);
    const copySteps = /\|?copySteps/.test(info);
    const slot =
      info.match(/\|?slot="?(.*?)"?(\||{|$)/)?.[1] ?? (/\|?slot/.test(info) && language.ext);

    const props = [
      title && `title="${title}"`,
      `lang="${language.name}"`,
      `ext="${language.ext}"`,
      `linesCount={${linesCount}}`,
      useLineNumbers && 'showLineNumbers',
      (highlightLinesRanges?.length ?? 0) > 0 && `highlightLines={${highlight}}`,
      showCopyCode && `rawCode={${JSON.stringify(rawCode)}}`,
      showCopyCode && 'showCopyCode',
      copyHighlightOnly && `copyHighlightOnly`,
      copySteps && 'copySteps',
      `code={${JSON.stringify(code)}}`,
      slot && `slot="${slot}"`,
    ]
      .filter(Boolean)
      .join(' ');

    return `<CodeFence ${props} />`;
  };
};
