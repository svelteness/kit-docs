/// <reference types="unplugin-icons/types/svelte" />

declare const __KIT_DOCS_HASH_MAP__: Record<string, string>;

declare module '*?highlight' {
  const tokens: string;
  const code: string;
  /** Highlighted code. */
  const hlCode: string;
  export { tokens, code, hlCode };
}

declare module '*.md' {
  import { SvelteComponent } from 'svelte';
  export default SvelteComponent;
}
