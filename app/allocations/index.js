const router = require('express').Router()
const { format } = require('date-fns')
const { protectRoute } = require('../../common/middleware/permissions')
const { dateFormat } = require('../../common/helpers/date-utils')

router.get('/', protectRoute('allocations:view'), (req, res, next) => {
  const today = format(new Date(), dateFormat)
  const currentLocation = {
    id: 'london',
    location_type: 'adult-male',
  }
  return res.redirect(
    `${req.baseUrl}/week/${today}/${currentLocation.id}/${currentLocation.location_type}`
  )
})
router.get(
  '/:period(week|day)/:date/:locationId/:locationType',
  protectRoute('allocations:view'),
  (req, res, next) => {
    return res.render('alloc')
  }
)
module.exports = {
  router,
  mountpath: '/allocations',
}
