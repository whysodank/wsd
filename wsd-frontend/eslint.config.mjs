// eslint.config.js
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'


export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        __DEV__: false,
        jasmine: false,
        beforeAll: false,
        afterAll: false,
        beforeEach: false,
        afterEach: false,
        test: false,
        expect: false,
        describe: false,
        jest: false,
        it: false,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin, // Add the react-hooks plugin
      prettier: prettierPlugin,
      import: importPlugin,
      '@next': nextPlugin,
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-object-literal-type-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // React rules
      'react/no-unknown-property': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      // General rules
      'newline-per-chained-call': 'off',
      'comma-dangle': 'off',
      'multiline-ternary': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-global-assign': 'off',
      quotes: 'off',
      'space-before-function-paren': 'off',
      'prettier/prettier': 'error',
      'import/no-relative-parent-imports': 'off',
      'no-nested-ternary': 'error',

      // Next.js rules
      '@next/no-html-link-for-pages': 'error',
    },
  },
  {
    files: ['*.config.js', '*.config.mjs', 'next.config.mjs'],
    languageOptions: {
      globals: {
        process: true,
        module: true,
        require: true,
        __dirname: true,
        __filename: true,
        exports: true,
      },
    },
    // Disable rules that might cause problems in config files
    rules: {
      'no-undef': 'off',
    },
  },

  {
    ignores: [
      'node_modules',
      'package.json',
      'tsconfig.json',
      '.eslint*',
      '.prettier*',
      'src/components/shadcn',
      '.next',
    ],
  },
]
