module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jquery: true,
  },
  extends: ['standard', 'plugin:import/typescript', 'prettier'],
  plugins: ['import', '@typescript-eslint', 'prettier'],
  globals: {
    Atomics: 'readonly',
    MutationObserver: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'prettier/prettier': 'error',
    curly: ['error', 'all'],
    'space-before-function-paren': ['off'],
    'dot-notation': 'error',
    'no-process-env': 'error',
    'no-console': 'error',
    'default-param-last': 'off',
    'import/no-unresolved': ['error', { commonjs: true }],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: 'block' },
      { blankLine: 'always', prev: 'block', next: '*' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
    ],
    'require-await': 'error',
  },
  overrides: [
    {
      files: ['*.test.ts', '*.spec.ts', '*.test.js', '*.spec.js'],
      env: {
        mocha: true,
      },
      globals: {
        expect: 'readonly',
        sinon: 'readonly',
        nock: 'readonly',
        mockFs: 'readonly',
        requireUncached: 'readonly',
      },
      rules: {
        'no-unused-expressions': 'off',
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-mocha-arrows': 'error',
      },
      plugins: ['mocha'],
    },
  ],
}
