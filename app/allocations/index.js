const router = require('express').Router()

const { renderAsTable } = require('../../common/controllers/collection')
const {
  redirectDefaultQuery,
  redirectView,
  setActions,
  setContext,
  setDatePagination,
  setDateRange,
  setPagination,
} = require('../../common/middleware/collection')
const { protectRoute } = require('../../common/middleware/permissions')

const {
  ACTIONS,
  COLLECTION_PATH,
  DEFAULTS,
  FILTERS,
  MOUNTPATH,
} = require('./constants')
const {
  setBodyAllocations,
  setResultsAllocations,
  setFilterAllocations,
} = require('./middleware')

router.param('date', setDateRange)
router.param('view', redirectDefaultQuery(DEFAULTS.QUERY))

router.use(protectRoute('allocations:view'))

router.get('/', (req, res) => res.redirect(`${MOUNTPATH}/outgoing`))
router.get('/:view(outgoing)', redirectView(DEFAULTS.TIME_PERIOD))

router.get(
  COLLECTION_PATH,
  setActions(ACTIONS),
  setContext('allocations'),
  setDatePagination(MOUNTPATH + COLLECTION_PATH),
  [
    setBodyAllocations,
    setResultsAllocations,
    setFilterAllocations(FILTERS.outgoing),
    setPagination(MOUNTPATH + COLLECTION_PATH),
  ],
  renderAsTable
)

module.exports = {
  router,
  mountpath: MOUNTPATH,
}
