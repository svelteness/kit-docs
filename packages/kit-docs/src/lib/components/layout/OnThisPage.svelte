<script lang="ts">
  import { kitDocs, type MarkdownHeader } from '$lib/stores/kit-docs';
  import clsx from 'clsx';
  import RightArrowIcon from '~icons/ri/arrow-drop-right-line';
  import { useActiveHeaderLinks } from './active-header';
  import { getI18nContext, getNavigationContext } from './contexts';

  let __class = '';
  export { __class as class };

  export let style = '';

  const nav = getNavigationContext();
  const i18n = getI18nContext();
  const index = useActiveHeaderLinks(nav);

  let headings: (MarkdownHeader & { children: MarkdownHeader[] })[] = [];

  $: {
    headings = [];
    const currentHeadings = ($kitDocs.meta?.headers ?? []).filter(({ level }) => level > 1);
    for (const heading of currentHeadings) {
      const header: any = { ...heading, children: [] };
      headings.push(header);
      if (heading.children) {
        for (const child of heading.children) {
          header.children.push(child);
        }
      }
    }
  }

  function calcIndex(header: MarkdownHeader) {
    let sum = 0;

    for (let i = 0; i < headings.length; i++) {
      if (headings[i] === header) return sum;
      sum += 1 + headings[i].children.length;
    }

    return sum;
  }
</script>

<div class={clsx('on-this-page scrollbar', __class)} {style}>
  {#if headings.length > 1 || headings[0]?.children.length}
    <h5 class="text-inverse w-full text-start text-lg font-semibold">{$i18n.toc.title}</h5>
    <ul class="mt-4 space-y-4 px-2">
      {#each headings as heading (heading)}
        {@const i = calcIndex(heading)}
        {@const activeParent =
          i === $index || heading.children.some((_, j) => i + j + 1 === $index)}

        <li class={clsx(activeParent ? 'text-brand' : 'text-soft hover:text-inverse')}>
          <a href={`#${heading.slug}`}>{heading.title}</a>
        </li>

        {#if heading.children.length > 0}
          <ul class="space-y-3">
            {#each heading.children as childHeader, j (childHeader)}
              <li
                class={clsx(
                  'group group flex items-center',
                  i + j + 1 === $index ? 'text-brand' : 'text-soft hover:text-inverse',
                )}
              >
                <RightArrowIcon
                  viewBox="0 0 24 20"
                  width="20"
                  height="20"
                  class="group-hover:text-inverse inline-block mt-px me-px text-soft rtl:scale-x-[-1]"
                />
                <a class="inline-block" href={`#${childHeader.slug}`}>{childHeader.title}</a>
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
    </ul>
  {/if}
</div>
