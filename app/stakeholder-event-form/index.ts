import express from 'express'
import steps from './steps'
import fields from './fields'
// @ts-ignore TODO Convert to ts
import { protectRoute } from '../../common/middleware/permissions'
// @ts-ignore TODO Convert to ts
import wizard from '../../common/middleware/unique-form-wizard'
import { success } from './controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/success',
  protectRoute(['person_escort_record:record_event']),
  success
)

router.use(
  protectRoute('person_escort_record:record_event'),
  wizard(steps, fields, {
    name: 'stakeholder-event',
    templatePath: '../../common/templates',
    template: 'form-wizard',
    csrf: false,
    defaultFormatters: ['trim']
  })
)

module.exports = {
  router,
  mountpath: '/record-event'
}
