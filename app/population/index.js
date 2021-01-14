const router = require('express').Router()
const dailyRouter = require('express').Router({ mergeParams: true })

const {
  setContext,
  setDateRange,
  setDatePagination,
} = require('../../common/middleware/collection')
const wizard = require('../../common/middleware/unique-form-wizard')

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
  setPopulation,
  setResultsAsFreeSpacesTables,
  dashboard
)

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
