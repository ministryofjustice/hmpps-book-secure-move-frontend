module.exports = {
  env: {
    mocha: true,
  },
  globals: {
    sinon: 'readonly',
    nock: 'readonly',
    mockFs: 'readonly',
  },
  overrides: [
    {
      files: ['e2e/*.js'],
      extends: ['plugin:testcafe/recommended'],
      rules: {
        'mocha/no-mocha-arrows': 'off',
        'no-process-env': 'off',
        'comma-dangle': 'off',
      },
    },
  ],
}
