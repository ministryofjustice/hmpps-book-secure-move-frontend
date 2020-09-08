import { Selector } from 'testcafe'

import { fillInForm } from '../_helpers'

import Page from './page'

class CancelMovePage extends Page {
  constructor() {
    super()

    this.fields = {
      cancellationReason: Selector('[name="cancellation_reason"]'),
      cancellationReasonOtherComment: Selector(
        '#cancellation_reason_other_comment'
      ),
    }
  }

  /**
   * Select a reason for cancellation
   *
   * @returns {Promise}
   */
  async selectReason(reason, comment) {
    const fields = {
      cancellation_reason: {
        selector: this.fields.cancellationReason,
        value: reason,
        type: 'radio',
      },
    }

    if (comment) {
      fields.cancellation_reason_other_comment = {
        selector: this.fields.cancellationReasonOtherComment,
        value: comment,
      }
    }

    return fillInForm(fields)
  }
}

export default CancelMovePage
