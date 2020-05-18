const { format } = require('date-fns')
const router = require('express').Router()

const { dateFormat } = require('../../common/helpers/date-utils')
const { setDateRange, setDatePeriod } = require('../../common/middleware')
const { setPagination } = require('../../common/middleware/collection')
const { protectRoute } = require('../../common/middleware/permissions')

const { COLLECTION_PATH, FILTERS, MOUNTPATH } = require('./constants')
const { list } = require('./controllers')
const {
  setBodyAllocations,
  setResultsAllocations,
  setFilterAllocations,
} = require('./middleware')

router.param('period', setDatePeriod)
router.param('date', setDateRange)

router.use('date', protectRoute('allocations:view'))

router.get('/', (req, res) => {
  const today = format(new Date(), dateFormat)
  return res.redirect(`${req.baseUrl}/week/${today}/outgoing`)
})

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
