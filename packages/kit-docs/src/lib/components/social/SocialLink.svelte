<script lang="ts">
  import clsx from 'clsx';

  import DiscordIcon from '~icons/ri/discord-fill';
  import GitHubIcon from '~icons/ri/github-fill';
  import TwitterIcon from '~icons/ri/twitter-fill';

  import { uppercaseFirstLetter } from '$lib/utils/string';

  export let type: 'discord' | 'gitHub' | 'twitter';
  export let title = uppercaseFirstLetter(type);
  export let href: string;
  export let iconWidth = 28;
  export let iconHeight = 28;

  let __class = '';
  export { __class as class };

  const icons = {
    discord: DiscordIcon,
    gitHub: GitHubIcon,
    twitter: TwitterIcon,
  };
</script>

<a
  class={clsx(
    'relative flex items-center text-gray-soft hover:text-gray-inverse border-0 rounded-md p-2',
    __class,
  )}
  {href}
  target="_blank"
>
  <svelte:component
    this={icons[type]}
    class={clsx($$slots.default && 'mr-2.5')}
    width={iconWidth}
    height={iconHeight}
  />
  <span class="sr-only">{title}</span>
  <slot />
</a>
