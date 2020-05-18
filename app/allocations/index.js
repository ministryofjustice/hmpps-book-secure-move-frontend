const router = require('express').Router()
const viewRouter = require('express').Router({ mergeParams: true })

const { setDateRange } = require('../../common/middleware')
const { protectRoute } = require('../../common/middleware/permissions')
const { download } = require('../moves/controllers')
const { redirectDefaultQuery, redirectView } = require('../moves/middleware')

const {
  COLLECTION_BASE_PATH,
  COLLECTION_MIDDLEWARE,
  COLLECTION_VIEW_PATH,
  DEFAULTS,
  FILTERS,
  MOUNTPATH,
} = require('./constants')
const { list } = require('./controllers')
const {
  setBodyAllocations,
  setFilterAllocations,
  setResultsAllocations,
} = require('./middleware')

router.param('date', setDateRange)
router.param('view', redirectDefaultQuery(DEFAULTS.QUERY))

router.use(protectRoute('allocations:view'))

router.get('/', (req, res) => res.redirect(`${MOUNTPATH}/outgoing`))
router.get(COLLECTION_VIEW_PATH, redirectView(DEFAULTS.TIME_PERIOD))

viewRouter.get(
  '/:view(outgoing)',
  COLLECTION_MIDDLEWARE,
  [
    setBodyAllocations,
    setResultsAllocations,
    setFilterAllocations(FILTERS.outgoing),
  ],
  list
)
viewRouter.get(
  '/:view(outgoing)/download.:extension(csv|json)',
  [setBodyAllocations, setResultsAllocations],
  download
)

router.use(COLLECTION_BASE_PATH, viewRouter)

module.exports = {
  router,
  mountpath: MOUNTPATH,
}
