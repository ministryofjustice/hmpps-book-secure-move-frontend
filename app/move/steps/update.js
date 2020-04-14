const { cloneDeep } = require('lodash')

const {
  Assessment,
  MoveDetails,
  PersonalDetails,
} = require('../controllers/update')

const createSteps = require('./create')

const updateControllers = {
  '/personal-details': PersonalDetails,
  '/move-details': MoveDetails,
  '/court-information': Assessment,
  '/risk-information': Assessment,
  '/health-information': Assessment,
}

const provideStepProps = (key, step) => {
  const stepProps = {
    entryPoint: true,
    checkSession: false,
    checkJourney: false,
    update: true,
    updateBackStep: '/move/:moveId',
  }

  const updatedStep = {
    ...cloneDeep(step),
    ...stepProps,
  }

  if (updateControllers[key]) {
    updatedStep.controller = updateControllers[key]
  }
  return updatedStep
}

const updateSteps = Object.keys(createSteps)
  .filter(key => updateControllers[key])
  .map(key => ({ [key]: provideStepProps(key, createSteps[key]) }))

module.exports = updateSteps
