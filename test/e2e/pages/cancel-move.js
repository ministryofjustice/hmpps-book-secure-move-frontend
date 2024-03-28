import { Selector } from 'testcafe'

import { fillInForm } from '../_helpers'

import { Page } from './page'

class CancelMovePage extends Page {
  constructor() {
    super()

    this.fields = {
      cancellationReason: Selector('[name="cancellation_reason"]'),
      cancellationReasonOtherComment: Selector(
        '#cancellation_reason_other_comment'
      ),
      cancellationReasonCancelledByPMUComment: Selector(
        '#cancellation_reason_cancelled_by_pmu_comment'
      ),
    }
  }

  /**
   * Select a reason for cancellation
   *
   * @returns {Promise}
   */
  selectReason(reason, comment) {
    const fields = {
      cancellation_reason: {
        selector: this.fields.cancellationReason,
        value: reason,
        type: 'radio',
      },
    }

    if (comment) {
      if (reason === 'Another reason') {
        fields.cancellation_reason_other_comment = {
          selector: this.fields.cancellationReasonOtherComment,
          value: comment,
        }
      } else if (reason === 'Cancelled by Population Management Unit (PMU)') {
        fields.cancellation_reason_cancelled_by_pmu_comment = {
          selector: this.fields.cancellationReasonCancelledByPMUComment,
          value: comment,
        }
      }
    }

    return fillInForm(fields)
  }
}

export default CancelMovePage
