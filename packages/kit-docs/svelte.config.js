import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    prerender: {
      entries: ['*'],
      handleMissingId: 'warn',
    },
  },

  package: {
    dir: 'client',
    emitTypes: true,
  },
};

export default config;
