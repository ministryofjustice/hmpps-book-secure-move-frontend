const router = require('express').Router({ mergeParams: true })

const { uuidRegex } = require('../../common/helpers/url')
const breadcrumbs = require('../../common/middleware/breadcrumbs')
const { PLACEHOLDER_IMAGES } = require('../../config')

const { image, personalDetails } = require('./controllers')
const { setPerson, setBreadcrumb } = require('./middleware')

router.get('/', (req, res) => res.redirect(`${req.baseUrl}/personal-details`))
router.get('/image', image(PLACEHOLDER_IMAGES.PERSON))

router.use(breadcrumbs.setHome())

router.get('/personal-details', setPerson, setBreadcrumb, personalDetails)

module.exports = {
  router,
  mountpath: `/person/:personId(${uuidRegex})`,
}
