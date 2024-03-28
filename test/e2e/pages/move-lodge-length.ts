import { Selector } from 'testcafe'

// @ts-ignore
import { fillInForm } from '../_helpers'

import { Page } from './page'

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

  async pickDays(days: number) {
    if (days === 1) {
      await this.pickOneDay()
    } else if (days === 2) {
      await this.pickTwoDays()
    } else {
      await this.pickCustomDays(days.toString())
    }
  }

  private async pickOneDay() {
    await this.fillField('One')
    // @ts-ignore
    await this.submitForm()
  }

  private async pickTwoDays() {
    await this.fillField('Two')
    // @ts-ignore
    await this.submitForm()
  }

  private async pickCustomDays(customLength: string) {
    await this.fillField('Other')
    const custom = {
      fromLocation: {
        selector: this.nodes.customLengthInput,
        value: customLength,
      },
    }
    await fillInForm(custom)
    // @ts-ignore
    await this.submitForm()
  }

  private async fillField(days: string) {
    await this.nodes.lengthInput.exists
    const fieldsToFill = {
      fromLocation: {
        selector: this.nodes.lengthInput,
        type: 'radio',
        value: days,
      },
    }
    return fillInForm(fieldsToFill)
  }
}
