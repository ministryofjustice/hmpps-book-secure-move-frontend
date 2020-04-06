import { Selector } from 'testcafe'

import Page from './page'
import { fillInForm } from '../_helpers'

class CancelMovePage extends Page {
  constructor() {
    super()

    this.fields = {
      cancellationReason: Selector('[name="cancellation_reason"]'),
      cancellationReasonComment: Selector('#cancellation_reason_comment'),
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
      fields.cancellation_reason_comment = {
        selector: this.fields.cancellationReasonComment,
        value: comment,
      }
    }

    return fillInForm(fields)
  }
}

export default CancelMovePage
