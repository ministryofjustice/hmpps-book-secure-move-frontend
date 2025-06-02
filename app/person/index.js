const router = require('express').Router({ mergeParams: true })

const breadcrumbs = require('../../common/middleware/breadcrumbs')
const { protectRoute } = require('../../common/middleware/permissions')
const { PLACEHOLDER_IMAGES } = require('../../config')

const { image, moves, personalDetails } = require('./controllers')
const {
  localsIdentityBar,
  localsTabs,
  setPerson,
  setBreadcrumb,
  setMoveResults,
} = require('./middleware')

router.get('/', (req, res) => {
  let url = `${req.baseUrl}/personal-details`

  if (req.query?.move) {
    url += `?move=${req.query.move}`
  }

  res.redirect(url)
})
router.get('/image', image(PLACEHOLDER_IMAGES.PERSON))

router.use(breadcrumbs.setHome())
router.use(localsTabs)

router.get(
  '/moves',
  protectRoute('locations:contract_delivery_manager'),
  setPerson,
  setBreadcrumb,
  localsIdentityBar,
  setMoveResults,
  moves
)
router.get(
  '/personal-details',
  setPerson,
  setBreadcrumb,
  localsIdentityBar,
  personalDetails
)

module.exports = {
  router,
  mountpath: `/person/:personId`,
}
