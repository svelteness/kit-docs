<script lang="ts">
  import clsx from 'clsx';

  export let open = false;
</script>

<div
  class={clsx(
    'kd-pointer-events-auto kd-fixed kd-top-0 kd-left-0 kd-z-40 kd-backdrop-blur-sm kd-backdrop-filter kd-transition-opacity kd-duration-75',
    'kd-bg-body/20 dark:kd-bg-body/60',
    'kd-h-screen kd-w-screen',
    open ? 'kd-visible kd-opacity-100' : 'kd-invisible kd-opacity-0',
  )}
/>
