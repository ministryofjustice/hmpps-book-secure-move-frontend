import { pmuUser } from './_roles'
import { newAllocation } from './_routes'
import { allocationJourney } from './pages/'

fixture('New PMU allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)
})

test('Create allocation and verify the result', async t => {
  const allocationId = await allocationJourney.createAllocation()
  await t.navigateTo(`/allocation/${allocationId}`)

  for (const section of ['summary', 'meta']) {
    for (const key of allocationJourney.allocationViewPage.nodes[section]
      .keys) {
      const selector =
        allocationJourney.allocationViewPage.nodes[section].selector

      await t
        .expect(
          allocationJourney.allocationViewPage.getDlDefinitionByKey(
            selector,
            key
          )
        )
        .ok()
    }
  }
})

test('Check validation errors on allocation details page', async t => {
  await allocationJourney.submitForm()

  for (const item of allocationJourney.allocationDetailsPage.errorLinks) {
    const error = allocationJourney.findErrorInList(item)
    await t.expect(error).ok()
  }
})

test('Check validation errors on allocation criteria page', async t => {
  await allocationJourney.triggerValidationOnAllocationCriteriaPage()

  for (const item of allocationJourney.allocationCriteriaPage.errorLinks) {
    const error = allocationJourney.findErrorInList(item)
    await t.expect(error).ok()
  }
})
