const {
  Assessment,
  MoveDate,
  // TODO: reenable when redirect api available
  // MoveDetails,
  PersonalDetails,
} = require('../controllers/update')

const createSteps = require('./create')

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
  // TODO: reenable when redirect api available
  // {
  //   key: 'move',
  //   role: 'move:update',
  //   steps: {
  //     '/move-details': {
  //       ...createSteps['/move-details'],
  //       ...updateStepPropOverrides,
  //       controller: MoveDetails,
  //     },
  //   },
  // },
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
        controller: Assessment,
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
]

module.exports = updateSteps
