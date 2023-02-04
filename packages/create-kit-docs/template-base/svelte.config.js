import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  kit: {
    adapter: adapter(),

    prerender: {
      default: true,
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
