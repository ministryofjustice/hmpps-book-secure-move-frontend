import { Selector, t } from 'testcafe'
// @ts-ignore
import { fillInForm, fillTextField } from '../_helpers'

// @ts-ignore // TODO: convert to TS
import Page from './page'

export class MoveLodgeLengthPage extends Page {
  nodes: { [key: string]: Selector }

  constructor() {
    super()

    this.nodes = {
      // @ts-ignore // TODO: remove this comment when ./page is converted to TS
      ...this.nodes,
      lengthInput: Selector('#lodge_length_type'),
      customLengthInput: Selector('#lodge_length_custom'),
      submitButton: Selector('button[type=submit]'),
    }
  }

  async pickOneDay() {
    await this.fillField('One')
    // @ts-ignore
    await this.submitForm()
  }
  async pickTwoDays() {
    await this.fillField('Two')
    // @ts-ignore
    await this.submitForm()
  }

  async pickCustomDays(customLength: string) {
    await this.fillField('Other')
    const custom = {
      fromLocation: {
        selector: this.nodes.customLengthInput,
        value: customLength
      },
    }
    await fillInForm(custom)
    // @ts-ignore
    await this.submitForm()
  }

  async fillField(days: string) {
    await this.nodes.lengthInput.exists
    const fieldsToFill = {
      fromLocation: {
        selector: this.nodes.lengthInput,
        type: 'radio',
        value: days
      },

    }
    return fillInForm(fieldsToFill)
  }
}
