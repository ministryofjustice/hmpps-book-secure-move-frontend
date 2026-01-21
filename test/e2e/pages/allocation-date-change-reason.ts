import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import { Page } from './page'

class AllocationDateChangeReasonPage extends Page {
  fields: { date_changed_reason: Selector }
  errorList: any[]

  constructor() {
    super()
    this.fields = {
      date_changed_reason: Selector('#date_changed_reason'),
    }
    this.errorList = [
      (this.nodes.errorSummary as Selector)
        .find('a')
        .withAttribute('href', '#date_changed_reason'),
    ]
  }

  async fill() {
    await t
      .expect(this.getCurrentUrl())
      .match(
        /\/allocation\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/edit\/date-changed-reason$/
      )

    const fieldsToFill = {
      reason: {
        selector: this.fields.date_changed_reason,
        value: 'tornado_event',
      },
    }

    return fillInForm(fieldsToFill)
  }
}
export default AllocationDateChangeReasonPage
