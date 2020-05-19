import { Selector } from 'testcafe'

import Page from './page'

class AllocationCancelPage extends Page {
  constructor() {
    super()
    this.nodes = {
      ...this.nodes,
      linkToFirstAllocation: Selector('.govuk-table td:first-of-type a'),
      cancelLink: Selector('a').withText('Cancel allocation'),
      statusHeading: Selector(
        '.app-message.app-message--temporary .app-message__heading'
      ).withText('Allocation cancelled'),
    }
  }
}
export default AllocationCancelPage
