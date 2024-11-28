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
      files: ['e2e/**/*.ts'],
      extends: ['plugin:testcafe/recommended'],
      rules: {
        'mocha/no-mocha-arrows': 'off',
        'comma-dangle': 'off',
      },
    },
  ],
}
