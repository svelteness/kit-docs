<script lang="ts">
  import { getI18nContext } from '$lib/components/layout/contexts';

  import clsx from 'clsx';

  import CopyFileIcon from '~icons/ri/file-copy-line';

  export let lang: string | null = null;
  export let ext: string | null = null;
  export let code: string | null = null;
  export let rawCode: string | null = null;
  export let title: string | null = null;
  export let linesCount: number = (code?.match(/"line"/g) || []).length;
  export let showLineNumbers = false;
  export let highlightLines: [number, number][] = [];
  export let copyHighlightOnly = false;
  export let copySteps = false;
  export let showCopyCode = copySteps || copyHighlightOnly;

  const i18n = getI18nContext();

  let currentStep = 1;
  let stepHighlightLines: [number, number][] = [];

  $: if (copySteps) {
    stepHighlightLines = [highlightLines[currentStep - 1] ?? [currentStep, currentStep]];
  }

  $: currentHighlightedLines = copySteps ? stepHighlightLines : highlightLines;

  const isHighlightLine = (lineNumber: number, _?: any): boolean =>
    currentHighlightedLines.some(([start, end]) => lineNumber >= start && lineNumber <= end);

  // `linesCount-1` since last line is always empty (prettier)
  $: lines = [...Array(linesCount - 1).keys()].map((n) => n + 1);

  $: unescapedRawCode = rawCode?.replace(/&#8203/g, '');

  let showCopiedCodePrompt = false;
  async function copyCodeToClipboard() {
    try {
      const copiedCode =
        currentHighlightedLines.length > 0 && (copyHighlightOnly || copySteps)
          ? unescapedRawCode
              ?.split('\n')
              .filter((_, i) => isHighlightLine(i + 1))
              .join('\n')
          : unescapedRawCode;

      await navigator.clipboard.writeText(copiedCode || '');
    } catch (e) {
      // no-op
    }

    showCopiedCodePrompt = true;
    if (copySteps) {
      const nextStep = currentStep + 1;
      const maxSteps = highlightLines.length > 0 ? highlightLines.length : lines.length;
      currentStep = nextStep > maxSteps ? 1 : nextStep;
    }
  }

  $: if (showCopiedCodePrompt) {
    setTimeout(() => {
      showCopiedCodePrompt = false;
    }, 400);
  }

  $: showTopBar = title || showCopyCode;
  $: hasTopbarTitle = title || ext;
  $: topbarTitle = title ?? (ext === 'sh' ? 'terminal' : ext);
</script>

<div
  class={clsx(
    'code-fence 576:kd-max-h-[32rem] kd-relative kd-my-8 kd-mx-auto max-h-[60vh] kd-overflow-y-auto kd-rounded-md',
    'prefers-dark-scheme scrollbar scroll-contain kd-shadow-xl kd-border-border kd-border',
    lang && `lang-${lang}`,
  )}
  style="background-color: var(--kd-code-fence-bg);"
>
  {#if showTopBar}
    <div
      class="code-fence-top-bar kd-sticky kd-top-0 kd-left-0 kd-z-10 kd-flex kd-items-center kd-py-1 kd-pt-2 kd-backdrop-blur kd-backdrop-filter"
      style="background-color: var(--kd-code-fence-top-bar-bg);"
    >
      {#if hasTopbarTitle}
        <span class="code-fence-title kd-ml-3.5 kd-font-mono kd-text-sm kd-text-soft"
          >{topbarTitle}</span
        >
      {/if}

      <div class="kd-flex-1" />

      {#if showCopyCode}
        <button
          type="button"
          class="kd-mr-2 kd-px-2 kd-py-1 kd-text-soft hover:kd-text-inverse"
          on:click={copyCodeToClipboard}
        >
          <div
            class={clsx(
              'kd-absolute kd-top-2.5 kd-right-4 kd-z-10 kd-rounded-md kd-px-2 kd-py-1 kd-font-mono kd-text-sm kd-transition-opacity kd-duration-300 kd-ease-out',
              showCopiedCodePrompt ? 'kd-opacity-100' : 'kd-hidden kd-opacity-0',
            )}
            aria-hidden="true"
            style="background-color: var(--kd-code-copied-bg-color);"
          >
            Copied
          </div>

          <CopyFileIcon
            width="24"
            height="24"
            class={clsx(
              showCopiedCodePrompt
                ? 'kd-opacity-0'
                : 'duration-600 kd-opacity-100 kd-transition-opacity kd-ease-in',
            )}
          />
          <span class="kd-sr-only">Copy</span>
        </button>
      {/if}
    </div>
  {/if}

  <div class="code kd-relative kd-z-0 kd-overflow-hidden">
    <div class={clsx(showLineNumbers && '992:kd-pl-10')}>
      <pre
        class={clsx(
          'kd-relative scrollbar kd-overflow-scroll',
          showLineNumbers && lines.length >= 100 ? 'kd-pl-6' : 'kd-pl-3',
        )}>
        {@html code
          ?.replace(/^<pre(.*?)>/, '')
          .replace(/<\/pre(.*?)>$/, '')
          .trim()}
      </pre>
    </div>

    {#if showLineNumbers}
      <pre
        class="992:kd-flex kd-absolute kd-top-3.5 kd-left-0 kd-m-0 kd-hidden kd-flex-col kd-text-sm leading-[27px]"
        style="border-radius: 0; padding-top: 0;">
			  <div
          class="992:kd-block kd-hidden kd-flex-none kd-select-none kd-text-right text-soft"
          aria-hidden="true">{lines.join('\n')}</div>
		  </pre>
    {/if}

    {#if currentHighlightedLines.length > 0}
      <div
        class="kd-pointer-events-none kd-absolute kd-inset-0 kd-mt-[0.7em] kd-h-full kd-w-full kd-leading-[27px]"
        aria-hidden="true"
      >
        {#each lines as lineNumber}
          {#if isHighlightLine(lineNumber, currentHighlightedLines)}
            <div
              class="kd-w-full kd-border-l-[5px] kd-font-mono kd-text-transparent"
              style="border-color: var(--kd-code-highlight-border); background-color: var(--kd-code-highlight-color);"
            >
              &nbsp;
            </div>
          {:else}
            <br />
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>
