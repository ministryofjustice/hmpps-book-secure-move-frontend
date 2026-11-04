import { Selector } from 'testcafe'

import { createPersonFixture } from '../_helpers'
import { ocaUser, pmuUser, supplierUser } from '../_roles'
import { allocation as allocationUrl, getMove, newAllocation } from '../_routes'
import {
  allocationJourney,
  createMovePage,
  moveDetailPage,
  page,
} from '../pages'

fixture('Assign a person to an allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)

  t.ctx.personalDetails = await createPersonFixture()
  t.ctx.allocation = await allocationJourney.createAllocation()

  await t.useRole(ocaUser).navigateTo(allocationUrl(t.ctx.allocation.id))
})

test('Assign person', async t => {
  const { allocation, personalDetails } = t.ctx
  // Add person
  await t.click(
    allocationJourney.allocationViewPage.nodes.addPersonButton as Selector
  )

  // PNC lookup
  await createMovePage.fillInPrisonNumberSearch(personalDetails.prisonNumber)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(1, personalDetails.prisonNumber)
  await createMovePage.selectSearchResults(personalDetails.fullname)
  await page.submitForm()

  // Prison transfer reason
  const { prisonTransferReason } =
    await createMovePage.fillInPrisonTransferReasons()
  await page.submitForm()

  // Agreement status
  await createMovePage.fillInAgreementStatus()
  await page.submitForm()

  // Risk information
  await page.submitForm()

  // Health information
  await createMovePage.fillInSpecialVehicle()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: allocation.toLocation,
  })
  const confirmationUrl = await createMovePage.getCurrentUrl()
  const moveId = confirmationUrl.split('/move/')[1].split('/')[0]

  await t.click(Selector('a').withText(allocation.toLocation))

  await t
    .expect(
      (allocationJourney.allocationViewPage.nodes.allocatedMoves as Selector)
        .count
    )
    .eql(1, 'Should contain one allocated move')

  // Supplier sees the reason for transfer on the move front page
  await t.useRole(supplierUser).navigateTo(getMove(moveId))
  await moveDetailPage.checkSummaryList(
    moveDetailPage.nodes.moveDetails as Selector,
    { 'Reason for move': prisonTransferReason }
  )

  await t.useRole(ocaUser).navigateTo(allocationUrl(allocation.id))

  // Click remove button
  await t.click(
    (allocationJourney.allocationViewPage.nodes.removePersonButton as Selector)(
      personalDetails.fullname
    )
  )

  // Remove person
  await page.submitForm()

  await t
    .expect(
      (allocationJourney.allocationViewPage.nodes.allocatedMoves as Selector)
        .count
    )
    .eql(0, 'Should not contain any allocated moves')
})
