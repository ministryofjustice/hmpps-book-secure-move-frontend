const router = require('express').Router()

const {
  setContext,
  setDateRange,
  setPagination,
} = require('../../common/middleware/collection')

const { BASE_PATH, MOUNTPATH, FILTERS } = require('./constants')
const { dashboard } = require('./controllers')
const {
  setResultsAsPopulationTable,
  setFilterPopulation,
  redirectBaseUrl,
} = require('./middleware')

router.param('date', setDateRange)

router.get('/', redirectBaseUrl)

router.use(
  BASE_PATH,
  setContext('population'),
  setPagination(MOUNTPATH + BASE_PATH),
  setFilterPopulation(FILTERS),
  setResultsAsPopulationTable,
  dashboard
)

module.exports = {
  router,
  mountpath: MOUNTPATH,
}
