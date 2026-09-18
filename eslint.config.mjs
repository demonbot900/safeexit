import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      'apps/mobile/**',
      'firmware/**',
      'docs/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // consistent-type-imports ist hier bewusst aus: Nest liest die Typen der
      // Konstruktor-Parameter zur Laufzeit aus den Metadaten. Ein 'import type'
      // loescht genau diese Angabe, und die Abhaengigkeit ist nicht mehr aufloesbar.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
    },
  },
  {
    // Skripte, Werkzeuge und Tests duerfen auf die Konsole schreiben.
    files: [
      '**/scripts/**',
      '**/*.spec.ts',
      '**/*.e2e-spec.ts',
      '**/vitest.config.ts',
      '**/persistence/postgres/migrate.ts',
      '**/persistence/postgres/seed.ts',
    ],
    rules: { 'no-console': 'off' },
  },
  {
    // Werkzeugskripte laufen in Node, nicht im Browser.
    files: ['**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        Buffer: 'readonly',
      },
    },
  },
);
