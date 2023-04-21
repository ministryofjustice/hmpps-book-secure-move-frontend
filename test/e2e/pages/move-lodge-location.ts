import { Selector, t } from 'testcafe'
// @ts-ignore
import { fillInForm } from '../_helpers'

// @ts-ignore // TODO: convert to TS
import Page from './page'

export class MoveLodgeLocationPage extends Page {
  nodes: { [key: string]: Selector }

  constructor() {
    super()

    this.nodes = {
      // @ts-ignore // TODO: remove this comment when ./page is converted to TS
      ...this.nodes,
      locationInput: Selector('#to_location_lodge'),
      submitButton: Selector('button[type=submit]'),
    }
  }

  async pickRandomLocation() {
    await this.fillField()
    // @ts-ignore
    await this.submitForm()
  }

  async fillField() {
    await this.nodes.locationInput.exists
    const fieldsToFill = {
      fromLocation: {
        selector: this.nodes.locationInput,
        type: 'autocomplete',
      },
    }
    return fillInForm(fieldsToFill)
  }
}
