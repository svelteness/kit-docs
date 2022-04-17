import adapter from '@sveltejs/adapter-static';
import { resolve } from 'path';
import * as preprocess from 'svelte-preprocess';
import Icons from 'unplugin-icons/vite';

import { kitDocsPlugin } from './node/index.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  // @ts-ignore
  preprocess: preprocess.default.typescript(),

  kit: {
    adapter: adapter(),

    package: {
      dir: 'client',
      emitTypes: true,
    },

    prerender: {
      default: true,
      entries: ['*'],
    },

    vite: {
      resolve: {
        alias: {
          $fonts: resolve(process.cwd(), 'src/lib/fonts'),
        },
      },

      server: {
        fs: {
          strict: false,
        },
      },

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
