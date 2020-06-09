import { Selector } from 'testcafe'

import Page from './page'

class AllocationViewPage extends Page {
  constructor() {
    super()
    this.nodes = {
      ...this.nodes,
      heading: Selector('h1.govuk-heading-l'),
      summary: {
        selector: Selector('.govuk-summary-list'),
        keys: [
          'Prisoner category',
          'Time left to serve',
          'Complex cases for prisons to agree',
          'Other criteria',
        ],
      },
      meta: {
        selector: Selector('.app-meta-list'),
        keys: ['Number of prisoners', 'From', 'To', 'Date'],
      },
    }
  }
}

export default AllocationViewPage
