/// <reference types="unplugin-icons/types/svelte" />

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
