import adapter from '@sveltejs/adapter-auto';
import path from 'path';
import * as preprocess from 'svelte-preprocess';

import { kitDocsPlugin } from './node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  // @ts-expect-error - CJS -> ESM conversion.
  preprocess: [preprocess.default.typescript()],

  kit: {
    adapter: adapter(),

    package: {
      dir: 'client',
      emitTypes: true,
    },

    vite: {
      resolve: {
        alias: {
          $actions: path.resolve('./src/lib/actions'),
          $components: path.resolve('./src/lib/components'),
          $stores: path.resolve('./src/lib/stores'),
          $utils: path.resolve('./src/lib/utils'),
        },
      },
      plugins: [kitDocsPlugin()],
    },
  },
};

export default config;
