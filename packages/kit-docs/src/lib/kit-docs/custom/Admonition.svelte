<script lang="ts">
  import clsx from 'clsx';

  import NoteIcon from '~icons/ri/sticky-note-fill';
  import InfoIcon from '~icons/ri/information-fill';
  import TipIcon from '~icons/ri/lightbulb-flash-fill';
  import WarningIcon from '~icons/ri/error-warning-fill';
  import DangerIcon from '~icons/ri/skull-2-fill';
  import ExperimentalIcon from '~icons/ri/test-tube-fill';
  import { getI18nContext } from '$lib/components/layout/contexts';

  export let type: 'note' | 'info' | 'tip' | 'warning' | 'danger' | 'experimental';
  export let title: string | null = null;

  const i18n = getI18nContext();

  const icons = {
    note: NoteIcon,
    info: InfoIcon,
    tip: TipIcon,
    warning: WarningIcon,
    danger: DangerIcon,
    experimental: ExperimentalIcon,
  };

  $: heading = title ?? $i18n.admonition[type];
</script>

<div
  class={clsx(
    'admonition kd-bg-elevate kd-my-8 kd-mx-auto kd-rounded-md kd-border-2 kd-border-l-8 kd-p-4',
    type === 'note' && 'kd-border-pink-600 dark:kd-border-pink-400',
    type === 'info' && 'kd-border-blue-600 dark:kd-border-blue-400',
    type === 'tip' && 'kd-border-green-600 dark:kd-border-green-400',
    type === 'warning' && 'kd-border-yellow-600 dark:kd-border-yellow-400',
    type === 'danger' && 'kd-border-red-600 dark:kd-border-red-400',
    type === 'experimental' && 'kd-border-indigo-600 dark:kd-border-indigo-400',
  )}
>
  <div
    class={clsx(
      'kd-flex kd-h-full kd-items-center kd-font-bold',
      type === 'note' && 'kd-text-pink-600 dark:kd-text-pink-400',
      type === 'info' && 'kd-text-blue-600 dark:kd-text-blue-400',
      type === 'tip' && 'kd-text-green-600 dark:kd-text-green-400',
      type === 'warning' && 'kd-text-yellow-600 dark:kd-text-yellow-400',
      type === 'danger' && 'kd-text-red-600 dark:kd-text-red-400',
      type === 'experimental' && 'kd-text-indigo-600 dark:kd-text-indigo-400',
    )}
  >
    <svelte:component this={icons[type]} class="kd-mr-1.5 kd-text-xl" />
    <span class="kd-flex kd-items-center">
      {heading}
    </span>
  </div>

  <div class="kd-text-inverse kd-pl-1 kd-text-lg">
    <slot />
  </div>
</div>
