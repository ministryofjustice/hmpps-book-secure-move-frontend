// NPM dependencies
import express from 'express'

import * as cancelApp from './cancel'
import * as newApp from './new'

const router = express.Router()
router.use(newApp.mountpath, newApp.router)
router.use(cancelApp.mountpath, cancelApp.router)

// Export
module.exports = {
  router,
  mountpath: '/lodging',
}
