<script lang="ts">
  import { isUndefined } from '$lib/utils/unit';

  import clsx from 'clsx';

  export let primary = false;
  export let type: 'flat' | 'raised' = 'flat';
  export let arrow: 'left' | 'right' | null = null;

  let __as: 'button' | 'a' = 'button';
  export { __as as as };

  let __class = '';
  export { __class as class };

  $: isButton = __as === 'button' && isUndefined($$restProps['href']);

  $: buttonClass = clsx(
    'group kd-transform-gpu kd-text-base kd-font-medium kd-transition-transform hover:kd-scale-105',
    type === 'raised' && 'kd-flex kd-items-center kd-justify-center',
    (isButton || type === 'raised') && 'kd-rounded-md kd-px-4 992:kd-px-5 kd-py-2',
    type === 'raised'
      ? primary
        ? 'kd-bg-inverse kd-text-body hover:kd-bg-inverse/90'
        : 'kd-bg-body kd-border-2 kd-border-inverse kd-text-inverse'
      : 'kd-text-soft hover:kd-text-inverse',
    __class,
  );

  $: contentClass = clsx(
    'kd-inline-block kd-transform kd-transition-transform kd-duration-100 group-hover:kd-translate-x-0',
    arrow === 'left' && 'kd--translate-x-3 ',
    arrow === 'right' && 'kd-translate-x-2',
  );

  $: arrowClass = clsx(
    arrow &&
      'kd-opacity-0 kd-transition-opacity kd-duration-100 group-hover:kd-visible group-hover:kd-opacity-100',
    !arrow ? 'kd-hidden' : 'kd-inline-block',
  );
</script>

{#if isButton}
  <button class={buttonClass} {...$$restProps}>
    {#if arrow === 'left'}
      <span class={arrowClass}>&lt;-</span>
    {/if}
    <span class={contentClass}><slot /></span>
    {#if arrow === 'right'}
      <span class={arrowClass}>-></span>
    {/if}
  </button>
{:else}
  <!-- svelte-ignore a11y-missing-attribute -->
  <a class={buttonClass} {...$$restProps}>
    {#if arrow === 'left'}
      <span class={arrowClass}>&lt;-</span>
    {/if}
    <span class={contentClass}><slot /></span>
    {#if arrow === 'right'}
      <span class={arrowClass}>-></span>
    {/if}
  </a>
{/if}
