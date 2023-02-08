<script lang="ts">
  import clsx from 'clsx';
  import { tick } from 'svelte';
  import { getStepsContext } from './Steps.svelte';

  const { steps, register } = getStepsContext();

  let li: HTMLLIElement;
  let index = register();

  export let title: string | null = null;
  export let description: string | null = null;
  export let orientation: 'horizontal' | 'vertical' = 'horizontal';

  $: if ($steps > 0 && li) {
    tick().then(() => {
      index = Array.from(li.parentElement.children).indexOf(li) + 1;
    });
  }
</script>

<li
  class={clsx(
    'step kd-relative kd-pl-10 1200:kd-grid before:kd-content-[counter(step)] before:kd-absolute',
    'before:kd-left-0 before:kd-flex before:kd-items-center before:kd-justify-center before:kd-w-[calc(1.375rem+1px)]',
    'before:kd-h-[calc(1.375rem+1px)] before:kd-text-[0.7rem] before:kd-font-bold before:kd-text-white dark:before:kd-text-black',
    'before:kd-rounded-md before:kd-shadow-md before:kd-bg before:kd-bg-inverse before:kd-border before:kd-border-soft',
    index !== $steps &&
      'kd-pb-8 after:kd-absolute after:kd-top-[calc(1.875rem+1px)] after:kd-bottom-0 after:kd-left-[0.6875rem] after:kd-w-px after:kd-bg-border',
    orientation === 'horizontal' ? 'kd-grid-cols-5 kd-gap-10' : 'kd-grid-cols-4 kd-gap-4',
  )}
  style="counter-increment: step;"
  bind:this={li}
>
  <div
    class={clsx(
      'kd-mb-6 1200:kd-mb-2',
      orientation === 'horizontal' ? 'kd-col-span-2' : 'kd-col-span-4',
    )}
  >
    <span class="kd-not-prose kd-mb-4 kd-text-base kd-font-semibold kd-leading-7 kd-text-inverse">
      {#if $$slots.title}
        <slot name="title" />
      {:else if title}
        <h3>{title}</h3>
      {/if}
    </span>

    <div class="kd-description kd-text-sm">
      {#if $$slots.description}
        <slot name="description" />
      {:else if description}
        <p>{description}</p>
      {/if}
    </div>
  </div>

  <div class={clsx(orientation === 'horizontal' ? 'kd-col-span-3' : 'kd-col-span-4')}>
    <slot />
  </div>
</li>
