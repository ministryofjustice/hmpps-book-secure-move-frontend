const router = require('express').Router()
const { protectRoute } = require('../../common/middleware/permissions')
const { redirectToIncomingMoves } = require('./controllers')

router.get('/', protectRoute('moves:view:incoming'), redirectToIncomingMoves)

module.exports = {
  router,
  mountpath: '/csra',
}
