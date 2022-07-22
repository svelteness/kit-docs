<div style="max-width: 992px; margin: 0 auto;">

# Welcome to KitDocs

This your home page. Feel free to change it to a Svelte file by renaming it
to `index@kit-docs.svelte`.

## Redirecting

You might want the home page to be the first page of your documentation. If this is the case,
rename this file to `index.svelte` and replace the content of this file with the following:

```svelte copy
<script context="module">
  export const prerender = true;

  /** @type {import("@sveltejs/kit").Load} */
  export function load() {
    return {
      status: 307,
      redirect: '/docs',
    };
  }
</script>
```

</div>
