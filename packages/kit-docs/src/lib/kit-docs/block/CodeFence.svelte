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
    'code-fence 576:max-h-[32rem] relative my-8 mx-auto max-h-[60vh] overflow-y-auto rounded-md',
    'prefers-dark-scheme scrollbar scroll-contain shadow-xl border-border border',
    lang && `lang-${lang}`,
  )}
  style="background-color: var(--kd-code-fence-bg);"
>
  {#if showTopBar}
    <div
      class="code-fence-top-bar sticky top-0 left-0 z-10 flex items-center py-1 pt-2 backdrop-blur backdrop-filter"
      style="background-color: var(--kd-code-fence-top-bar-bg);"
    >
      {#if hasTopbarTitle}
        <span class="code-fence-title ml-3.5 font-mono text-sm text-soft">{topbarTitle}</span>
      {/if}

      <div class="flex-1" />

      {#if showCopyCode}
        <button
          type="button"
          class="mr-2 px-2 py-1 text-soft hover:text-inverse"
          on:click={copyCodeToClipboard}
        >
          <div
            class={clsx(
              'absolute top-2.5 right-4 z-10 rounded-md px-2 py-1 font-mono text-sm transition-opacity duration-300 ease-out',
              showCopiedCodePrompt ? 'opacity-100' : 'hidden opacity-0',
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
                ? 'opacity-0'
                : 'duration-600 opacity-100 transition-opacity ease-in',
            )}
          />
          <span class="sr-only">Copy</span>
        </button>
      {/if}
    </div>
  {/if}

  <div class="code relative z-0 overflow-hidden">
    <div class={clsx(showLineNumbers && '992:pl-10')}>
      <pre
        class={clsx(
          'relative scrollbar overflow-scroll',
          showLineNumbers && lines.length >= 100 ? 'pl-6' : 'pl-3',
        )}>
        {@html code
          ?.replace(/^<pre(.*?)>/, '')
          .replace(/<\/pre(.*?)>$/, '')
          .trim()}
      </pre>
    </div>

    {#if showLineNumbers}
      <pre
        class="992:flex absolute top-3.5 left-0 m-0 hidden flex-col text-sm leading-[27px]"
        style="border-radius: 0; padding-top: 0;">
			  <div
          class="992:block hidden flex-none select-none text-right text-soft"
          aria-hidden="true">{lines.join('\n')}</div>
		  </pre>
    {/if}

    {#if currentHighlightedLines.length > 0}
      <div
        class="pointer-events-none absolute inset-0 mt-[0.7em] h-full w-full leading-[27px]"
        aria-hidden="true"
      >
        {#each lines as lineNumber}
          {#if isHighlightLine(lineNumber, currentHighlightedLines)}
            <div
              class="w-full border-l-[5px] font-mono text-transparent"
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
