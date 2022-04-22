<script lang="ts">
  import clsx from 'clsx';

  import RightArrowIcon from '~icons/ri/arrow-drop-right-line';

  import { hasMarkdownHeaders, kitDocs } from '$lib/stores/kitDocs';
  import { page } from '$app/stores';
  import { useActiveHeaderLinks } from './useActiveHeaderLinks';
  import { getI18nContext, getNavigationContext } from './contexts';

  let __class = '';
  export { __class as class };

  export let style = '';

  const nav = getNavigationContext();
  const i18n = getI18nContext();

  useActiveHeaderLinks(nav);
</script>

{#if hasMarkdownHeaders($kitDocs.meta)}
  <div class={clsx('on-this-page', __class)} {style}>
    <h5 class="font-semibold w-full text-left text-gray-inverse text-lg">{$i18n.toc.title}</h5>
    <ul class="space-y-4 mt-4">
      {#each $kitDocs.meta.headers as header (header.slug)}
        <li
          class={clsx(
            $nav.cleanHash($page.url.hash) === `#${header.slug}`
              ? 'text-brand'
              : 'text-gray-soft hover:text-gray-inverse',
          )}
        >
          <a href={`#${header.slug}`}>{header.title}</a>
        </li>
        {#if header.children?.length}
          <ul class="space-y-3">
            {#each header.children as childHeader (childHeader.slug)}
              <li
                class={clsx(
                  'flex group group',
                  $nav.cleanHash($page.url.hash) === `#${childHeader.slug}`
                    ? 'text-brand'
                    : 'text-gray-soft hover:text-gray-inverse',
                )}
              >
                <RightArrowIcon
                  width="20"
                  height="20"
                  class="mr-px mt-px text-gray-300 dark:text-gray-400 group-hover:text-gray-soft"
                />
                <a href={`#${childHeader.slug}`}>{childHeader.title}</a>
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
    </ul>
  </div>
{/if}
