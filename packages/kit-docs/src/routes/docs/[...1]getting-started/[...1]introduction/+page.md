---
description: Introduction to KitDocs.
---

# Introduction

KitDocs makes it easy to build a documentation site with [SvelteKit](https://kit.svelte.dev/docs).
You can think of it as a [VitePress](https://vitepress.vuejs.org) alternative for
[Sveltalowdas](https://twitter.com/sveltejs/status/1226662581449953280) (i.e., the people of Svelte).

Here's a list of everything it has to offer:

- :memo: Vite plugin for transforming Markdown files to Svelte components with HMR support.
- :satellite: Loaders and endpoint handlers for loading Markdown metadata (i.e., title, frontmatter, etc.),
  and sidebar configurations.
- :art: Beautiful pre-designed theme that's inspired by the [Tailwind docs](https://tailwindcss.com/docs/installation).
- :wheelchair: Accessible menus and popovers with full keyboard support, which are included
  in the default theme and also exported for your convenience.
- :earth_americas: Global components folder that's imported into all Markdown files
  and also mapped to custom containers (e.g., `Button.svelte` -> `:::button`).
- :jigsaw: Markdown extensions for header anchors, file links, YAML frontmatter, emojis, custom
  containers, table of contents, code fences, and importing code snippets.
- :framed_picture: Beautiful syntax highlighting with [Shiki](https://shiki.matsu.io). This
  includes pre-designed code blocks that support titles, line highlighting, copy code button and a
  few other goodies.
- :building_construction: Prebuilt Markdown components for steps, admonitions (i.e., callouts),
  tabbed links, responsive tables, and yes/no blocks.
- :mag_right: Algolia search integration that includes a clean default design.

## Demos

- This site is built with KitDocs.
- We rebuilt the [Svelte docs](https://kit-docs-demo.vercel.app) with KitDocs for fun.
- [Vidstack Player docs](https://www.vidstack.io/docs/player) uses all of KitDocs' features.
