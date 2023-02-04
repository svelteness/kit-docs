import { sveltekit } from '@sveltejs/kit/vite';
import kitDocs from '@svelteness/kit-docs/node';
import icons from 'unplugin-icons/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [icons({ compiler: 'svelte' }), kitDocs(), sveltekit()],
  server: {
    watch: {
      usePolling: true,
    },
    fs: {
      strict: false,
    },
  },
};

export default config;
