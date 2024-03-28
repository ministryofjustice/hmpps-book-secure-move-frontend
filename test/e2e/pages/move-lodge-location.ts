import { Selector } from 'testcafe'

// @ts-ignore
import { fillInForm } from '../_helpers'

import { Page } from './page'

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

  async pickRandomLocation(except?: string) {
    const location = (await this.fillField(except)).fromLocation
    // @ts-ignore
    await this.submitForm()

    return location
  }

  async fillField(except?: string) {
    await this.nodes.locationInput.exists
    const fieldsToFill = {
      fromLocation: {
        selector: this.nodes.locationInput,
        type: 'autocomplete',
        value: {
          type: 'random',
          except,
        },
      },
    }
    return fillInForm(fieldsToFill)
  }
}
