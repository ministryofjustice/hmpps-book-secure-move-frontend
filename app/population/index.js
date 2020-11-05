const router = require('express').Router()

const {
  setContext,
  setDateRange,
  setPagination,
} = require('../../common/middleware/collection')

const { BASE_PATH, MOUNTPATH, DAILY_PATH } = require('./constants')
const { dashboard, daily } = require('./controllers')
const {
  setResultsAsPopulationTable,
  redirectBaseUrl,
  setResultsAsDailySummary,
  setBodyPopulationId,
  setBodyFreeSpaces,
} = require('./middleware')

router.param('date', setDateRange)

router.get('/', redirectBaseUrl)

router.use(
  DAILY_PATH,
  setContext('population'),
  setBodyPopulationId,
  setBodyFreeSpaces,
  setResultsAsDailySummary,
  daily
)

router.use(
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
