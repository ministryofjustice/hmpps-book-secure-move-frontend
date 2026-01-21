import {
  AllocationDateChangedReasonController,
  AllocationDateController
} from '../controllers/edit'

const updateSteps = [
  {
    key: 'allocation_date',
    permission: 'allocation:update',
    steps: {
      '/': {
        entryPoint: true,
        reset: true,
        resetJourney: true,
        skip: true,
        next: 'allocation-date'
      },
      '/allocation-date': {
        backLink: null,
        buttonText: 'actions::continue',
        pageTitle: 'allocation::edit.page_title',
        fields: ['date'],
        controller: AllocationDateController,
        next: 'date-changed-reason',
        key: 'allocation_date'
      },
      '/date-changed-reason': {
        pageTitle: 'allocation::edit.reason_page_title',
        controller: AllocationDateChangedReasonController,
        key: 'date_changed_reason',
        fields: ['date_changed_reason'],
        buttonText: 'actions::save_and_continue'
      }
    }
  }
]

export default updateSteps
