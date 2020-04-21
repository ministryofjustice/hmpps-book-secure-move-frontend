// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { PLACEHOLDER_IMAGES } = require('../../config')

const { image } = require('./controllers')

// Define routes
router.get('/:personId/image', image(PLACEHOLDER_IMAGES.PERSON))

// Export
module.exports = {
  router,
  mountpath: '/person',
}
