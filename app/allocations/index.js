const { format } = require('date-fns')
const router = require('express').Router()

const { dateFormat } = require('../../common/helpers/date-utils')
const { setDateRange, setDatePeriod } = require('../../common/middleware')
const { setPagination } = require('../../common/middleware/collection')
const { protectRoute } = require('../../common/middleware/permissions')

const { COLLECTION_PATH, MOUNTPATH } = require('./constants')
const { dashboard, list } = require('./controllers')
const {
  setAllocationsByDateAndFilter,
  setAllocationsSummary,
  setAllocationTypeNavigation,
} = require('./middleware')

router.param('period', setDatePeriod)
router.param('date', setDateRange)

router.use('date', protectRoute('allocations:view'))

router.get('/', (req, res) => {
  const today = format(new Date(), dateFormat)
  return res.redirect(`${req.baseUrl}/week/${today}/`)
})

router.get('/:period(week|day)/:date/', setAllocationsSummary, dashboard)

router.get(
  COLLECTION_PATH,
  setAllocationsByDateAndFilter,
  setAllocationTypeNavigation,
  setPagination(MOUNTPATH + COLLECTION_PATH),
  list
)

module.exports = {
  router,
  mountpath: MOUNTPATH,
}
