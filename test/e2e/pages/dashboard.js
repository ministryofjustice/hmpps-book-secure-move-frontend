import { Selector } from 'testcafe'

import Page from './page'

class DashboardPage extends Page {
  constructor() {
    super()

    this.nodes = {
      singleRequestsSection: Selector('h2')
        .withText('Single requests this week')
        .parent('section'),
      singleRequestsLink: Selector('a').withText('sent for review'),
    }
  }
}

export default DashboardPage
