const { cloneDeep } = require('lodash')

const {
  Assessment,
  MoveDate,
  MoveDetails,
  PersonalDetails,
} = require('../controllers/update')

const createSteps = require('./create')

const updateControllers = {
  '/personal-details': PersonalDetails,
  '/move-details': MoveDetails,
  '/move-date': MoveDate,
  '/court-information': Assessment,
  '/risk-information': Assessment,
  '/health-information': Assessment,
}

const provideStepProps = (key, step) => {
  const stepProps = {
    entryPoint: true,
    backLink: null,
    next: undefined,
    buttonText: 'actions::save_and_continue',
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
