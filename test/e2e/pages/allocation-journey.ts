import { t } from 'testcafe'

import AllocationCancelPage from './allocation-cancel'
import AllocationCriteriaPage from './allocation-criteria'
import AllocationDetailsPage from './allocation-details'
import AllocationViewPage from './allocation-view'
import { Page } from './page'

import { allocationJourney } from './index'
import AllocationDateChangePage from './allocation-date-change'
import AllocationDateChangeReasonPage from './allocation-date-change-reason'

const allocationDetailsPage = new AllocationDetailsPage()
const allocationCriteriaPage = new AllocationCriteriaPage()
const allocationCancelPage = new AllocationCancelPage()
const allocationViewPage = new AllocationViewPage()
const allocationDateChangePage = new AllocationDateChangePage()

const allocationDateChangeReasonPage = new AllocationDateChangeReasonPage()

class AllocationJourney extends Page {
  allocationCancelPage: AllocationCancelPage
  allocationCriteriaPage: AllocationCriteriaPage
  allocationDateChangePage: AllocationDateChangePage
  allocationDateChangeReasonPage: AllocationDateChangeReasonPage
  allocationViewPage: AllocationViewPage
  allocationDetailsPage: AllocationDetailsPage
  constructor() {
    super()
    this.allocationCancelPage = allocationCancelPage
    this.allocationCriteriaPage = allocationCriteriaPage
    this.allocationDateChangePage = allocationDateChangePage
    this.allocationDateChangeReasonPage = allocationDateChangeReasonPage
    this.allocationDetailsPage = allocationDetailsPage
    this.allocationViewPage = allocationViewPage
  }

  async createAllocation(): Promise<Record<string, string>> {
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
      id: currentUrl.match(new RegExp(allocationJourney.uuidRegex))?.[0] || '',
      ...details,
      ...criteria,
    }
  }
}
export default AllocationJourney
