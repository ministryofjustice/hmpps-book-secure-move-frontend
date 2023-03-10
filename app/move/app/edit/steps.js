const createSteps = require('../new/steps')

const {
  Assessment,
  Court,
  Hospital,
  MoveDate,
  MoveDetails,
  PersonalDetails,
  RecallInfo,
  AddLodgeController,
  AddLodgeLocationController,
  AddLodgeDateController,
  AddLodgeSaveController,
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
    key: 'recall_info',
    permission: 'move:update',
    steps: {
      '/recall-info': {
        ...createSteps['/recall-info'],
        ...updateStepPropOverrides,
        controller: RecallInfo,
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
    key: 'lodge',
    permission: 'move:update',
    controller: AddLodgeController,
    steps: {
      '/lodge': {
        entryPoint: true,
        reset: true,
        resetJourney: true,
        skip: true,
        controller: AddLodgeController,
        next: 'lodge/location',
      },
      '/lodge/location': {
        controller: AddLodgeLocationController,
        pageTitle: 'moves::steps.lodge.location.heading',
        fields: ['to_location_lodge'],
        next: 'lodge/date',
      },
      '/lodge/date': {
        controller: AddLodgeDateController,
        pageTitle: 'moves::steps.lodge.date.heading',
        fields: ['date_type_lodge'],
        next: 'lodge/add',
      },
      '/lodge/add': {
        skip: true,
        controller: AddLodgeSaveController,
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
