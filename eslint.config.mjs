// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import turbo from "eslint-plugin-turbo";
import parser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    languageOptions: {
      sourceType: 'module',
    },
    plugins: {
      '@stylistic': stylistic,
      'prefer-arrow-functions': preferArrowFunctions,
      unicorn,
      turbo,
    },
    rules: {
      curly: "error",
      "no-undef": "off",
      "no-console": "off",
      "no-debugger": "off",
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/member-delimiter-style": ["error", {}],
      "@stylistic/semi": ["error", "always"],

      "prefer-arrow-functions/prefer-arrow-functions": ["warn", {
          allowNamedFunctions: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: "implicit",
          singleReturnOnly: false,
      }],

      "no-useless-escape": "warn",
      "no-async-promise-executor": "warn",
      "no-unused-vars": "off",
      "unicorn/import-style": ["error"],
      'unicorn/prefer-node-protocol': ['error'],
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@stylistic': stylistic,
      "prefer-arrow-functions": preferArrowFunctions,
      turbo,
    },
    languageOptions: {
      sourceType: 'module',
      parser,
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
    rules: {
      '@stylistic/quotes': ['error', 'single'],
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",

      "@typescript-eslint/consistent-type-imports": ["error", {
          fixStyle: "separate-type-imports",
          prefer: "type-imports",
          disallowTypeAnnotations: true,
      }],

      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/no-unused-vars": ["error", {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
      }],
    }
  },
);
