import { pmuUser } from './_roles'
import { newAllocation } from './_routes'
import { allocationJourney } from './pages/'

fixture('Cancel allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)

  const allocation = await allocationJourney.createAllocation()
  const confirmationLink = allocationJourney.allocationViewPage.nodes.confirmationLink(
    allocation.movesCount
  )

  await t
    .expect(confirmationLink.exists)
    .ok('Confirmation should contain allocation link')
    .click(confirmationLink)

  await t.click(allocationJourney.allocationCancelPage.nodes.cancelLink)
})

test('Reason — `Made in error`', async t => {
  const filledForm = await allocationJourney.allocationCancelPage.fill({
    reason: 'Made in error',
  })
  await allocationJourney.allocationCancelPage.submitForm()

  await allocationJourney.allocationCancelPage.checkCancellation({
    reason: filledForm.cancellationReason,
  })
})

test('Reason — `Another reason`', async t => {
  const filledForm = await allocationJourney.allocationCancelPage.fill({
    reason: 'Another reason',
  })
  await allocationJourney.allocationCancelPage.submitForm()

  await allocationJourney.allocationCancelPage.checkCancellation({
    reason: filledForm.cancellationReasonOtherComment,
  })
})
