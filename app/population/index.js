// NPM dependencies
const router = require('express').Router({ mergeParams: true })
const viewRouter = require('express').Router({ mergeParams: true })

const {
  setContext,
  setDateRange,
  redirectView,
  setPagination,
} = require('../../common/middleware/collection')

const {
  BASE_PATH,
  VIEW_PATH,
  FREESPACE_PATH,
  TRANSFERS_PATH,
  MOUNTPATH,
} = require('./constants')
const { dashboard, view, freespace, transfers } = require('./controllers')
const { setResultsAsPopulationTable, redirectBaseUrl } = require('./middleware')

router.param('date', setDateRange)
viewRouter.param('date', setDateRange)

router.get('/', redirectBaseUrl)

// Define routes
viewRouter.get(FREESPACE_PATH, setResultsAsPopulationTable, freespace)
viewRouter.get(TRANSFERS_PATH, setResultsAsPopulationTable, transfers)
viewRouter.get('/', setResultsAsPopulationTable, view)

// permissions - canAccess("dashboard:view:population")
router.use(VIEW_PATH, viewRouter)

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

/*
  dashboard: /population/week/2020-09-29 - grid of all locations and spaces
  view: /population/week/2020-09-29/{uuid} - grid of free spaces and transfers in and out
  freespace: /population/day/2020-09-29/{uuid}/freespaces - free space editing wizard
  transfers: /population/day/2020-09-29/{uuid}/transfers
 */
