// NPM dependencies
const router = require('express').Router()
const viewRouter = require('express').Router({ mergeParams: true })

const {
  setDateRange,
  redirectView,
} = require('../../common/middleware/collection')

const {
  // ACTIONS,
  // COLLECTION_PATH,
  BASE_PATH,
  VIEW_PATH,
  FREESPACE_PATH,
  TRANSFERS_PATH,
  DEFAULTS,
  // FILTERS,
  MOUNTPATH,
} = require('./constants')
const { dashboard, view, freespace, transfers } = require('./controllers')
const { setResultsPopulation, redirectBaseUrl } = require('./middleware')

router.param('date', setDateRange)

// Define routes
viewRouter.get(FREESPACE_PATH, setResultsPopulation, freespace)
viewRouter.get(TRANSFERS_PATH, setResultsPopulation, transfers)
viewRouter.get('/', setResultsPopulation, view)

router.get('/', redirectBaseUrl)
router.use(VIEW_PATH, viewRouter)

router.use(BASE_PATH, setResultsPopulation, dashboard)

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
