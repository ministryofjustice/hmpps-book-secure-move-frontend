const path = require('path')

const root = path.normalize(`${__dirname}/..`)

module.exports = {
  app: path.resolve(root, 'app'),
  assets: path.resolve(root, 'common', 'assets'),
  build: path.resolve(root, '.build'),
  components: path.resolve(root, 'common', 'components'),
  fixtures: path.resolve(root, 'test', 'fixtures'),
  govukFrontend: path.resolve(root, 'node_modules', 'govuk-frontend'),
  manifest: path.resolve(root, '.build', 'manifest.json'),
  mojFrontend: path.resolve(
    root,
    'node_modules',
    '@ministryofjustice',
    'frontend'
  ),
  root,
  templates: path.resolve(root, 'common', 'templates'),
}
