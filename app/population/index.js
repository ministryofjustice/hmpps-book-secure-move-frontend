const router = require('express').Router()
const dailyRouter = require('express').Router({ mergeParams: true })

const { matchParam } = require('../../common/helpers/url')
const {
  setContext,
  setDateRange,
  setDatePagination,
  switchPeriod,
  switchGroupBy,
} = require('../../common/middleware/collection')
const setLocation = require('../../common/middleware/set-location')
const wizard = require('../../common/middleware/unique-form-wizard')
const { DEFAULTS } = require('../moves/constants')

const {
  BASE_PATH,
  BASE_PATH_GUARD,
  MOUNTPATH,
  DAILY_PATH,
  WEEKLY_PATH,
} = require('./constants')
const { dashboard, daily, weekly } = require('./controllers')
const { editFields } = require('./fields')
const {
  redirectBaseUrl,
  setLocationFreeSpaces,
  setPopulation,
  setBreadcrumb,
  setResultsAsFreeSpacesTables,
  setResultsAsFreeSpacesAndTransfersTables,
} = require('./middleware')
const { editSteps } = require('./steps')

router.param('date', setDateRange)
router.param('locationId', setLocation)

router.get('/', redirectBaseUrl)

dailyRouter.get('/', setLocationFreeSpaces, setPopulation, setBreadcrumb, daily)

const editConfig = {
  name: 'edit-population',
  templatePath: 'population/views/edit/',
  template: '../../../form-wizard',
  journeyName: 'edit-population',
  journeyPageTitle: 'actions::create_population',
}

dailyRouter.use(
  '/edit',
  setLocationFreeSpaces,
  setPopulation,
  setBreadcrumb,
  wizard(editSteps, editFields, editConfig, 'wizardKey')
)

// Daily and weekly share a path shape (see constants.js), so the daily
// sub-router is only delegated to when the period actually says "day" -
// everything else falls through to the weekly route below.
router.use(DAILY_PATH, (req, res, next) => {
  if (req.params.period !== 'day') {
    return next()
  }

  return dailyRouter(req, res, next)
})

router.get(
  BASE_PATH,
  BASE_PATH_GUARD,
  setContext('population'),
  setDatePagination(MOUNTPATH + BASE_PATH),
  setLocationFreeSpaces,
  setResultsAsFreeSpacesTables,
  dashboard
)

router.get(
  BASE_PATH + '/switch-view',
  BASE_PATH_GUARD,
  switchPeriod(DEFAULTS.TIME_PERIOD)
)

router.get(
  BASE_PATH + '/switch-group-by',
  BASE_PATH_GUARD,
  switchGroupBy(DEFAULTS.GROUP_BY)
)

router.get(
  WEEKLY_PATH,
  matchParam('period', 'week'),
  setContext('population'),
  setDatePagination(MOUNTPATH + WEEKLY_PATH),
  setLocationFreeSpaces,
  setPopulation,
  setBreadcrumb,
  setResultsAsFreeSpacesAndTransfersTables,
  weekly
)

module.exports = {
  router,
  mountpath: MOUNTPATH,
}
