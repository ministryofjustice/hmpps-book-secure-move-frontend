const wizard = require('hmpo-form-wizard')

const { protectRoute } = require('../../common/middleware/permissions')
const { dashboard } = require('./controllers')
const { createSteps } = require('./steps')
const { createFields } = require('./fields')

const router = require('express').Router()

router.get('/', protectRoute('move:requests:view'), dashboard)

router.use(
  '/new',
  protectRoute('move:create'),
  wizard(createSteps, createFields, {
    template: 'form-wizard',
  })
)

module.exports = {
  router,
  mountpath: '/move-requests',
}
