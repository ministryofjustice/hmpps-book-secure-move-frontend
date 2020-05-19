const router = require('express').Router()

const { setDateRange } = require('../../common/middleware')
const {
  redirectDefaultQuery,
  redirectView,
  setPagination,
} = require('../../common/middleware/collection')
const { protectRoute } = require('../../common/middleware/permissions')

const { COLLECTION_PATH, DEFAULTS, FILTERS, MOUNTPATH } = require('./constants')
const { list } = require('./controllers')
const {
  setBodyAllocations,
  setResultsAllocations,
  setFilterAllocations,
} = require('./middleware')

router.param('date', setDateRange)
router.param('view', redirectDefaultQuery(DEFAULTS.QUERY))

router.use('date', protectRoute('allocations:view'))

router.get('/', (req, res) => res.redirect(`${MOUNTPATH}/outgoing`))
router.get('/:view(outgoing)', redirectView(DEFAULTS.TIME_PERIOD))

router.get(
  COLLECTION_PATH,
  setPagination(MOUNTPATH + COLLECTION_PATH),
  [
    setBodyAllocations,
    setResultsAllocations,
    setFilterAllocations(FILTERS.outgoing),
  ],
  list
)

module.exports = {
  router,
  mountpath: MOUNTPATH,
}
