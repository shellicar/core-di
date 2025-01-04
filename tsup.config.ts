import { defineConfig } from 'tsup';

export default defineConfig((config) => ({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: true,
  treeshake: true,
  dts: true,
  clean: !config.watch,
  minify: config.watch ? false : 'terser',
  keepNames: true,
  bundle: true,
  tsconfig: 'tsconfig.json',
  target: 'node20',
  format: ['esm', 'cjs'],
  outDir: 'dist',
}));