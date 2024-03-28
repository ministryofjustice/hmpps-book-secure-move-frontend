// @ts-ignore
import faker from 'faker'
import { Selector } from 'testcafe'

// @ts-ignore
import { fillInForm } from '../_helpers'

import { Page } from './page'

export class LodgingCancelPage extends Page {
  constructor() {
    super()

    this.nodes = {
      ...this.nodes,
      reasonInput: Selector('#lodge_cancel_reason'),
      otherReasonInput: Selector('#lodge_cancel_reason_custom'),
    }
  }

  async pickRandomReason() {
    await this.fillField()
    await this.submitForm()
  }

  async fillField() {
    await (this.nodes.reasonInput as Selector).exists
    const fieldsToFill = {
      cancelReason: {
        selector: this.nodes.reasonInput,
        type: 'radio',
      },
    }
    const formAnswers = await fillInForm(fieldsToFill)

    if (formAnswers.cancelReason === 'Another reason') {
      await fillInForm({
        otherReason: {
          selector: this.nodes.otherReasonInput,
          value: faker.lorem.sentence(6),
        },
      })
    }
  }
}
