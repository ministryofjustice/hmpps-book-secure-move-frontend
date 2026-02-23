module.exports = {
  ui: 'bdd',
  recursive: true,
  file: [
    'test/unit/component-helpers.ts',
    'test/unit/global-helpers.ts',
  ],
  require: ['ts-node/register/transpile-only','test/unit/common.js' ],
  extension: ['ts'],
  spec: [
    'app/**/*.test.ts',
    'common/**/*.test.ts',
    'config/**/*.test.ts',
  ],


}
