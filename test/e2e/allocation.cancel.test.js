import { ClientFunction } from 'testcafe'

import { pmuUser } from './_roles'
import { newAllocation } from './_routes'
import { allocationJourney, page } from './pages/'

fixture('Cancel allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)

  t.ctx.allocation = await allocationJourney.createAllocation()
  const confirmationLink =
    allocationJourney.allocationViewPage.nodes.confirmationLink(
      t.ctx.allocation.movesCount
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

  const goBack = ClientFunction(() => window.history.back())
  await goBack()

  await t
    .expect(page.getCurrentUrl())
    .match(
      new RegExp(`/allocation/${t.ctx.allocation.id}`),
      'Should redirect back to allocation'
    )
    .expect(page.getCurrentUrl())
    .notContains('/cancel', 'Should not display cancel journey')
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
