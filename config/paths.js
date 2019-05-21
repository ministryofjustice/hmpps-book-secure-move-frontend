const path = require('path')

const root = path.normalize(`${__dirname}/..`)

module.exports = {
  root,
  build: path.resolve(root, '.build'),
  app: path.resolve(root, 'app'),
  assets: path.resolve(root, 'common', 'assets'),
  templates: path.resolve(root, 'common', 'templates'),
  components: path.resolve(root, 'common', 'components'),
  manifest: path.resolve(root, '.build', 'manifest.json'),
  fixtures: path.resolve(root, 'test', 'fixtures'),
}
