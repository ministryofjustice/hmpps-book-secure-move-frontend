const router = require('express').Router()

const breadcrumbs = require('../../common/middleware/breadcrumbs')
const { PLACEHOLDER_IMAGES } = require('../../config')

const { image, renderPerson } = require('./controllers')
const { setPerson } = require('./middleware')

router.use(breadcrumbs.setHome())

router.get('/:personId', setPerson, renderPerson)
router.get('/:personId/image', image(PLACEHOLDER_IMAGES.PERSON))

module.exports = {
  router,
  mountpath: '/person',
}
