const { protectRoute } = require('../../common/middleware/permissions')
const { dashboard } = require('./controllers')

const router = require('express').Router()

router.get('/', protectRoute('move:requests:view'), dashboard)

module.exports = {
  router,
  mountpath: '/move-requests',
}
