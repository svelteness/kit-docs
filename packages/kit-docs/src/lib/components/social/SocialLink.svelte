<script lang="ts">
  import clsx from 'clsx';

  import DiscordIcon from '~icons/ri/discord-fill';
  import GitHubIcon from '~icons/ri/github-fill';
  import TwitterIcon from '~icons/ri/twitter-fill';

  import { uppercaseFirstLetter } from '$utils/string';

  export let type: 'discord' | 'gitHub' | 'twitter';
  export let iconWidth = 28;
  export let iconHeight = 28;
  export let href: string;

  const icons = {
    discord: DiscordIcon,
    gitHub: GitHubIcon,
    twitter: TwitterIcon,
  };

  $: title = uppercaseFirstLetter(type);
</script>

<a class="relative flex items-center text-gray-soft hover:text-gray-inverse" {href} target="_blank">
  <svelte:component
    this={icons[type]}
    class={clsx($$slots.default && 'mr-2.5')}
    width={iconWidth}
    height={iconHeight}
  />
  <span class="sr-only">{title}</span>
  <slot />
</a>
