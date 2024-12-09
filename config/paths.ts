import path from 'path'

// Define root and build paths
const root = path.normalize(`${__dirname}/..`)
const build = path.resolve(root, '.build')

// Define interfaces for config paths
interface FrameworkPaths {
  source: string
  output: string
}

interface ConfigPaths {
  root: string
  build: string
  app: string
  assets: string
  templates: string
  components: string
  manifest: string
  govukFrontend: string
  mojFrontend: string
  fixtures: string
  frameworks: FrameworkPaths
}

// Define config paths
const configPaths: ConfigPaths = {
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

export { configPaths }
