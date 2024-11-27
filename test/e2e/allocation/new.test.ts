import { pmuUser } from '../_roles'
import { newAllocation } from '../_routes'
import { allocationJourney } from '../pages'

fixture('New PMU allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)
})

test('Create allocation and verify the result', async t => {
  const allocation = await allocationJourney.createAllocation()
  const confirmationLink = (
    allocationJourney.allocationViewPage.nodes.confirmationLink as Selector
  )(allocation.movesCount)

  await t
    .expect(confirmationLink.exists)
    .ok('Confirmation should contain allocation link')
    .click(confirmationLink)

  await allocationJourney.allocationViewPage.checkCriteria(allocation)
  await allocationJourney.allocationViewPage.checkSummary(allocation)

  // TODO: Find a more robust way to test the presence of an allocation
  // on the listing page
  //
  // We have introduced pagination that prevents the test from being
  // able to guarantee the presence of this allocation on the first page
  // of the listing page

  // await t.navigateTo(allocationsWithDate(allocation.date))
  // const allocationDashboardLink = Selector('a').withAttribute(
  //   'href',
  //   `/allocation/${allocation.id}`
  // )
  // await t
  //   .expect(allocationDashboardLink.exists)
  //   .ok('Dashboard should contain allocation')
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

test('Check validation errors for same destination as current location', async t => {
  await allocationJourney.allocationDetailsPage.fillSameLocationAndDestination()
  await allocationJourney.submitForm()

  await allocationJourney.checkErrorSummary({
    errorList: allocationJourney.allocationDetailsPage.errorForDestination,
  })
})
