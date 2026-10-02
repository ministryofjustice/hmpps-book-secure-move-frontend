import { Router } from 'express'

// @ts-ignore // TODO: convert to TS
import { protectRoute } from '../../../../common/middleware/permissions'

// @ts-ignore // TODO: convert to TS
import wizard from '../../../../common/middleware/unique-form-wizard'

import { config } from './config'
import * as fields from './fields'
import steps from './steps'

export const router = Router({ mergeParams: true })

// Define shared middleware
router.use(protectRoute(['move:cancel', 'move:cancel:proposed']))

// Define routes
router.use(wizard(steps, fields, config, 'params.moveId'))

// Export
module.exports = {
  router,
  mountpath: '/cancel'
}
