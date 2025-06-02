import { Router } from 'express'

// @ts-ignore // TODO: convert to TS
import { protectRoute } from '../../../../../common/middleware/permissions'
// @ts-ignore // TODO: convert to TS
import wizard from '../../../../../common/middleware/unique-form-wizard'
import * as fields from '../new/fields'

import { config } from './config'
import { SavedController } from './controllers'
import steps from './steps'

export const router = Router({ mergeParams: true })
export const mountpath = '/:lodgingId/edit'

// Define shared middleware
router.use(protectRoute('move:lodging:update'))

// Define routes
router.use(wizard(steps, fields, config, 'params.lodgingId'))
router.get('/saved', protectRoute('move:lodging:update'), SavedController)
