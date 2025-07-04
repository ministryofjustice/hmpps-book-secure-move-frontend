const createSteps = require('../new/steps')

const {
  Court,
  DateChangedReason,
  Hospital,
  MoveDate,
  MoveDetails,
  PersonalDetails,
  RecallInfo,
} = require('./controllers')
const HealthInformation = require('./controllers/health-information').default
const RiskInformation = require('./controllers/risk-information').default

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
        template: '../../edit/views/move-date',
        next: 'date-changed-reason',
        buttonText: 'Continue',
      },
      '/date-changed-reason': {
        controller: DateChangedReason,
        ...updateStepPropOverrides,
        fields: ['date_changed_reason'],
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
        controller: RiskInformation,
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
        controller: HealthInformation,
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
