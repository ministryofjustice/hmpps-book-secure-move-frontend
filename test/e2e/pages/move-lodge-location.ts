import { Selector } from 'testcafe'

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
      submit: Selector('button[type=submit]'),
    }
  }
}
