const router = require('express').Router()
const dailyRouter = require('express').Router({ mergeParams: true })

const FormWizardController = require('../../common/controllers/form-wizard')
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
  setBreadcrumb,
  setPopulation,
  setResultsAsPopulation,
  setResultsAsFreeSpacesTables,
  setResultsAsFreeSpacesAndTransfersTables,
} = require('./middleware')
const { editSteps } = require('./steps')

router.param('date', setDateRange)
router.param('locationId', setPopulation)

router.get('/', redirectBaseUrl)

dailyRouter.get('/', daily)

const editConfig = {
  controller: FormWizardController,
  name: 'edit-population',
  templatePath: 'population/views/edit/',
  template: '../../../form-wizard',
  journeyName: 'edit-population',
  journeyPageTitle: 'actions::create_population',
}

dailyRouter.use('/edit', wizard(editSteps, editFields, editConfig, 'wizardKey'))

router.use(DAILY_PATH, setBreadcrumb, dailyRouter)

router.get(
  BASE_PATH,
  setContext('population'),
  setDatePagination(MOUNTPATH + BASE_PATH),
  setResultsAsPopulation,
  setResultsAsFreeSpacesTables,
  dashboard
)

router.get(
  WEEKLY_PATH,
  setContext('population'),
  setDatePagination(MOUNTPATH + WEEKLY_PATH),
  setPopulation,
  setBreadcrumb,
  setResultsAsPopulation,
  setResultsAsFreeSpacesAndTransfersTables,
  weekly
)

module.exports = {
  router,
  mountpath: MOUNTPATH,
}
