# Preprocess

A number of [community-maintained preprocessing plugins](https://sveltesociety.dev/tools#preprocessors) are available to allow you to use Svelte with tools like TypeScript, PostCSS, SCSS, and Less.

You can write your own preprocessor using the `svelte.preprocess` API.

```js
result: {
	code: string,
	dependencies: Array<string>
} = await svelte.preprocess(
	source: string,
	preprocessors: Array<{
		markup?: (input: { content: string, filename: string }) => Promise<{
			code: string,
			dependencies?: Array<string>
		}>,
		script?: (input: { content: string, markup: string, attributes: Record<string, string>, filename: string }) => Promise<{
			code: string,
			dependencies?: Array<string>
		}>,
		style?: (input: { content: string, markup: string, attributes: Record<string, string>, filename: string }) => Promise<{
			code: string,
			dependencies?: Array<string>
		}>
	}>,
	options?: {
		filename?: string
	}
)
```

The `preprocess` function provides convenient hooks for arbitrarily transforming component source
code.

The first argument is the component source code. The second is an array of _preprocessors_ (or a single preprocessor, if you only have one), where a preprocessor is an object with `markup`, `script` and `style` functions, each of which is optional.

Each `markup`, `script` or `style` function must return an object (or a Promise that resolves to an object) with a `code` property, representing the transformed source code, and an optional array of `dependencies`.

The `markup` function receives the entire component source text, along with the component's `filename` if it was specified in the third argument.

> Preprocessor functions should additionally return a `map` object alongside `code` and `dependencies`, where `map` is a sourcemap representing the transformation.

```js
const svelte = require('svelte/compiler');
const MagicString = require('magic-string');

const { code } = await svelte.preprocess(
  source,
  {
    markup: ({ content, filename }) => {
      const pos = content.indexOf('foo');
      if (pos < 0) {
        return { code: content };
      }
      const s = new MagicString(content, { filename });
      s.overwrite(pos, pos + 3, 'bar', { storeName: true });
      return {
        code: s.toString(),
        map: s.generateMap(),
      };
    },
  },
  {
    filename: 'App.svelte',
  },
);
```

The `script` and `style` functions receive the contents of `<script>` and `<style>` elements respectively (`content`) as well as the entire component source text (`markup`). In addition to `filename`, they get an object of the element's attributes.

If a `dependencies` array is returned, it will be included in the result object. This is used by packages like [rollup-plugin-svelte](https://github.com/sveltejs/rollup-plugin-svelte) to watch additional files for changes, in the case where your `<style>` tag has an `@import` (for example).

```js
const svelte = require('svelte/compiler');
const sass = require('node-sass');
const { dirname } = require('path');

const { code, dependencies } = await svelte.preprocess(
  source,
  {
    style: async ({ content, attributes, filename }) => {
      // only process <style lang="sass">
      if (attributes.lang !== 'sass') return;

      const { css, stats } = await new Promise((resolve, reject) =>
        sass.render(
          {
            file: filename,
            data: content,
            includePaths: [dirname(filename)],
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          },
        ),
      );

      return {
        code: css.toString(),
        dependencies: stats.includedFiles,
      };
    },
  },
  {
    filename: 'App.svelte',
  },
);
```

Multiple preprocessors can be used together. The output of the first becomes the input to the second. `markup` functions run first, then `script` and `style`.

```js
const svelte = require('svelte/compiler');

const { code } = await svelte.preprocess(
  source,
  [
    {
      markup: () => {
        console.log('this runs first');
      },
      script: () => {
        console.log('this runs third');
      },
      style: () => {
        console.log('this runs fifth');
      },
    },
    {
      markup: () => {
        console.log('this runs second');
      },
      script: () => {
        console.log('this runs fourth');
      },
      style: () => {
        console.log('this runs sixth');
      },
    },
  ],
  {
    filename: 'App.svelte',
  },
);
```
