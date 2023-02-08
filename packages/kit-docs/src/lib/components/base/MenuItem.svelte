<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';

  import { wasEnterKeyPressed } from '$lib/utils/keyboard';

  const dispatch = createEventDispatcher();

  export let selected = false;

  function onSelect(event: KeyboardEvent) {
    if (wasEnterKeyPressed(event)) {
      event.stopPropagation();
      dispatch('select');
    }
  }
</script>

<li
  class={clsx(
    'kd-duration-100 kd-flex kd-items-center kd-px-4 kd-py-2 kd-text-base kd-transition-colors hover:kd-cursor-pointer',
    selected ? 'kd-text-brand' : 'kd-text-soft hover:kd-text-inverse focus-visible:kd-text-inverse',
  )}
  role="menuitem"
  tabindex="-1"
  on:keydown={onSelect}
  on:pointerup={() => dispatch('select')}
>
  {#if $$slots.icon}
    <div class="kd-mr-3 kd-h-5 kd-w-5">
      <slot name="icon" />
    </div>
  {/if}

  <slot />
</li>
