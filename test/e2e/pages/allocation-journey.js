import { t } from 'testcafe'

import AllocationCancelPage from './allocation-cancel'
import AllocationCriteriaPage from './allocation-criteria'
import AllocationDetailsPage from './allocation-details'
import AllocationViewPage from './allocation-view'
import Page from './page'

import { allocationJourney } from './index'

const allocationDetailsPage = new AllocationDetailsPage()
const allocationCriteriaPage = new AllocationCriteriaPage()
const allocationCancelPage = new AllocationCancelPage()
const allocationViewPage = new AllocationViewPage()

class AllocationJourney extends Page {
  constructor() {
    super()
    this.allocationCancelPage = allocationCancelPage
    this.allocationCriteriaPage = allocationCriteriaPage
    this.allocationDetailsPage = allocationDetailsPage
    this.allocationViewPage = allocationViewPage
  }

  async createAllocation() {
    await allocationDetailsPage.fill()
    await this.submitForm()
    await allocationCriteriaPage.fill()
    await this.submitForm()
    const currentUrl = await allocationJourney.getCurrentUrl()
    await t
      .expect(currentUrl)
      .match(
        new RegExp('/allocation/' + this.uuidRegex.source + '/confirmation')
      )
    return currentUrl.match(new RegExp(allocationJourney.uuidRegex))[0]
  }

  async triggerValidationOnAllocationCriteriaPage() {
    await allocationDetailsPage.fill()
    await this.submitForm()
    await this.submitForm()
  }

  findErrorInList(hrefAttribute) {
    return allocationDetailsPage.errorSummary
      .child('a')
      .withAttribute('href', hrefAttribute)
  }
}
export default AllocationJourney
