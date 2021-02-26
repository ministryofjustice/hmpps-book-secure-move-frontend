const router = require('express').Router()

const { token } = require('./controllers')

router.get('/token', token)

// Export
module.exports = {
  router,
  mountpath: '/map',
}
