module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: 'standard',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'never',
      exports: 'never',
      functions: 'ignore',
    }],
    'object-curly-spacing': ['error', 'always'],
    'dot-notation': 'error',
    'no-process-env': 'error',
  },
  overrides: [
    {
      files: ['*.test.js','*.spec.js'],
      env: {
        mocha: true,
      },
      globals: {
        expect: 'readonly',
        sinon: 'readonly',
      },
      rules: {
        'no-unused-expressions': 'off',
        'mocha/no-exclusive-tests': 'error',
      },
      plugins: [
        'mocha',
      ],
    },
  ],
}
