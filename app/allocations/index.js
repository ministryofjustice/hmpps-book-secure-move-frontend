const router = require('express').Router()
const { format } = require('date-fns')
const { protectRoute } = require('../../common/middleware/permissions')
const { dateFormat } = require('../../common/helpers/date-utils')
const {
  setAllocationsSummary,
  setDateRange,
  setPeriod,
  setPagination,
} = require('./middleware')
const { dashboard } = require('./controllers')

router.param('period', setPeriod)
router.param('date', setDateRange)

router.get('/', protectRoute('allocations:view'), (req, res, next) => {
  const today = format(new Date(), dateFormat)
  return res.redirect(`${req.baseUrl}/week/${today}/`)
})
router.get(
  '/:period(week|day)/:date/',
  protectRoute('allocations:view'),
  setAllocationsSummary,
  setPagination,
  dashboard
)
module.exports = {
  router,
  mountpath: '/allocations',
}
