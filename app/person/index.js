// NPM dependencies
const router = require('express').Router()

// Local dependencies
const breadcrumbs = require('../../common/middleware/breadcrumbs')
const { PLACEHOLDER_IMAGES } = require('../../config')

const { image, renderPerson } = require('./controllers')
const { setPerson } = require('./middleware')

router.use(breadcrumbs.setHome())

// Define routes
router.get('/:personId', setPerson, renderPerson)
router.get('/:personId/image', image(PLACEHOLDER_IMAGES.PERSON))

// Export
module.exports = {
  router,
  mountpath: '/person',
}
