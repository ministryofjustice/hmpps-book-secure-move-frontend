import { faker } from '@faker-js/faker'
import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import CancelMove from './cancel-move'

class AllocationCancelPage extends CancelMove {
  constructor() {
    super()

    this.fields = {
      ...this.fields,
      cancellationReason: Selector('[name="cancellation_reason"]'),
      cancellationReasonOtherComment: Selector(
        '#cancellation_reason_other_comment'
      ),
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

  async fill({ reason }: { reason: string }) {
    await t
      .expect(this.getCurrentUrl())
      .match(/\/allocation\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/cancel\/reason$/)

    const fields: any = {
      cancellationReason: {
        selector: this.fields.cancellationReason,
        value: reason,
        type: 'radio',
      },
    }

    if (reason === 'Another reason') {
      fields.cancellationReasonOtherComment = {
        selector: this.fields.cancellationReasonOtherComment,
        value: faker.lorem.sentence(6),
      }
    }

    return fillInForm(fields)
  }

  async checkCancellation({ reason }: { reason: string }) {
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
