import { Selector } from 'testcafe'

import { pmuUser } from './_roles'
import { newAllocation } from './_routes'
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
})

test('Check validation errors on allocation details page', async t => {
  // submit details page without values
  await allocationJourney.submitForm()

  for (const item of allocationJourney.allocationDetailsPage.errorLinks) {
    const error = allocationJourney.findErrorInList(item)
    await t.expect(error).ok()
  }

  // fill in and submit details page
  await allocationJourney.allocationDetailsPage.fill()
  await allocationJourney.submitForm()

  // submit criteria page without values
  await allocationJourney.submitForm()

  for (const item of allocationJourney.allocationCriteriaPage.errorLinks) {
    const error = allocationJourney.findErrorInList(item)
    await t.expect(error).ok()
  }
})
