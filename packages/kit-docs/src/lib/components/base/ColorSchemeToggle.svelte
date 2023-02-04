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
  class="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 transform-gpu rounded-md border-0 transition-transform hover:scale-[1.1]"
  on:pointerup={onPointerUp}
>
  {#if !$isDarkColorScheme}
    <SunIcon width="20" height="20" />
  {:else}
    <MoonIcon width="20" height="20" />
  {/if}

  <span class="sr-only">{$i18n.colorScheme.title}</span>
</button>
