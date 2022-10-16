import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

// https://rodneylab.com/sveltekit-ssg/

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    prerender: {
      entries: ['*'],
    },
  },
  package: {
    dir: 'client',
    emitTypes: true,
  },
};

export default config;
