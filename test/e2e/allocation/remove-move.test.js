import { ClientFunction } from 'testcafe'

import { pmuUser } from '../_roles'
import { newAllocation } from '../_routes'
import { allocationJourney, page } from '../pages'

fixture('Remove a move from an allocation').beforeEach(async t => {
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
})

test('Remove move', async t => {
  const movesCount = parseInt(t.ctx.allocation.movesCount)
  // choose an item to remove
  const itemToRemove = Math.floor(Math.random() * movesCount)
  // store reference for future assertion
  const itemReference =
    await allocationJourney.allocationViewPage.nodes.allocatedMovesReferences.nth(
      itemToRemove
    ).innerText

  await t.click(
    allocationJourney.allocationViewPage.nodes.allocatedMovesRemoveLinks.nth(
      itemToRemove
    )
  )

  await page.submitForm()

  await t
    .expect(allocationJourney.allocationViewPage.nodes.allocatedMoves.count)
    .eql(movesCount - 1, 'Should contain one less move')
    .expect(
      allocationJourney.allocationViewPage.nodes.allocatedMoves.withText(
        itemReference
      ).count
    )
    .eql(0, 'Should not contain removed move')

  const goBack = ClientFunction(() => window.history.back())
  await goBack()

  await t
    .expect(page.getCurrentUrl())
    .match(
      new RegExp(`/allocation/${t.ctx.allocation.id}`),
      'Should redirect back to allocation'
    )
    .expect(page.getCurrentUrl())
    .notContains('/remove', 'Should not display remove journey')
})
