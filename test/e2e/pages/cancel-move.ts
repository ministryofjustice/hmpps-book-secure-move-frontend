import { Selector } from 'testcafe'

import { fillInForm } from '../_helpers'

import { Page } from './page'

class CancelMovePage extends Page {
  fields: {
    cancellationReason: Selector
    cancellationReasonCancelledByPMUComment: Selector
  }

  constructor() {
    super()

    this.fields = {
      cancellationReason: Selector('[name="cancellation_reason"]'),
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
  selectReason(reason: string, comment?: string) {
    const fields: any = {
      cancellation_reason: {
        selector: this.fields.cancellationReason,
        value: reason,
        type: 'radio',
      },
    }

    if (
      comment &&
      reason === 'Population Management Unit (PMU) cancelled request'
    ) {
      fields.cancellation_reason_cancelled_by_pmu_comment = {
        selector: this.fields.cancellationReasonCancelledByPMUComment,
        value: comment,
      }
    }

    return fillInForm(fields)
  }
}

export default CancelMovePage
