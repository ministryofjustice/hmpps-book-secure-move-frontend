// NPM dependencies
import express from 'express'

// @ts-ignore
import { setLodging } from '../../middleware'

import * as cancelApp from './cancel'
import * as editApp from './edit'
import * as newApp from './new'

const router = express.Router()

router.param('lodgingId', setLodging)

router.use(cancelApp.mountpath, cancelApp.router)
router.use(editApp.mountpath, editApp.router)
router.use(newApp.mountpath, newApp.router)

// Export
module.exports = {
  router,
  mountpath: '/lodging',
}
