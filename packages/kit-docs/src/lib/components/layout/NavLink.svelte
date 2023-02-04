<script lang="ts">
  import { page } from '$app/stores';
  import { isNull } from '$lib/utils/unit';
  import { prefetchLink } from '$lib/actions/prefetch-link';

  export let title: string;
  export let slug: string;
  export let match: RegExp | null = null;
</script>

<li class="mt-4 first:mt-0 992:mt-0">
  <a
    class="text-soft text-base hover:font-medium font-base hover:underline hover:text-brand"
    href={slug}
    target={isNull(match) ? '_blank' : null}
    use:prefetchLink
  >
    {title}
  </a>
</li>
