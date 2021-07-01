import { Selector } from 'testcafe'

import { createPersonFixture } from './_helpers'
import { ocaUser, pmuUser } from './_roles'
import { allocation, newAllocation } from './_routes'
import { allocationJourney, createMovePage, page } from './pages/'

fixture('Assign a person to an allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)

  t.ctx.personalDetails = await createPersonFixture()
  t.ctx.allocation = await allocationJourney.createAllocation()

  await t.useRole(ocaUser).navigateTo(allocation(t.ctx.allocation.id))
})

test('Assign person', async t => {
  const { allocation, personalDetails } = t.ctx
  // Add person
  await t.click(allocationJourney.allocationViewPage.nodes.addPersonButton)

  // PNC lookup
  await createMovePage.fillInPrisonNumberSearch(personalDetails.prisonNumber)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(1, personalDetails.prisonNumber)
  await createMovePage.selectSearchResults(personalDetails.fullname)
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
  await t.click(Selector('a').withText(allocation.toLocation))

  await t
    .expect(allocationJourney.allocationViewPage.nodes.allocatedMoves.count)
    .eql(1, 'Should contain one allocated move')

  // Click remove button
  await t.click(
    allocationJourney.allocationViewPage.nodes.removePersonButton(
      personalDetails.fullname
    )
  )

  // Remove person
  await page.submitForm()

  await t
    .expect(allocationJourney.allocationViewPage.nodes.allocatedMoves.count)
    .eql(0, 'Should not contain any allocated moves')
})
