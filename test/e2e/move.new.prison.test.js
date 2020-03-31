import { Selector } from 'testcafe'

import { newMove } from './_routes'
import { prisonUser } from './roles'
import { page, moveDetailPage, createMovePage } from './pages'
import { createPersonFixture } from './helpers'

fixture('New move from Prison').beforeEach(async t => {
  await t.useRole(prisonUser).navigateTo(newMove)
})

test('Prison to Court with unfound person', async t => {
  const searchTerm = 'UNKNOWN_PRISONER'

  // PNC lookup
  await createMovePage.fillInPrisonNumberSearch(searchTerm)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(0, searchTerm)

  await t.expect(page.nodes.submitButton.exists).notOk()

  await t
    .expect(
      createMovePage.steps.personLookupResults.nodes.searchAgainLink.exists
    )
    .ok()

  await t.click(createMovePage.steps.personLookupResults.nodes.searchAgainLink)

  await t
    .expect(page.getCurrentUrl())
    .contains('/move/new/person-lookup-prison-number')
})

test('Prison to Court with existing person', async t => {
  const personalDetails = await createPersonFixture()

  // PNC lookup
  await createMovePage.fillInPrisonNumberSearch(personalDetails.prison_number)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(
    1,
    personalDetails.prison_number
  )
  await createMovePage.selectSearchResults(personalDetails.fullname)
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('Court')
  await page.submitForm()

  // Move date
  await createMovePage.fillInDate()
  await page.submitForm()

  // Court information
  await createMovePage.fillInCourtInformation()
  await page.submitForm()

  // Risk information
  await createMovePage.fillInReleaseStatus()
  await page.submitForm()

  // Health information
  await createMovePage.fillInSpecialVehicle()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: moveDetails.to_location_court_appearance,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader(personalDetails)

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)
})
