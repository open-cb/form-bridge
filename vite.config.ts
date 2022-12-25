import glob from 'glob';
import { extname, relative, resolve } from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts()
  ],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'form-bridge',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-hook-form',
        'lodash-es/get',
        'lodash-es/pick',
        'lodash-es/omit',
        'lodash-es/set',
        'lodash-es/unset',
        'lodash-es/merge',
        '@hookform/devtools',
      ],
      input: Object.fromEntries(
        glob.sync('src/**/*.{ts,tsx}').map(file => !file.includes('@types') ? [
          relative('src', file.slice(0, file.length - extname(file).length)),
          fileURLToPath(new URL(file, import.meta.url)),
        ] : undefined).filter(Boolean),
      ),
      output: {
        entryFileNames: '[name].js',
        globals: {
          react: 'react',
          'react-hook-form': 'react-hook-form',
        },
      },
    },
  },
});
