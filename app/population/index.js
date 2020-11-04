const router = require('express').Router()

const {
  setContext,
  setDateRange,
  setPagination,
} = require('../../common/middleware/collection')

const { BASE_PATH, MOUNTPATH } = require('./constants')
const { dashboard } = require('./controllers')
const { setResultsAsPopulationTable, redirectBaseUrl } = require('./middleware')

router.param('date', setDateRange)

router.get('/', redirectBaseUrl)

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
