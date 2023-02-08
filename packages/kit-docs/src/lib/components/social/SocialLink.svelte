<script lang="ts">
  import clsx from 'clsx';

  import DiscordIcon from '~icons/ri/discord-fill';
  import GitHubIcon from '~icons/ri/github-fill';
  import TwitterIcon from '~icons/ri/twitter-fill';

  import { uppercaseFirstLetter } from '$lib/utils/string';

  export let type: 'discord' | 'gitHub' | 'twitter';
  export let title = uppercaseFirstLetter(type);
  export let href: string;
  export let iconWidth = 24;
  export let iconHeight = 24;

  let __class = '';
  export { __class as class };

  const icons = {
    discord: DiscordIcon,
    gitHub: GitHubIcon,
    twitter: TwitterIcon,
  };
</script>

<!-- svelte-ignore security-anchor-rel-noreferrer -->
<a
  class={clsx(
    'kd-relative kd-flex kd-transform-gpu kd-items-center kd-rounded-md kd-border-0 kd-p-2 kd-transition-transform hover:kd-scale-[1.1]',
    __class,
  )}
  {href}
  target="_blank"
>
  <svelte:component
    this={icons[type]}
    class={clsx($$slots.default && 'kd-mr-2.5')}
    width={iconWidth}
    height={iconHeight}
  />
  <span class="kd-sr-only">{title}</span>
  <slot />
</a>
