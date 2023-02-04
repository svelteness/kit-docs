<script lang="ts">
  import clsx from 'clsx';
  interface $$Props {
    href?: string;
    title: string;
    description?: string;
  }
  export let href = '';
  export let title = '';
  export let description = '';

  const as = href ? 'a' : 'div';

  $: arrowClass = clsx(
    href &&
      'text-brand transition-all duration-100 opacity-0 group-hover:opacity-100 translate group-hover:translate-x-0 -translate-x-3',
    !href ? 'hidden' : 'inline-block',
  );
</script>

<svelte:element
  this={as}
  class={clsx(
    'block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-lg border border-border overflow-hidden px-6 py-5 w-full',
    href && 'hover:border-brand cursor-pointer',
  )}
  {href}
>
  {#if $$slots['icon']}
    <div class="h-6 w-6 text-brand">
      <slot name="icon" />
    </div>
  {/if}
  <h2 class="font-semibold text-xl dark:text-white mt-4">
    <span>{title}</span>
    {#if href}
      <span class={arrowClass}>-></span>
    {/if}
  </h2>
  {#if description}
    <span class="mt-1 font-normal text-soft">
      <p>{description}</p>
    </span>
  {/if}
</svelte:element>
