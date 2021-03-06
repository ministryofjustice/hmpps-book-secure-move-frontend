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
    const details = await allocationDetailsPage.fill()
    await this.submitForm()

    const criteria = await allocationCriteriaPage.fill()
    await this.submitForm()

    const currentUrl = await allocationJourney.getCurrentUrl()
    await t
      .expect(currentUrl)
      .match(
        new RegExp('/allocation/' + this.uuidRegex.source + '/confirmation')
      )

    return {
      id: currentUrl.match(new RegExp(allocationJourney.uuidRegex))[0],
      ...details,
      ...criteria,
    }
  }
}
export default AllocationJourney
