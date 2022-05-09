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
  export let showCopyCode = false;
  export let copyHighlightOnly = false;
  export let copySteps = false;

  const i18n = getI18nContext();

  let currentStep = 1;
  let stepHighlightLines = [];

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
              .split('\n')
              .filter((_, i) => isHighlightLine(i + 1))
              .join('\n')
          : unescapedRawCode;

      await navigator.clipboard.writeText(copiedCode);
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
    'code-fence overflow-y-auto relative max-h-[60vh] 576:max-h-[32rem] my-8 rounded-md shadow-lg mx-auto',
    'border border-gray-divider',
    lang && `lang-${lang}`,
    ext && `ext-${ext}`,
  )}
  style="background-color: var(--kd-code-fence-bg);"
>
  {#if showTopBar}
    <div
      class="sticky top-0 left-0 z-10 flex items-center rounded-md pt-2 backdrop-blur supports-backdrop-blur:bg-white/60"
      style="background-color: var(--kd-code-fence-top-bar-bg);"
    >
      {#if hasTopbarTitle}
        <span class="ml-3.5 font-mono text-sm text-gray-300">{topbarTitle}</span>
      {/if}

      <div class="flex-1" />

      {#if showCopyCode}
        <button
          type="button"
          class="mr-2 px-2 py-1 hover:text-white"
          on:click={copyCodeToClipboard}
        >
          <div
            class={clsx(
              'text-white absolute top-2.5 right-4 transition-opacity z-10 duration-300 px-2 py-1 rounded-md ease-out text-sm font-mono',
              showCopiedCodePrompt ? 'opacity-100' : 'hidden opacity-0',
            )}
            aria-hidden="true"
            style="background-color: var(--kd-code-copied-bg-color);"
          >
            {$i18n.code.copied}
          </div>

          <CopyFileIcon
            width="24"
            height="24"
            class={clsx(
              showCopiedCodePrompt
                ? 'opacity-0'
                : 'opacity-100 transition-opacity duration-600 ease-in',
            )}
          />
          <span class="sr-only">{$i18n.code.copy}</span>
        </button>
      {/if}
    </div>
  {/if}

  <div class="code relative z-0 overflow-hidden">
    <div class={clsx(showLineNumbers && 'pl-10')}>
      {@html code}
    </div>

    {#if showLineNumbers}
      <pre
        class="absolute top-3.5 left-0 m-0 flex flex-col text-sm leading-[27px]"
        style="background-color: transparent; border-radius: 0; padding-top: 0;">
			<div
          class="hidden flex-none select-none text-right text-slate-600 992:block"
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
