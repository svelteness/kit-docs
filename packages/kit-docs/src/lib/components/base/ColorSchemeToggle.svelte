<script lang="ts">
  import MoonIcon from '~icons/ri/moon-clear-fill';
  import SunIcon from '~icons/ri/sun-fill';

  import { colorScheme, isDarkColorScheme } from '$lib/stores/color-scheme';
  import { getI18nContext } from '../layout/contexts';

  const i18n = getI18nContext();

  function onPointerUp() {
    $colorScheme = !$isDarkColorScheme ? 'dark' : 'light';
  }
</script>

<button
  class="kd-min-w-[40px] kd-min-h-[40px] kd-flex kd-items-center kd-justify-center kd-p-2 kd-transform-gpu kd-rounded-md kd-border-0 kd-transition-transform hover:kd-scale-[1.1]"
  on:pointerup={onPointerUp}
>
  {#if !$isDarkColorScheme}
    <SunIcon width="20" height="20" />
  {:else}
    <MoonIcon width="20" height="20" />
  {/if}

  <span class="kd-sr-only">{$i18n.colorScheme.title}</span>
</button>
