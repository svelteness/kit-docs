<script lang="ts">
  import clsx from 'clsx';

  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-fill';

  export let title: string;
  export let options: string[] = [];
  export let value: string = options[0];
  export let disabled = false;
  export let rounded = true;
  export let raised = true;
  export let arrowWidth = 20;
  export let arrowHeight = 20;
</script>

<div class="kd-inline-block">
  <label
    class={clsx(
      'kd-relative kd-flex kd-min-w-[85px] kd-items-center kd-border-[1.5px] kd-pl-2.5 kd-pr-1',
      'kd-bg-elevate kd-transform-gpu kd-transition-transform hover:kd-scale-[1.025]',
      rounded && 'kd-rounded-md',
      raised ? 'kd-py-1' : 'kd-py-0.5',
      disabled
        ? 'kd-text-soft/40'
        : 'kd-text-soft hover:kd-text-inverse focus-within:text-inverse focus-within:kd-ring-2',
    )}
    style="padding: var(--kd-padding, 0.25rem 0.2rem 0.25rem 0.5rem); min-width: var(--kd-min-width, 6rem); --tw-ring-color: rgb(var(--color-focus)); border-color: var(--select-border-color, rgb(var(--kd-color-border)));"
  >
    <slot name="before-title" />

    <div class="kd-mx-auto kd-flex kd-items-center kd-justify-center">
      <span class="kd-sr-only">{title}</span>

      <span
        class="kd-flex kd-items-center kd-h-full kd-mt-0.5"
        style="font-size: var(--kd-value-font-size, 0.875rem);"
      >
        {value}
      </span>

      <ArrowDropDownIcon
        width={arrowWidth}
        height={arrowHeight}
        class="ml-[var(--kd-arrow-margin-left,0.1rem)]"
      />
    </div>

    <select
      class="kd-absolute kd-inset-0 kd-cursor-pointer kd-appearance-none kd-opacity-0"
      bind:value
      on:change
      {disabled}
    >
      {#each options as value (value)}
        <option {value}>{value}</option>
      {/each}
      <slot />
    </select>
  </label>
</div>
