import { type PluginSimple } from 'markdown-it';
const annotationRe = /<annotation(.|\n)*?<\/annotation>/g;

/**
 * Resolves link URLs.
 */
export const removeAnnotationPlugin: PluginSimple = (parser) => {
  Object.entries(parser.renderer.rules).forEach(([name, fn]) => {
    if (!name.startsWith('math')) return;
    if (!fn) return;

    // Fix math rules, to remove annotation blocks afterward
    parser.renderer.rules[name] = (tokens, idx, options, env, renderer) =>
      fn(tokens, idx, options, env, renderer).replace(annotationRe, '');
  });
};
