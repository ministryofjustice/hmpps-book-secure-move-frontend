import { Selector } from 'testcafe'

import CancelMove from './cancel-move'

class AllocationCancelPage extends CancelMove {
  constructor() {
    super()
    this.nodes = {
      ...this.nodes,
      linkToFirstAllocation: Selector('.govuk-table td:first-of-type a'),
      cancelLink: Selector('a').withText('Cancel allocation'),
      cancellationReason: Selector('[name="cancellation_reason"]'),
      cancellationReasonComment: Selector('#cancellation_reason_comment'),
      statusHeading: Selector(
        '.app-message.app-message--temporary .app-message__heading'
      ).withText('Allocation cancelled'),
      statusContent: Selector(
        '.app-message.app-message--temporary .app-message__content'
      ),
    }
  }
}
export default AllocationCancelPage
