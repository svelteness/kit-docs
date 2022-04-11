# Compile

Typically, you won't interact with the Svelte compiler directly, but will instead integrate it into your build system using a bundler plugin. The bundler plugin that the Svelte team most recommends and invests in is [vite-plugin-svelte](https://github.com/sveltejs/vite-plugin-svelte). The [SvelteKit](https://kit.svelte.dev/) framework provides a setup leveraging `vite-plugin-svelte` to build applications as well as a [tool for packaging Svelte component libraries](https://kit.svelte.dev/docs/packaging). Svelte Society maintains a list of [other bundler plugins](https://sveltesociety.dev/tools/#bundling) for additional tools like Rollup and Webpack.

Nonetheless, it's useful to understand how to use the compiler, since bundler plugins generally expose compiler options to you.

## `svelte.compile`

```js
result: {
	js,
	css,
	ast,
	warnings,
	vars,
	stats
} = svelte.compile(source: string, options?: {...})
```

---

This is where the magic happens. `svelte.compile` takes your component source code, and turns it into a JavaScript module that exports a class.

```js
const svelte = require('svelte/compiler');

const result = svelte.compile(source, {
  // options
});
```

The following options can be passed to the compiler. None are required:

| option               | default                                     | description                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filename`           | `null`                                      | `string` used for debugging hints and sourcemaps. Your bundler plugin will set it automatically.                                                                                                                                                                                                                                                                                                                                              |
| `name`               | `"Component"`                               | `string` that sets the name of the resulting JavaScript class (though the compiler will rename it if it would otherwise conflict with other variables in scope). It will normally be inferred from `filename`.                                                                                                                                                                                                                                |
| `format`             | `"esm"`                                     | If `"esm"`, creates a JavaScript module (with `import` and `export`). If `"cjs"`, creates a CommonJS module (with `require` and `module.exports`), which is useful in some server-side rendering situations or for testing.                                                                                                                                                                                                                   |
| `generate`           | `"dom"`                                     | If `"dom"`, Svelte emits a JavaScript class for mounting to the DOM. If `"ssr"`, Svelte emits an object with a `render` method suitable for server-side rendering. If `false`, no JavaScript or CSS is returned; just metadata.                                                                                                                                                                                                               |
| `errorMode`          | `"throw"`                                   | If `"throw"`, Svelte throws when a compilation error occurred. If `"warn"`, Svelte will treat errors as warnings and add them to the warning report.                                                                                                                                                                                                                                                                                          |
| `varsReport`         | `"strict"`                                  | If `"strict"`, Svelte returns a variables report with only variables that are not globals nor internals. If `"full"`, Svelte returns a variables report with all detected variables. If `false`, no variables report is returned.                                                                                                                                                                                                             |
| `dev`                | `false`                                     | If `true`, causes extra code to be added to components that will perform runtime checks and provide debugging information during development.                                                                                                                                                                                                                                                                                                 |
| `immutable`          | `false`                                     | If `true`, tells the compiler that you promise not to mutate any objects. This allows it to be less conservative about checking whether values have changed.                                                                                                                                                                                                                                                                                  |
| `hydratable`         | `false`                                     | If `true` when generating DOM code, enables the `hydrate: true` runtime option, which allows a component to upgrade existing DOM rather than creating new DOM from scratch. When generating SSR code, this adds markers to `<head>` elements so that hydration knows which to replace.                                                                                                                                                        |
| `legacy`             | `false`                                     | If `true`, generates code that will work in IE9 and IE10, which don't support things like `element.dataset`.                                                                                                                                                                                                                                                                                                                                  |
| `accessors`          | `false`                                     | If `true`, getters and setters will be created for the component's props. If `false`, they will only be created for readonly exported values (i.e. those declared with `const`, `class` and `function`). If compiling with `customElement: true` this option defaults to `true`.                                                                                                                                                              |
| `customElement`      | `false`                                     | If `true`, tells the compiler to generate a custom element constructor instead of a regular Svelte component.                                                                                                                                                                                                                                                                                                                                 |
| `tag`                | `null`                                      | A `string` that tells Svelte what tag name to register the custom element with. It must be a lowercase alphanumeric string with at least one hyphen, e.g. `"my-element"`.                                                                                                                                                                                                                                                                     |
| `css`                | `true`                                      | If `true`, styles will be included in the JavaScript class and injected at runtime for the components actually rendered. If `false`, the CSS will be returned in the `css` field of the compilation result. Most Svelte bundler plugins will set this to `false` and use the CSS that is statically generated for better performance, as it will result in smaller JavaScript bundles and the output can be served as cacheable `.css` files. |
| `cssHash`            | See right                                   | A function that takes a `{ hash, css, name, filename }` argument and returns the string that is used as a classname for scoped CSS. It defaults to returning `svelte-${hash(css)}`                                                                                                                                                                                                                                                            |
| `loopGuardTimeout`   | 0                                           | A `number` that tells Svelte to break the loop if it blocks the thread for more than `loopGuardTimeout` ms. This is useful to prevent infinite loops. **Only available when `dev: true`**                                                                                                                                                                                                                                                     |
| `preserveComments`   | `false`                                     | If `true`, your HTML comments will be preserved during server-side rendering. By default, they are stripped out.                                                                                                                                                                                                                                                                                                                              |
| `preserveWhitespace` | `false`                                     | If `true`, whitespace inside and between elements is kept as you typed it, rather than removed or collapsed to a single space where possible.                                                                                                                                                                                                                                                                                                 |
| `sourcemap`          | `object \| string`                          | An initial sourcemap that will be merged into the final output sourcemap. This is usually the preprocessor sourcemap.                                                                                                                                                                                                                                                                                                                         |
| `enableSourcemap`    | `boolean \| { js: boolean; css: boolean; }` | If `true`, Svelte generate sourcemaps for components. Use an object with `js` or `css` for more granular control of sourcemap generation. By default, this is `true`.                                                                                                                                                                                                                                                                         |
| `outputFilename`     | `null`                                      | A `string` used for your JavaScript sourcemap.                                                                                                                                                                                                                                                                                                                                                                                                |
| `cssOutputFilename`  | `null`                                      | A `string` used for your CSS sourcemap.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `sveltePath`         | `"svelte"`                                  | The location of the `svelte` package. Any imports from `svelte` or `svelte/[module]` will be modified accordingly.                                                                                                                                                                                                                                                                                                                            |
| `namespace`          | `"html"`                                    | The namespace of the element; e.g., `"mathml"`, `"svg"`, `"foreign"`.                                                                                                                                                                                                                                                                                                                                                                         |

The returned `result` object contains the code for your component, along with useful bits of metadata.

```js
const { js, css, ast, warnings, vars, stats } = svelte.compile(source);
```

- `js` and `css` are objects with the following properties:
  - `code` is a JavaScript string
  - `map` is a sourcemap with additional `toString()` and `toUrl()` convenience methods
- `ast` is an abstract syntax tree representing the structure of your component.
- `warnings` is an array of warning objects that were generated during compilation. Each warning has several properties:
  - `code` is a string identifying the category of warning
  - `message` describes the issue in human-readable terms
  - `start` and `end`, if the warning relates to a specific location, are objects with `line`, `column` and `character` properties
  - `frame`, if applicable, is a string highlighting the offending code with line numbers
- `vars` is an array of the component's declarations, used by [eslint-plugin-svelte3](https://github.com/sveltejs/eslint-plugin-svelte3) for example. Each variable has several properties:
  - `name` is self-explanatory
  - `export_name` is the name the value is exported as, if it is exported (will match `name` unless you do `export...as`)
  - `injected` is `true` if the declaration is injected by Svelte, rather than in the code you wrote
  - `module` is `true` if the value is declared in a `context="module"` script
  - `mutated` is `true` if the value's properties are assigned to inside the component
  - `reassigned` is `true` if the value is reassigned inside the component
  - `referenced` is `true` if the value is used in the template
  - `referenced_from_script` is `true` if the value is used in the `<script>` outside the declaration
  - `writable` is `true` if the value was declared with `let` or `var` (but not `const`, `class` or `function`)
- `stats` is an object used by the Svelte developer team for diagnosing the compiler. Avoid relying on it to stay the same!
