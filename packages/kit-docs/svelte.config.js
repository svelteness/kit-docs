import adapter from '@sveltejs/adapter-auto';
import * as preprocess from 'svelte-preprocess';

import { kitDocsPlugin } from './node/index.js';

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
      plugins: [kitDocsPlugin()],
    },
  },
};

export default config;
