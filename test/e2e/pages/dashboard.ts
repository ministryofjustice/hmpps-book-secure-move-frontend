import { Selector } from 'testcafe'

import { Page } from './page'

class DashboardPage extends Page {
  constructor() {
    super()

    this.nodes = {
      singleRequestsSection: Selector('h2')
        .withText('Single requests sent')
        .parent('section'),
      singleRequestsLink: Selector('a').withText('pending review'),
    }
  }
}

export default DashboardPage
