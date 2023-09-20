<script lang="ts">
  import clsx from 'clsx';

  export let cols: 1 | 2 | 3 | 4 = 2;
</script>

<div
  class={clsx(
    'not-prose grid gap-x-4',
    cols === 1 && '576:grid-cols-1',
    cols === 2 && '576:grid-cols-2',
    cols === 3 && '576:grid-cols-3',
    cols === 4 && '576:grid-cols-4',
  )}
>
  <slot />
</div>
