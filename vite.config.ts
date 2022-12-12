import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'react-forms',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-hook-form'],
      output: {
        manualChunks: {
          lodash: ['lodash-es'],
        },
        globals: {
          react: 'react',
          'react-hook-form': 'react-hook-form',
        },
      },
    },
  },
});
