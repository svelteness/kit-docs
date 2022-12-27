---
description: Working with Markdown files and Svelte components.
---

# Components

In this section, we'll look at how you can work with Markdown files and how you can use Svelte
components inside of them.

## Markdown Files

Markdown files are just Svelte components. You can use them to create layouts `__layout.md`, or
break large Markdown files into multiple components and import them like so:

```svelte title=Component.md
<script>
import Section from './Section.md';
</script>

# Quickstart

...

## Section

<Section />
```

The only difference between a Markdown file and Svelte component is that you can use top-level
tags such as `<script>`, `<script context="module">`, and `<style>` multiple times.

:::yes
The following is valid because KitDocs will merge top-level tags:
:::

```svelte title=Component.md
<script>
// ...
</script>

<script>
// ...
</script>
```

### Frontmatter Store

We'll import the `frontmatter` store for you so you can use it directly in your Markdown files like
so:

```md
---
title: Page Title
description: Page description.
---

# {$frontmatter.title}

{$frontmatter.description}
```

## Global Components

You can create Svelte components that are global, meaning they're imported into every single
Markdown file. In addition, global components are automatically mapped to Markdown containers,
on which you can pass in props and dynamic slot elements.

First, create a component in the global markdown components directory:

```
src
└─ kit-docs
   ├─ Button.svelte <-
```

Now, inside your markdown files you can use the `<Button>` component like so:

```svelte title=Component.md
<!-- Use the component as-is. -->
<Button />

<!-- Or, use a markdown container. -->
:::button propA="valueA"|propB=10
Default slot content here.
:::

<!-- You can pass in dynamic slot elements! -->
<!-- If you omit `tag`, it'll default to `<p>`. -->
:::button (tag=h1&slot=title)=Title
Default slot content here.
:::
```

### Configuration

You can configure how global Svelte components are mapped to rules or containers by setting
them in your plugin like so:

```js title=svelte.config.js
kitDocsPlugin({
  markdown: {
    components: [
      // Override inline rule.
      // `Image.svelte` must be a global component.
      { name: 'Image', type: 'inline', rule: 'image' },
      // Override block rule.
      // `Blockquote.svelte` must be a global component.
      { name: 'Blockquote', type: 'block', rule: 'blockquote' },
      // Create custom container.
      // `Button.svelte` must be a global component.
      { name: 'Button', type: 'custom', container: { marker: '!' } },
    ],
  },
});
```

The configuration above will transform the following Markdown like so:

```md
![alt text](https://...)

> This is a blockquote.

!!!button
...
!!!
```

```svelte
<Image href="https://..." alt="alt text" />

<Blockquote>
  This is a blockquote.
</Blockquote>

<Button>
  ...
</Button>
```

### Change Directory

By default, the global components directory is set to `src/kit-docs`. You can change it in
your plugin settings like so:

```js title=svelte.config.js
kitDocsPlugin({
  markdown: {
    globalComponents: 'src/kit-docs/**/[^_]*.svelte',
  },
});
```

## Default Components

There's a few components we provide out of the box such as `CodeFence`, `CodeInline`, `Link` and
others. You can find all of our [default components](https://github.com/svelteness/kit-docs/tree/main/packages/kit-docs/src/lib/kit-docs)
on GitHub.

### Overriding

If you want to override any of the default components, simply create a Svelte component with the
same name in your global folder and make sure it accepts the same props.

For example, you can override `CodeFence` by creating it in the global directory like so:

```
src
└─ kit-docs
   ├─ CodeFence.svelte <-
```

Finally, you can use the following minimal boilerplate and style the component as desired.

```svelte title=CodeFence.svelte|copy
<script>
  /** @type {string} */
  export let lang;
  /** @type {string} */
  export let ext;
  /** @type {string} */
  export let code;
  /** @type {number} */
  export let linesCount;
  /** @type {[number, number][]} */
  export let highlightLines = [];
</script>

<div class={`lang-${lang} ext-${ext}`}>
  {@html code}
</div>
```
