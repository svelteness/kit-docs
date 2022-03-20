import adapter from '@sveltejs/adapter-auto';
import * as preprocess from 'svelte-preprocess';
import Icons from 'unplugin-icons/vite';

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
          // ...
        },
      },
      plugins: [Icons({ compiler: 'svelte' })],
    },
  },
};

export default config;
