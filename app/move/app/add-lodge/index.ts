import { Router } from 'express'

// @ts-ignore // TODO: convert to TS
import { protectRoute } from '../../../../common/middleware/permissions'
// @ts-ignore // TODO: convert to TS
import wizard from '../../../../common/middleware/unique-form-wizard'
// @ts-ignore // TODO: convert to TS
import { setMoveWithEvents } from '../../middleware'

import { config } from './config'
import { SavedController } from './controllers'
import * as fields from './fields'
import steps from './steps'

export const router = Router({ mergeParams: true })
export const mountpath = '/lodge'

// Define shared middleware
router.use(setMoveWithEvents)
router.use(protectRoute('move:lodging:create'))

// Define routes
router.use(wizard(steps, fields, config, 'params.moveId'))
router.get(
  '/:eventId/saved',
  protectRoute('move:lodging:create'),
  SavedController
)
