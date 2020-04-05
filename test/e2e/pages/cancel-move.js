import { Selector, t } from 'testcafe'

import Page from './page'
import { selectFieldsetOption } from '../_helpers'

class CancelMovePage extends Page {
  constructor() {
    super()

    this.nodes = {
      cancellationReasonComment: Selector('#cancellation_reason_comment'),
    }
  }

  /**
   * Select a reason for cancellation
   *
   * @returns {Promise}
   */
  async selectReason(reason, comment) {
    await selectFieldsetOption(
      'Why are you cancelling this move request?',
      reason
    )

    if (comment) {
      await t.typeText(this.nodes.cancellationReasonComment, comment)
    }
  }
}

export default CancelMovePage
