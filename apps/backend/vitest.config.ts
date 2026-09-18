import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    hookTimeout: 20_000,
  },
  // Nest braucht die Metadaten der Dekoratoren zur Laufzeit. Vitest allein
  // (esbuild) erzeugt sie nicht, SWC schon.
  plugins: [swc.vite({ module: { type: 'es6' } })],
});
