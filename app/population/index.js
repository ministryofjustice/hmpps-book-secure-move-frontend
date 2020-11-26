const router = require('express').Router()
const dailyRouter = require('express').Router({ mergeParams: true })

const FormWizardController = require('../../common/controllers/form-wizard')
const {
  setContext,
  setDateRange,
  setPagination,
} = require('../../common/middleware/collection')
const wizard = require('../../common/middleware/unique-form-wizard')

const { BASE_PATH, MOUNTPATH, DAILY_PATH } = require('./constants')
const { dashboard, daily } = require('./controllers')
const { editFields } = require('./fields')
const {
  redirectBaseUrl,
  setPopulation,
  setResultsAsPopulationTable,
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

dailyRouter.use('/edit', wizard(editSteps, editFields, editConfig))

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
