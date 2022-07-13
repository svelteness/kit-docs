import { sveltekit } from '@sveltejs/kit/vite';
import kitDocs from '@svelteness/kit-docs/node';
import { resolve } from 'path';
import icons from 'unplugin-icons/vite';

/** @type {import('vite').UserConfig} */
const config = {
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
    icons({ compiler: 'svelte' }),
    kitDocs({
      markdown: {
        shiki: {
          theme: 'material-ocean',
        },
      },
    }),
    sveltekit(),
  ],
};

export default config;
