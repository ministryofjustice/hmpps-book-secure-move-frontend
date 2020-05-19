import { Selector } from 'testcafe'

import Page from './page'

class AllocationViewPage extends Page {
  constructor() {
    super()
    this.nodes = {
      heading: Selector('h1.govuk-heading-l'),
      listElements: {
        category: 'Category',
      },
      summary: {
        selector: Selector('.govuk-summary-list'),
        keys: [
          'Time left to serve',
          'Complex cases for prisons to agree',
          'Other criteria',
        ],
      },
      meta: {
        selector: Selector('.app-meta-list'),
        keys: ['Number of people', 'Move from', 'Move to', 'Date'],
      },
    }
  }
}
export default AllocationViewPage
