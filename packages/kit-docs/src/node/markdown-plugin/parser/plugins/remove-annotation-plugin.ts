import { type PluginSimple } from 'markdown-it';
const annotationRe = /(<annotation[\s\S]+?>)([\s\S]+?)(<\/annotation>)/g;

/**
 * Resolves link URLs.
 */
export const removeAnnotationPlugin: PluginSimple = (parser) => {
  Object.entries(parser.renderer.rules).forEach(([name, fn]) => {
    if (!name.startsWith('math')) return;
    if (!fn) return;

    // Fix math rules, to remove annotation blocks afterward
    parser.renderer.rules[name] = (tokens, idx, options, env, renderer) => {
      let result = fn(tokens, idx, options, env, renderer);

      [...result.matchAll(annotationRe)].forEach((match) => {
        /* Given an annotation rule with a backslash or curly braces, modify it using svelte's @html 
           to avoid svelte attempting to parse variables, or processing backslashes
           
           Input: <annotation>\rule {braces}</annotation>
           Output: <annotation>{@html `\\rule {braces}`}<annotation> */
        result = result.replace(
          match[0],
          `${match[1]}{@html \`${match[2].replace('\\', '\\\\')}\`}${match[3]}`,
        );
      });

      return result;
    };
  });
};
