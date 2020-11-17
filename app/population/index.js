const router = require('express').Router()
const dailyRouter = require('express').Router({ mergeParams: true })

const {
  setContext,
  setDateRange,
  setPagination,
} = require('../../common/middleware/collection')

const { BASE_PATH, MOUNTPATH, DAILY_PATH } = require('./constants')
const { dashboard, daily } = require('./controllers')
const {
  redirectBaseUrl,
  setPopulationId,
  setResultsAsPopulationTable,
  setResultsDailyPopulation,
} = require('./middleware')

router.param('date', setDateRange)
router.param('locationId', setPopulationId)

router.get('/', redirectBaseUrl)

dailyRouter.get('/', setContext('population'), setResultsDailyPopulation, daily)

router.use(DAILY_PATH, dailyRouter)

router.get(
  BASE_PATH,
  setContext('population'),
  setPagination(MOUNTPATH + BASE_PATH),
  setResultsAsPopulationTable,
  dashboard
)

module.exports = {
  router,
  mountpath: MOUNTPATH,
}
