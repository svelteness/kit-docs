import adapter from '@sveltejs/adapter-auto';
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
      resolve: {
        alias: {
          $fonts: resolve(process.cwd(), 'src/fonts'),
          $img: resolve(process.cwd(), 'src/img'),
          $kitDocs: resolve(process.cwd(), 'src/kit-docs'),
        },
      },

      plugins: [
        Icons({ compiler: 'svelte' }),
        kitDocsPlugin({
          shiki: {
            theme: 'material-ocean',
          },
        }),
      ],
    },
  },
};

export default config;
