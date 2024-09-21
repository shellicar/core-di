import { defineConfig, type Format } from 'tsup';

const extensions: Partial<Record<Format, string>> = {
  esm: '.mjs',
  cjs: '.cjs',
};

export default defineConfig(() => ({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: true,
  dts: false,
  minify: 'terser',
  keepNames: true,
  bundle: true,
  tsconfig: 'tsconfig.json',
  target: 'node20',
  clean: true,
  format: ['esm', 'cjs'],
  treeshake: true,
  outDir: 'dist',
  outExtension: (ctx) => ({
      js: extensions[ctx.format],
    }),
}));
