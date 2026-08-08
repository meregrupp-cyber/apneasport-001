import eslint from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.astro/**',
      '.ci-test/**',
      '.lockgen/**',
      '.npm-cache/**',
      '.pnpm-home/**',
      '.pnpm-store/**',
      '.playwright-browsers/**',
      'dist/**',
      'node_modules/**',
      'legacy/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
