const createSteps = require('../new/steps')

const {
  Assessment,
  Court,
  Document,
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
    permission: 'move:update',
    steps: {
      '/personal-details': {
        ...createSteps['/personal-details'],
        ...updateStepPropOverrides,
        controller: PersonalDetails,
      },
    },
  },
  {
    key: 'move',
    permission: 'move:update',
    steps: {
      '/move-details': {
        ...createSteps['/move-details'],
        ...updateStepPropOverrides,
        controller: MoveDetails,
      },
    },
  },
  {
    key: 'date',
    permission: 'move:update',
    steps: {
      '/move-date': {
        ...createSteps['/move-date'],
        ...updateStepPropOverrides,
        controller: MoveDate,
      },
    },
  },
  {
    key: 'court',
    permission: 'move:update',
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
    permission: 'move:update',
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
    permission: 'move:update',
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
    permission: 'move:update',
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
    permission: 'move:update',
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
    permission: 'move:update',
    steps: {
      '/health-information': {
        ...createSteps['/health-information'],
        ...updateStepPropOverrides,
        controller: Assessment,
      },
    },
  },
  {
    key: 'document',
    permission: 'move:update',
    steps: {
      '/document': {
        ...createSteps['/document'],
        ...updateStepPropOverrides,
        controller: Document,
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
