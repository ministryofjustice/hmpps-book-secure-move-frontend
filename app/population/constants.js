const { matchParam } = require('../../common/helpers/url')

const MOUNTPATH = '/population'

const BASE_PATH = '/:period/:date'

// date is already validated by the setDateRange router.param() handler -
// only period has no existing validator.
const BASE_PATH_GUARD = matchParam('period', ['week', 'day'])

// Daily and weekly views share the same shape once the period is no longer
// constrained by inline regex, so index.js picks between them by reading
// req.params.period itself rather than relying on route matching to do it.
const DAILY_PATH = '/:period/:date/:locationId'
const WEEKLY_PATH = '/:period/:date/:locationId'

module.exports = {
  BASE_PATH,
  BASE_PATH_GUARD,
  DAILY_PATH,
  MOUNTPATH,
  WEEKLY_PATH,
}
