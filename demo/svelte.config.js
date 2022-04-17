import adapter from '@sveltejs/adapter-static';
import { kitDocsPlugin } from '@svelteness/kit-docs/node';
import { resolve } from 'path';
import Icons from 'unplugin-icons/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  kit: {
    adapter: adapter(),

    prerender: {
      default: true,
      entries: ['*'],
    },

    vite: {
      plugins: [Icons({ compiler: 'svelte' }), kitDocsPlugin()],
    },
  },
};

export default config;
