import { pmuUser } from './_roles'
import { newAllocation } from './_routes'
import { allocationJourney } from './pages/'

fixture('New PMU allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)
})
test('Create allocation and verify the result', async t => {
  const allocationId = await allocationJourney.createAllocation()
  await t.navigateTo(`/allocation/${allocationId}`)
  ;['summary', 'meta'].forEach(async section => {
    for (const o of allocationJourney.allocationViewPage.nodes[section].keys) {
      const textExists = allocationJourney.allocationViewPage.getDlDefinitionByKey(
        allocationJourney.allocationViewPage.nodes[section].selector,
        o
      )
      await t.expect(textExists).ok()
    }
  })
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
