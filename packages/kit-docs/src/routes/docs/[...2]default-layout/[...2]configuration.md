---
description: Configuring the default layout.
---

# Configuration

In this section, we'll look at how you can further customize and configure the default layout.

## CSS Variables

By default, we provide CSS variables which let you focus on simply setting your brand color.
You can set all the variables yourself like so:

1. First, replace the `vars.css` import from your docs layout file with your own CSS file:

```diff title=routes/docs/__layout.svelte
-   import '@svelteness/kit-docs/client/styles/vars.css';
+   import '$lib/styles/kit-docs.css';
```

2. Finally, copy the [CSS variables](https://github.com/svelteness/kit-docs/blob/main/packages/kit-docs/src/lib/styles/vars.css)
   from GitHub and paste them in your `kit-docs.css` file.

## Fonts

By default, we use the [Inter](https://fonts.google.com/specimen/Inter) font but you can provide
your own like so:

1. First, remove the fonts folder if you added it during installation:

```bash copy
rm -rf src/fonts
```

2. Finally, load your own fonts (see our [fonts file](https://github.com/svelteness/kit-docs/blob/main/packages/kit-docs/src/lib/styles/fonts.css)
   for reference) and set the font family CSS variables like so:

```html
<style>
  :global(:root) {
    --kd-color-brand-rgb: 233, 127, 6;
    --kd-font-family-sans: /** Your sans fonts here. */ ;
    --kd-font-family-mono: /** Your mono fonts here. */ ;
  }
</style>
```

### Change Directory

By default, the fonts directory is set to `src/fonts`. You can change the location by setting
a new alias like so:

```js title=vite.config.js|copySteps{1,6}
import { resolve } from 'path';

export default {
  resolve: {
    alias: {
      $fonts: resolve(process.cwd(), 'src/fonts'),
    },
  },
};
```

## Language (I18N)

You can translate any words used in the layout like so:

```svelte
<script>
const i18n = {
  nav: {
    previous: 'Previous',
    next: 'Next',
    // ...
  },
  // ...
}
</script>

<KitDocsLayout {i18n} />
```

You can find all our default [translations on GitHub](https://github.com/svelteness/kit-docs/blob/main/packages/kit-docs/src/lib/components/layout/contexts.ts#L253).

## Navbar

### Disable

```svelte
<!-- Disable the navbar. -->
<KitDocsLayout navbar={false}>
  <slot />
</KitDocsLayout>
```

Set the `scroll-padding-top` CSS variable if you're providing your own navbar so headings are
positioned correctly when loading URL's with a hash:

```css copy
:root {
  /* usually navbar height + some breathing room. */
  scroll-padding-top: 8rem;
}
```

### Slots

```svelte
<KitDocsLayout>
  <div slot="navbar-left" />
  <div slot="navbar-right" />
  <div slot="navbar-right-alt" />
  <div slot="navbar-bottom" />
  <!-- Navbar items are inside popover on mobile. -->
  <div slot="navbar-popover-top" />
  <div slot="navbar-popover-middle" />
  <div slot="navbar-popover-options" />
  <div slot="navbar-popover-bottom" />
</KitDocsLayout>
```

### Links

```svelte copyHighlight{2-5}
<script>
  /** @type {import('@svelteness/kit-docs').NavbarConfig} */
  const navbar = {
    links: [{ title: 'Documentation', slug: '/docs', match: /\/docs/ }],
  };
</script>

<KitDocsLayout {navbar}>
  <slot />
</KitDocsLayout>
```

### Context

```svelte copy
<script>
  import { getNavbarContext } from '@svelteness/kit-docs';

  const navbar = getNavbarContext();

  $: links = $navbar.links
</script>
```

## Sidebar

### Slots

```svelte
<KitDocsLayout>
  <div slot="sidebar-top" />
  <div slot="sidebar-bottom" />
</KitDocsLayout>
```

### Links

```svelte copyHighlight{2-12}
<script>
  /** @type {import('@svelteness/kit-docs').SidebarConfig} */
  const sidebar = {
    links: {
      'First Category': [
        { title: 'First Page', slug: '/first-category/first-page' },
      ],
      'Second Category': [
        // ...
      ]
    }
  };
</script>

<KitDocsLayout {sidebar}>
  <slot />
</KitDocsLayout>
```

### Simple Links

You can also create a sidebar using shorthand like so:

```svelte copy
<script>
  /** @type {import('@svelteness/kit-docs').SidebarConfig} */
  const sidebar = {
    baseUrl: '/docs',
    links: {
      'first-category': ['first-page', 'second-page'],
      'second-category': [],
      // ...
    }
  };
</script>
```

The config above will be resolved to this:

```js
const sidebar = {
  links: {
    'First Category': [
      { title: 'First Page', slug: '/docs/first-category/first-page' },
      { title: 'Second Page', slug: '/docs/second-category/second-page' },
    ],
    'Second Category': [],
  },
};
```

### Icons

See [unplugin-icons](https://github.com/antfu/unplugin-icons) for how to load and use icons.

```svelte copy
<script>
  import ExperimentalIcon from '~icons/ri/test-tube-fill';

  /** @type {import('@svelteness/kit-docs').SidebarConfig} */
  const sidebar = {
    links: {
      'First Category': [{
          title: 'First Page',
          slug: '/first-category/first-page',
          icons: { before: ExperimentalIcon, after: null }
      }],
    },
  };
</script>
```

### Context

```svelte copy
<script>
  import { getSidebarContext } from '@svelteness/kit-docs';

  // All context values are stores (use `$` prefix).
  const {
    allLinks,
    activeLink,
    previousLink,
    nextLink,
    activeCategory,
  } = getSidebarContext();
</script>
```

## Content

### Slots

```svelte
<KitDocsLayout>
  <div slot="main-top" />
  <div slot="main-bottom" />
</KitDocsLayout>
```
