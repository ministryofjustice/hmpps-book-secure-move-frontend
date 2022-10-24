const createSteps = require('../new/steps')

const {
  Assessment,
  Court,
  Hospital,
  MoveDate,
  MoveDetails,
  PersonalDetails,
} = require('./controllers')

const updateStepPropOverrides = {
  entryPoint: true,
  backLink: null,
  next: undefined,
  buttonText: 'actions::save_and_continue',
}

const updateSteps = [
  {
    key: 'personal_details',
    permission: ['move:update_date', 'move:update_details'],
    steps: {
      '/personal-details': {
        ...createSteps['/personal-details'],
        ...updateStepPropOverrides,
        controller: PersonalDetails,
      },
    },
  },
  {
    key: 'date',
    permission: 'move:update_date',
    steps: {
      '/move-date': {
        ...createSteps['/move-date'],
        ...updateStepPropOverrides,
        controller: MoveDate,
      },
    },
  },
  {
    key: 'move',
    permission: 'move:update_details',
    steps: {
      '/move-details': {
        ...createSteps['/move-details'],
        ...updateStepPropOverrides,
        controller: MoveDetails,
      },
    },
  },
  {
    key: 'court',
    permission: 'move:update_details',
    steps: {
      '/court-information': {
        ...createSteps['/court-information'],
        ...updateStepPropOverrides,
        controller: Court,
      },
    },
  },
  {
    key: 'hospital',
    permission: 'move:update_details',
    steps: {
      '/hospital': {
        ...createSteps['/hospital'],
        ...updateStepPropOverrides,
        controller: Hospital,
      },
    },
  },
  {
    key: 'prison_recall',
    permission: 'move:update_details',
    steps: {
      '/move-details': {
        ...createSteps['/move-details'],
        ...updateStepPropOverrides,
        controller: MoveDetails,
      },
    },
  },
  {
    key: 'video_remand',
    permission: 'move:update_details',
    steps: {
      '/move-details': {
        ...createSteps['/move-details'],
        ...updateStepPropOverrides,
        controller: MoveDetails,
      },
    },
  },
  {
    key: 'risk',
    permission: 'move:update_details',
    steps: {
      '/risk-information': {
        ...createSteps['/risk-information'],
        ...updateStepPropOverrides,
        controller: Assessment,
      },
    },
  },
  {
    key: 'health',
    permission: 'move:update_details',
    steps: {
      '/health-information': {
        ...createSteps['/health-information'],
        ...updateStepPropOverrides,
        controller: Assessment,
      },
    },
  },
]

updateSteps.forEach(updateJourney => {
  const { key, steps } = updateJourney
  const firstStepKey = Object.keys(steps)[0]
  steps[firstStepKey].key = key
})

module.exports = updateSteps
