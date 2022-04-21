<script lang="ts">
  import MoonIcon from '~icons/ri/moon-clear-fill';
  import SunIcon from '~icons/ri/sun-fill';
  import SettingsIcon from '~icons/ri/settings-2-fill';

  import Menu from '$lib/components/base/Menu.svelte';
  import MenuItem from '$lib/components/base/MenuItem.svelte';
  import { colorScheme, colorSchemes, isDarkColorScheme } from '$lib/stores/colorScheme';
  import { getI18nContext } from '../layout/contexts';

  const buttonIcon = {
    light: SunIcon,
    dark: MoonIcon,
    system: $isDarkColorScheme ? MoonIcon : SunIcon,
  };

  const menuIcon = {
    ...buttonIcon,
    system: SettingsIcon,
  };

  const i18n = getI18nContext();
</script>

<Menu>
  <svelte:fragment slot="button">
    <svelte:component this={buttonIcon[$colorScheme]} class={'h-6 w-6'} />
    <span class="sr-only">{$i18n.colorScheme.title}</span>
  </svelte:fragment>

  {#each colorSchemes as scheme (scheme)}
    <MenuItem selected={$colorScheme === scheme} on:select={() => ($colorScheme = scheme)}>
      <svelte:component this={menuIcon[scheme]} slot="icon" />
      {$i18n.colorScheme[scheme]}
    </MenuItem>
  {/each}
</Menu>
