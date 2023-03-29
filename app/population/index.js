const router = require('express').Router()
const dailyRouter = require('express').Router({ mergeParams: true })

const {
  setContext,
  setDateRange,
  setDatePagination,
  switchPeriod,
} = require('../../common/middleware/collection')
const setLocation = require('../../common/middleware/set-location')
const wizard = require('../../common/middleware/unique-form-wizard')
const { DEFAULTS } = require('../moves/constants')

const { BASE_PATH, MOUNTPATH, DAILY_PATH, WEEKLY_PATH } = require('./constants')
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

router.use(DAILY_PATH, dailyRouter)

router.get(
  BASE_PATH,
  setContext('population'),
  setDatePagination(MOUNTPATH + BASE_PATH),
  setLocationFreeSpaces,
  setResultsAsFreeSpacesTables,
  dashboard
)

router.get(BASE_PATH + '/switch-view', switchPeriod(DEFAULTS.TIME_PERIOD))

router.get(
  WEEKLY_PATH,
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
