import { Selector } from 'testcafe'

import { pmuUser } from './_roles'
import { allocationsWithDate, newAllocation } from './_routes'
import { allocationJourney } from './pages/'

fixture('New PMU allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)
})

test('Create allocation and verify the result', async t => {
  const allocation = await allocationJourney.createAllocation()

  const confirmationLink = Selector('a').withExactText(
    `${allocation.movesCount} people`
  )
  await t
    .expect(confirmationLink.exists)
    .ok('Confirmation should contain allocation link')
    .click(confirmationLink)

  await allocationJourney.allocationViewPage.checkCriteria(allocation)
  await allocationJourney.allocationViewPage.checkSummary(allocation)

  await t.navigateTo(allocationsWithDate(allocation.date))
  const allocationDashboardLink = Selector('a').withAttribute(
    'href',
    `/allocation/${allocation.id}`
  )
  await t
    .expect(allocationDashboardLink.exists)
    .ok('Dashboard should contain allocation')
})

test('Check validation errors on allocation details page', async t => {
  // submit details page without values
  await allocationJourney.submitForm()

  await allocationJourney.checkErrorSummary({
    errorList: allocationJourney.allocationDetailsPage.errorList,
  })

  // fill in and submit details page
  await allocationJourney.allocationDetailsPage.fill()
  await allocationJourney.submitForm()

  // submit criteria page without values
  await allocationJourney.submitForm()

  await allocationJourney.checkErrorSummary({
    errorList: allocationJourney.allocationCriteriaPage.errorList,
  })
})
