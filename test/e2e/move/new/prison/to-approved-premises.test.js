import { Selector } from 'testcafe'

import { createPersonFixture } from '../../../_helpers'
import { ocaUser } from '../../../_roles'
import { newMove } from '../../../_routes'
import { page, moveDetailPage, createMovePage } from '../../../pages'

fixture('New move from Prison to Prison').beforeEach(async t => {
  await t.useRole(ocaUser).navigateTo(newMove)
})

test('With existing person', async t => {
  const personalDetails = await createPersonFixture()

  // PNC lookup
  await createMovePage.fillInPrisonNumberSearch(personalDetails.prisonNumber)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(1, personalDetails.prisonNumber)
  await createMovePage.selectSearchResults(personalDetails.fullname)
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('Prison')
  await page.submitForm()

  // Move date
  await createMovePage.fillInDateRange()
  await page.submitForm()

  // Transfer reason
  await createMovePage.fillInPrisonTransferReasons()
  await page.submitForm()

  // Agreement status
  await createMovePage.fillInAgreementStatus()
  await page.submitForm()

  // Health information
  await createMovePage.fillInSpecialVehicle()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: moveDetails.prisonLocation,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  await t.click(Selector('a').withExactText('Details'))

  // Move detail assertions
  await moveDetailPage.checkHeader(personalDetails)

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)
})

test('Can be cancelled', async t => {
  const personalDetails = await createPersonFixture()

  // PNC lookup
  await createMovePage.fillInPrisonNumberSearch(personalDetails.prisonNumber)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(1, personalDetails.prisonNumber)
  await createMovePage.selectSearchResults(personalDetails.fullname)
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('AP')
  await page.submitForm()

  // Move date
  await createMovePage.fillInDateRange()
  await page.submitForm()

  // Risk information
  // eslint-disable-next-line no-unused-vars
  const riskInformation = await createMovePage.fillInReleaseStatus()
  await page.submitForm()

  // Health information
  await createMovePage.fillInSpecialVehicle()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: moveDetails.approvedPremisesLocation,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  await t.click(Selector('a').withExactText('Details'))

  // Move detail assertions
  await moveDetailPage.checkHeader(personalDetails)

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)

  await moveDetailPage.checkCancelLink()
})
