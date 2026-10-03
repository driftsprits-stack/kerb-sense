import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'public',
      'coverage',
      'node_modules',
      'test-results',
      'playwright-report',
      '.lighthouseci',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Build scripts run in Node and drive a browser page.
    files: ['scripts/**/*.mjs', '*.cjs', '*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    files: ['tests/**/*.ts', '*.ts'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Page entry files render a root; they are not hot-reloaded components.
    files: ['src/pages/*.tsx', 'src/main.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
      // Standards E1: no raw HTML injection.
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'Do not use dangerouslySetInnerHTML (WEBSITE-STANDARDS E1).',
        },
      ],
    },
  },
);
