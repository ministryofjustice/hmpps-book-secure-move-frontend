module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['prettier', 'standard'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'prettier/prettier': 'error',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'ignore',
      },
    ],
    curly: ['error', 'all'],
    'space-before-function-paren': ['off'],
    'object-curly-spacing': ['error', 'always'],
    'dot-notation': 'error',
    'no-process-env': 'error',
    'no-console': 'error',
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      env: {
        mocha: true,
      },
      globals: {
        expect: 'readonly',
        sinon: 'readonly',
        nock: 'readonly',
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
