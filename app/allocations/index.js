const { format } = require('date-fns')
const router = require('express').Router()

const { dateFormat } = require('../../common/helpers/date-utils')
const { setDateRange, setDatePeriod } = require('../../common/middleware')
const { protectRoute } = require('../../common/middleware/permissions')

const { COLLECTION_MIDDLEWARE, MOUNTPATH } = require('./constants')
const { dashboard, list } = require('./controllers')
const {
  setAllocationsByDateAndFilter,
  setAllocationsSummary,
  setAllocationTypeNavigation,
} = require('./middleware')

router.param('period', setDatePeriod)
router.param('date', setDateRange)

router.get('/', protectRoute('allocations:view'), (req, res, next) => {
  const today = format(new Date(), dateFormat)
  return res.redirect(`${req.baseUrl}/week/${today}/`)
})
router.get(
  '/:period(week|day)/:date/',
  protectRoute('allocations:view'),
  setAllocationsSummary,
  dashboard
)
router.get(
  '/:period(week|day)/:date/:view(outgoing)',
  protectRoute('allocations:view'),
  setAllocationsByDateAndFilter,
  setAllocationTypeNavigation,
  COLLECTION_MIDDLEWARE,
  list
)
module.exports = {
  router,
  mountpath: MOUNTPATH,
}
