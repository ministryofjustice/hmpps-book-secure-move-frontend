import {
  AllocationDateChangedReasonController,
  AllocationDateController,
} from '../controllers/edit'

const createSteps = require('./create')

const updateStepPropOverrides = {
  entryPoint: true,
  backLink: null,
  buttonText: 'actions::continue'
}

const updateSteps = [
  {
    key: 'allocation_date',
    permission: 'allocation:update',
    steps: {
      '/allocation-date': {
        ...createSteps['/allocation-details'],
        ...updateStepPropOverrides,
        controller: AllocationDateController,
        next: 'date-changed-reason',
        key: 'allocation_details'
      },
      '/date-changed-reason': {
        ...updateStepPropOverrides,
        controller: AllocationDateChangedReasonController,
        key: 'date_changed_reason',
        fields: ['date_changed_reason']
      }
    }
  }
]

export default updateSteps
