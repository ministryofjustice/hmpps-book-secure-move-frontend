import { Router } from 'express'

import config from '../config/edit.config'
import steps from '../steps/edit'

const { protectRoute } = require('../../../common/middleware/permissions')
const wizard = require('../../../common/middleware/unique-form-wizard')
const editFields = require('../fields').editFields

const router = Router({ mergeParams: true })

// Define routes
steps.forEach((updateJourney: { permission?: any; key?: any; steps?: any }) => {
  const { key, steps } = updateJourney
  const updateStepConfig = {
    ...config(key),
    name: `update-allocation-${key}`,
    journeyName: `update-allocation-${key}`,
  }
  router.use(
    protectRoute(updateJourney.permission),
    wizard(steps, editFields, updateStepConfig)
  )
})

export default router
