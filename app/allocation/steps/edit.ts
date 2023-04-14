import { AllocationDetailsController } from '../controllers/edit'

const createSteps = require('./create')

const updateStepPropOverrides = {
  entryPoint: true,
  backLink: null,
  next: undefined,
  buttonText: 'actions::save_and_continue',
}

const updateSteps = [
  {
    key: 'allocation_details',
    permission: 'allocation:update',
    steps: {
      '/allocation-details': {
        ...createSteps['/allocation-details'],
        ...updateStepPropOverrides,
        controller: AllocationDetailsController,
        key: 'allocation_details',
      },
    },
  },
]

export default updateSteps
