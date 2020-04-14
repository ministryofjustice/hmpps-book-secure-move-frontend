// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { PLACEHOLDER_IMAGES, FEATURE_FLAGS } = require('../../config')

const { image } = require('./controllers')

// Define routes
router.get(
  '/:personId/image',
  image(PLACEHOLDER_IMAGES.PERSON, FEATURE_FLAGS.IMAGES)
)

// Export
module.exports = {
  router,
  mountpath: '/person',
}
