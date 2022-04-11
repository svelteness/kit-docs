import adapter from '@sveltejs/adapter-auto';
// import adapterStatic from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import Icons from 'unplugin-icons/vite';

import { kitDocsPlugin } from './node/index.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    package: {
      dir: 'client',
      emitTypes: true,
    },

    prerender: {
      default: true,
    },

    vite: {
      plugins: [
        Icons({ compiler: 'svelte' }),
        kitDocsPlugin({
          markdown: {
            shiki: {
              theme: 'material-ocean',
            },
          },
        }),
      ],
    },
  },
};

export default config;
