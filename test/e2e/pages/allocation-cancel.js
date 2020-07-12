import faker from 'faker'
import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import CancelMove from './cancel-move'

class AllocationCancelPage extends CancelMove {
  constructor() {
    super()

    this.fields = {
      ...this.fields,
      cancellationReason: Selector('[name="cancellation_reason"]'),
      cancellationReasonComment: Selector('#cancellation_reason_comment'),
    }

    this.nodes = {
      ...this.nodes,
      linkToFirstAllocation: Selector('.govuk-table td:first-of-type a'),
      cancelLink: Selector('a').withText('Cancel this allocation'),
      statusHeading: Selector(
        '.app-message.app-message--temporary .app-message__heading'
      ).withText('Allocation cancelled'),
      statusContent: Selector(
        '.app-message.app-message--temporary .app-message__content'
      ),
    }
  }

  async fill({ reason }) {
    await t
      .expect(this.getCurrentUrl())
      .match(/\/allocation\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/cancel\/reason$/)

    const fields = {
      cancellationReason: {
        selector: this.fields.cancellationReason,
        value: reason,
        type: 'radio',
      },
    }

    if (reason === 'Another reason') {
      fields.cancellationReasonComment = {
        selector: this.fields.cancellationReasonComment,
        value: faker.lorem.sentence(6),
      }
    }

    return fillInForm(fields)
  }

  async checkCancellation({ reason }) {
    await t
      .expect(this.getCurrentUrl())
      .match(/\/allocation\/[\w]{8}(-[\w]{4}){3}-[\w]{12}$/)

    await this.checkBanner({
      heading: 'Allocation cancelled',
      content: `Reason — ${reason}`,
    })
  }
}
export default AllocationCancelPage
