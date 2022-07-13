---
description: Instructions on how to deploy your KitDocs site.
---

# Deploying

The default adapter by SvelteKit will automatically build the correct ouput based on the
deployment environment (i.e., Vercel, Netlify, etc.). Follow the instructions below if you'd like
to configure static deployments.

## Static Builds

```bash copy
npm i @sveltejs/adapter-static -D
```

```diff title=svelte.config.js
- import adapter from '@sveltejs/adapter-auto';
+ import adapter from '@sveltejs/adapter-static';
```

Finally, use the following settings when creating your project with your chosen deployment provider:

- Install Command: `npm i`
- Build Command: `npm run build`
- Output Directory: `build`

### Vercel

Add the following to the root of your project inside a `vercel.json` file:

```json title=vercel.json|copy
{
  "cleanUrls": true
}
```

### Netlify

Add the following to the root of your project inside a `netlify.toml` file:

```toml title=netlify.toml|copy
[build]
  publish = "build/"
  command = "npm run build"

[build.processing.html]
  pretty_urls = true
```
