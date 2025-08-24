import cleanPlugin from '@shellicar/build-clean/esbuild';
import { defineConfig, type Options } from 'tsup';

const commonOptions = (config: Options) =>
  ({
    bundle: true,
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    esbuildPlugins: [cleanPlugin({ destructive: true })],
    inject: ['inject.ts'],
    keepNames: true,
    minify: config.watch ? false : 'terser',
    removeNodeProtocol: false,
    sourcemap: true,
    splitting: true,
    target: 'node20',
    treeshake: true,
    tsconfig: 'tsconfig.json',
  }) satisfies Options;

export default defineConfig((config) => [
  {
    ...commonOptions(config),
    format: 'esm',
    outDir: 'dist/esm',
  },
  {
    ...commonOptions(config),
    format: 'cjs',
    outDir: 'dist/cjs',
  },
]);
