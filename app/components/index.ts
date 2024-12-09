// Core dependencies
import fs from 'fs'
import path from 'path'

// NPM dependencies
import { Router } from 'express'

// Local dependencies
import { mapComponentFolder } from '../../common/helpers/component'
import { ENABLE_COMPONENTS_LIBRARY } from '../../config'
import { configPaths } from '../../config/paths'

const router = Router()

// Controllers
import {
  renderList,
  renderComponent,
  renderRawExample,
} from './controllers'

// Middleware
import { setComponent, setComponents } from './middleware'

// Constants
const mountpath = '/components'

// Ensure the components directory exists before reading
if (!fs.existsSync(configPaths.components)) {
  throw new Error(`Components directory not found: ${configPaths.components}`)
}

const componentDirs = fs.readdirSync(configPaths.components, { withFileTypes: true })

// Map the component folders to metadata
const components = componentDirs
  .filter(dirent => dirent.isDirectory())
  .map(mapComponentFolder(mountpath))

// Middleware to set components
router.use(setComponents(components))
router.param('component', setComponent(components))

// Define routes
router.get('/', renderList)
router.get('/:component', renderComponent)
router.get('/:component/:example', renderRawExample)

// Export router and configuration as an object
export const config = {
  router,
  mountpath,
  // Only load app when enabled
  skip: !ENABLE_COMPONENTS_LIBRARY,
}
