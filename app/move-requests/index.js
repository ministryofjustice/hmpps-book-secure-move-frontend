const { protectRoute } = require('../../common/middleware/permissions')

const router = require('express').Router()

router.get('/', protectRoute('move:requests:view'), (req, res) => {
  return res('boh')
})

module.exports = {
  router,
  mountpath: '/move-requests',
}
