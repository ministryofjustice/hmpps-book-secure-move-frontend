// Core dependencies
const fs = require('fs')

// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { mapComponentFolder } = require('../../common/helpers/component')
const { ENABLE_COMPONENTS_LIBRARY } = require('../../config')
const paths = require('../../config/paths')

const {
  renderList,
  renderComponent,
  renderRawExample,
} = require('./controllers')
const { setComponent, setComponents } = require('./middleware')

const mountpath = '/components'
const componentDirs = fs.readdirSync(paths.components, { withFileTypes: true })
const components = componentDirs
  .filter(dirent => dirent.isDirectory())
  .map(mapComponentFolder(mountpath))

router.use(setComponents(components))
router.param('component', setComponent(components))

// Define routes
router.get('/', renderList)
router.get('/:component', renderComponent)
router.get('/:component/:example', renderRawExample)

// Export
module.exports = {
  router,
  mountpath,
  // Only load app when enabled
  skip: !ENABLE_COMPONENTS_LIBRARY,
}
