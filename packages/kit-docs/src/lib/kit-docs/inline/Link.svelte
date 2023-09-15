<script lang="ts">
  import { base } from '$app/paths'

  const { href, ...props } = $$restProps

  function rebase(url: string) {
    return url.startsWith('/')
      ? base + url
      : url
  }
</script>
<!-- svelte-ignore a11y-missing-attribute -->
<a href={rebase(href)} {...props}><slot /></a>