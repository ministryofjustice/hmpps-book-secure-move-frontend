const router = require('express').Router({ mergeParams: true })

const { uuidRegex } = require('../../common/helpers/url')
const breadcrumbs = require('../../common/middleware/breadcrumbs')
const { PLACEHOLDER_IMAGES } = require('../../config')

const { image, personalDetails } = require('./controllers')
const { setPerson } = require('./middleware')

router.use(breadcrumbs.setHome())

router.get('/', setPerson, personalDetails)
router.get('/image', image(PLACEHOLDER_IMAGES.PERSON))

module.exports = {
  router,
  mountpath: `/person/:personId(${uuidRegex})`,
}
