<script lang="ts" context="module">
  export type TabbedLink = {
    title: string;
    href: string;
  };
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import clsx from 'clsx';

  export let links: TabbedLink[] = [];
</script>

<div class="kd-not-prose kd-mt-10 kd-mb-6 kd-flex kd-overflow-auto kd-p-1">
  <div class="kd-min-w-full kd-flex-none kd-pr-4">
    <ul class="kd-flex kd-space-x-6 kd-whitespace-nowrap kd-border-b kd-border-border">
      {#each links as link (link.title + link.href)}
        {@const isActive = $page.url.pathname === link.href}
        <li>
          <h2>
            <a
              class={clsx(
                'kd--mb-px kd-flex kd-border-current kd-pt-3 kd-pb-2.5 kd-leading-6 kd-px-4 hover:kd-border-b-2',
                isActive
                  ? 'kd-text-brand kd-font-semibold kd-border-b-2'
                  : 'kd-text-soft hover:kd-text-inverse',
              )}
              href={link.href}
              data-sveltekit-prefetch
            >
              {link.title}
            </a>
          </h2>
        </li>
      {/each}
    </ul>
  </div>
</div>
