import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

const config = hmppsConfig({
  extraPathsAllowingDevDependencies: ['.allowed-scripts.mjs']
})

// config.push({
//   name: 'jquery',
//   files: [`assets/js/**/*.js`],
//   languageOptions: {
//     globals: {
//       $: true,
//       module: true,
//     },
//   },
//   rules: {
//     'func-names': 0,
//   },
// })
//
// config.push({
//   name: 'allow-any-in-tests',
//   files: [`**/*.test.ts`],
//   rules: {
//     '@typescript-eslint/no-explicit-any': 0,
//   },
// })
//
// config.push({
//   name: 'underscore-dangle',
//   files: [`**/*.ts`],
//   rules: {
//     'no-underscore-dangle': 0,
//   },
// })

export default config
