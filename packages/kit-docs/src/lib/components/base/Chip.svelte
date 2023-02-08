<script>
  import clsx from 'clsx';

  let __class = '';
  export { __class as class };
</script>

<div
  class={clsx(
    'kd-inline-flex kd-h-6 kd-items-centerkd-justify-center kd-px-2.5 kd-py-1 kd-font-mono kd-text-xs kd-font-medium kd-tracking-wide',
    'kd-border-border kd-border',
    __class,
  )}
  style="border-radius: var(--chip-border-radius, 9999px);"
>
  <span class="kd-mt-px">
    <slot />
  </span>
</div>
