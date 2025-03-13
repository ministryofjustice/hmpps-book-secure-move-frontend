const path = require('path')

// eslint-disable-next-line n/no-path-concat
const root = path.normalize(`${__dirname}/..`)
const build = path.resolve(root, '.build')

module.exports = {
  root,
  build,
  app: path.resolve(root, 'app'),
  assets: path.resolve(root, 'common', 'assets'),
  templates: path.resolve(root, 'common', 'templates'),
  components: path.resolve(root, 'common', 'components'),
  manifest: path.resolve(root, '.build', 'manifest.json'),
  govukFrontend: path.resolve(root, 'node_modules', 'govuk-frontend/dist'),
  mojFrontend: path.resolve(
    root,
    'node_modules',
    '@ministryofjustice',
    'frontend'
  ),
  hmrcFrontend: path.resolve(root, 'node_modules', 'hmrc-frontend'),
  fixtures: path.resolve(root, 'test', 'fixtures'),
  frameworks: {
    source: path.resolve(
      root,
      'node_modules',
      '@hmpps-book-secure-move-frameworks'
    ),
    output: path.resolve(build, 'frameworks'),
  },
}
